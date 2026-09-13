async function validate() {
const fs = await import('node:fs');
const { default: yaml } = await import('js-yaml');
const content = fs.readFileSync('DESIGN.md', 'utf8');
const front = content.split('---')[1];
const doc = yaml.load(front);
const missing = [];
for (const match of front.matchAll(/\{([a-zA-Z0-9_.-]+)\}/g)) {
  const path = match[1]; let value = doc;
  for (const part of path.split('.')) value = value?.[part];
  if (value === undefined) missing.push(path);
}
const orphan = [];
for (const group of ['colors','typography','rounded','spacing']) for (const key of Object.keys(doc[group])) if (!front.includes(`{${group}.${key}}`)) orphan.push(`${group}.${key}`);
console.log(JSON.stringify({missing,orphan,components:Object.keys(doc.components).length},null,2));
if(missing.length||orphan.length) process.exitCode=1;

}
validate().catch(error => { console.error(error); process.exitCode = 1; });

