const fs = require('fs');
let code = fs.readFileSync('src/components/hero/Hero.tsx', 'utf8');

const target = `<span className="brand-wordmark text-[1.9rem]">
            Good<span className="apos" style={{ color: 'var(--coral)' }}>&apos;</span>ai
          </span>`;
const replacement = `<img src="/brand/wordmark-light.png" alt="Good'ai" className="h-8 w-auto mix-blend-multiply" />`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/hero/Hero.tsx', code);
