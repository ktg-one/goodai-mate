const fs = require('fs');
let code = fs.readFileSync('src/app/globals.css', 'utf8');

code = code.replace(/--font-sora:\s*var\(--font-sora, "Sora"\), ui-sans-serif, system-ui, sans-serif;/g, '--font-sans: var(--font-sora, "Sora"), ui-sans-serif, system-ui, sans-serif;');
code = code.replace(/--font-instrument:\s*var\(--font-instrument, "Instrument Serif"\), Georgia, serif;/g, '--font-display: var(--font-instrument, "Instrument Serif"), Georgia, serif;');

fs.writeFileSync('src/app/globals.css', code);
