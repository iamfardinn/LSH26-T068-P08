const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

// Recreate dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Files to copy to root of dist
const filesToCopy = [
  'index.html',
  'P08_school_results_public.json',
  'P08_edge_cases.json',
  'all_edge_cases_test.json',
  'evaluation-manifest.json',
  'README.md',
  'LICENSE.md',
  'LICENSES.md',
  'EVENT.md'
];

for (const file of filesToCopy) {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
    console.log(`Copied ${file} -> dist/${file}`);
  }
}

// Ensure P08 subfolder exists for nested path fallback
const p08SubDir = path.join(distDir, 'P08');
fs.mkdirSync(p08SubDir, { recursive: true });
if (fs.existsSync(path.join(__dirname, 'P08_school_results_public.json'))) {
  fs.copyFileSync(
    path.join(__dirname, 'P08_school_results_public.json'),
    path.join(p08SubDir, 'P08_school_results_public.json')
  );
  console.log(`Copied P08_school_results_public.json -> dist/P08/P08_school_results_public.json`);
}

console.log('Build completed successfully in ./dist');
