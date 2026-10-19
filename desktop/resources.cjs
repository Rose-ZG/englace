'use strict';
// Shared explicit allowlist for HTTP serving and packaged application resources.
const publicFiles=['index.html','download.html','download.css','app.js','core.js','learning.js','features.js','style.css','upgrade.css','features.css','vocabulary.css','vocabulary.js','vocab-core.js','atlas.js','atlas.css','arcade.js','arcade-core.js','experience-core.js','experience.js','experience.css','wardrobe.js','arcade-audio.js','pet-art.js','desktop-pet.html','desktop-pet.js','desktop-pet.css','favicon.svg'];
const packagedFiles=[...publicFiles,'server.js','ai-server.js','package.json','desktop/main.cjs','desktop/preload.cjs','desktop/resources.cjs','data/*.json','data/*.txt','audio/*.wav','assets/*.svg','assets/*.png','docs/PRIVACY.md','docs/SOURCES.md','docs/DESKTOP.md'];
module.exports={publicFiles,packagedFiles};
