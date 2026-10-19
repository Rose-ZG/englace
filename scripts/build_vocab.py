"""Build compact, tagged learning packs from the upstream ECDICT CSV.
Usage: python scripts/build_vocab.py .cache/ecdict.csv
Source and original license are retained in data/.
"""
import csv, hashlib, json, pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent.parent
source = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else root / '.cache/ecdict.csv'
tags = {'gaokao': 'gk', 'cet4': 'cet4', 'cet6': 'cet6', 'ielts': 'ielts', 'toefl': 'toefl', 'postgrad': 'ky'}
packs = {k: [] for k in tags}
seen = {k: set() for k in tags}
with source.open(encoding='utf-8', newline='') as stream:
    for row in csv.DictReader(stream):
        word = row['word'].strip().lower()
        if not re.fullmatch(r"[a-z][a-z '\-]{0,59}", word) or not row['translation'].strip():
            continue
        # Keep full bilingual senses; literal upstream newlines become actual lines.
        entry = {'id': word, 'word': word, 'phonetic': row['phonetic'],
                 'meaning': row['translation'].replace('\\n', '\n'),
                 'definition': row['definition'].replace('\\n', '\n'),
                 'frequency': int(row['frq'] or row['bnc'] or 999999) or 999999,
                 'source': 'ECDICT', 'example': '', 'translation': ''}
        for key, tag in tags.items():
            if tag in row['tag'].split() and word not in seen[key]:
                packs[key].append(entry)
                seen[key].add(word)
metadata = {'source': 'https://github.com/skywind3000/ECDICT', 'license': 'MIT (upstream declaration)',
            'sourceFileSha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'built': '2026-10-19', 'packs': {}}
for key, entries in packs.items():
    entries.sort(key=lambda e: (e['frequency'], e['word']))
    target = root / 'data' / (key + '.json')
    target.write_text(json.dumps(entries, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    metadata['packs'][key] = {'count': len(entries), 'tag': tags[key], 'bytes': target.stat().st_size}
(root / 'data/manifest.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(metadata['packs'], ensure_ascii=True, indent=2))
