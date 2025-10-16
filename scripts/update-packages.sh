rm -rf node_modules
find . \
  -name package.json \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -exec dirname {} \; | while read dir; do
    echo "Updating packages in $dir"
    cd "$dir" || exit
    npx npm-check-updates -u
    npm install
    npm audit fix --force
    cd - >/dev/null || exit
  done