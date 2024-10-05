rm -f tsconfig.tsbuildinfo .eslintcache

if [[ ! -d ./node_modules ]]; then
  echo "No node_modules found. Installing..."
  npm run fast-install
fi

if ! command -v bun &> /dev/null; then
  npm install bun
fi

install-changed --install-command 'bun fast-install' &> /dev/null && vite