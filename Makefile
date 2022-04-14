publish:
	npm run build
	cp -r README.md LICENSE package.json ./dist
	cd dist
	npm publish
