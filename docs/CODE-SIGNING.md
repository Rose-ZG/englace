# Code signing policy

Updated: 2026-10-19.

## Current status

Englace (英格雷斯) is preparing an application for free code signing through
[SignPath Foundation](https://signpath.org/apply.html). No application approval or
signing certificate has been received. The existing v0.7.0 Windows downloads are
unsigned. An MIT license added after that release does not alter its binaries.

The project must not describe an unsigned release as signed. Existing release
files and their SHA-256 checksums will not be silently replaced during this process.

## Project and responsibilities

- Repository: <https://github.com/Rose-ZG/englace>
- Releases: <https://github.com/Rose-ZG/englace/releases>
- Source license: [MIT](../LICENSE). Third-party material retains its own terms;
  see [content sources](SOURCES.md) and `data/ECDICT-LICENSE.txt`.
- Maintainer, committer, reviewer and proposed signing approver:
  [Rose-ZG](https://github.com/Rose-ZG). This is the proposed single-maintainer
  arrangement, subject to provider acceptance.
- GitHub and SignPath MFA status must be verified by the account owner before
  activation; the project does not currently attest that this has been completed.

## Intended release controls

Windows builds are defined in `.github/workflows/windows-desktop.yml`, with
dependencies pinned in `package-lock.json`. Before signing activation, the
maintainer must configure the provider's trusted GitHub build integration, inspect
the artifact rules and approve the signing policy. Signing secrets must live in
GitHub Actions secrets or the provider, never the repository, app or logs.

Every signed release must receive manual approval. Product identity and version
must be enforced by the signing configuration. Application binaries and outer
NSIS/portable packages require an agreed signing order; no production signing
integration is enabled yet. SHA-256 checksums must be generated after signing.

After approval, this page and release/download pages will identify the actual
signing provider and certificate publisher, using the attribution required by
the provider. No provider endorsement is claimed before approval.

## Privacy

See [privacy policy](PRIVACY.md). Learning profiles are local. Online AI and video
features connect only after an explicit user action; provider API keys are not
bundled with the application or included in signing submissions.

## Application preparation

Public application facts:

> Englace is an MIT-licensed Windows desktop English learning application for
> Chinese learners. It offers exam-specific vocabulary practice, word relationship
> maps, learning games, listening and writing exercises, speaking practice,
> local progress tracking and a customizable learning companion. It is built
> with JavaScript, Node.js and Electron. The app requires no learning account;
> user profiles stay on the local computer. Optional online AI and video features
> require an explicit user action. The repository and Windows v0.7.0 release are
> publicly available. The current release is unsigned. We request evaluation for
> free Windows code signing and guidance on trusted GitHub Actions builds and
> Electron/NSIS/portable artifact configuration.

Disclose during review: this is a newly published project, not an established
application with a long reputation history. The bundled ECDICT compilation and
synthetic audio provenance are documented in SOURCES.md; this inventory does not
constitute an independent legal audit of upstream material.

The applicant must supply their chosen contact details privately, verify MFA,
and review the [provider's conditions](https://signpath.org/terms.html). Personal
contact details, identity documents, tokens and signed application forms must
not be committed to the public repository.
