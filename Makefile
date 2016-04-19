JSPM := node_modules/.bin/jspm
JSPM_ARGS := --format global --global-name hyperform --skip-source-maps --quiet

UGLIFYJS := node_modules/.bin/uglifyjs
UGLIFYJS_ARGS := --mangle --compress

JSHINT := node_modules/.bin/jshint
JSHINT_ARGS :=

all: js
.PHONY: all

js: dist/hyperform.js dist/hyperform.min.js \
    dist/hyperform.amd.js dist/hyperform.amd.min.js
.PHONY: js

dist/hyperform.amd.min.js \
dist/hyperform.min.js: dist/%.min.js : dist/%.js
	@echo "* build $@"
	@<"$<" $(UGLIFYJS) $(UGLIFYJS_ARGS) >"$@"

dist/hyperform.amd.js: src/hyperform.js src/*.js src/*/*.js
	@echo "* build $@"
	@mkdir -p dist
	@$(JSPM) build "$<" "$@" $(JSPM_ARGS) --format amd

dist/hyperform.js: src/hyperform.js src/*.js src/*/*.js
	@echo "* build $@"
	@mkdir -p dist
	@$(JSPM) build "$<" "$@" $(JSPM_ARGS)

test:
	@echo "* run tests"
	@$(JSHINT) $(JSHINT_ARGS) src
	@npm test
.PHONY: test

icons: stuff/icon.16.png
	@echo "* generate icons"
	@for s in 16 32 57 64 70 72 76 114 120 128 144 150 152 180 192 256 310; do \
		echo "  - $${s}px"; \
		convert stuff/icon.png \
		  -resize $${s}x$$s \
		  -size $${s}x$$s \
		  xc:transparent +swap \
		  -gravity center \
		  -composite \
		  stuff/icon.$$s.png; \
		optipng -quiet -o7 stuff/icon.$$s.png; \
	done
.PHONY: icons

stuff/icon.16.png: stuff/icon.png

version:
	@# needs a VERSION= variable on the command line!
	@if [ ! -z '$(VERSION)' ]; then \
		sed -i '/^export default '"'"'[0-9.]\+'"'"';$$/c\export default '"'"'$(VERSION)'"'"';' src/version.js; \
	fi
.PHONY: version
