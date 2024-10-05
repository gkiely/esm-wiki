import packageJSON from '../package.json';

const entries = [...Object.entries(packageJSON.dependencies), ...Object.entries(packageJSON.devDependencies)];
const betaAndRcDependencies = entries.filter(([_, v]) => v.includes('beta') || v.includes('rc')).map(([k]) => k);
const fileDependencies = entries.filter(([_, v]) => v.includes('file:')).map(([k]) => k);

const blacklist: string[] = [...betaAndRcDependencies, ...fileDependencies];

const deps = `${Object.keys({
  ...packageJSON.dependencies,
  ...packageJSON.devDependencies,
})
  .filter((k) => !blacklist.includes(k))
  // .join('@latest ')}@latest`;
  .join('@latest ')}@latest`;

// Output to shell
// eslint-disable-next-line no-console
console.log(deps);
