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

version:
	@# needs a VERSION= variable on the command line!
	@if [ ! -z '$(VERSION)' ]; then \
		sed -i '/^  "version": "[0-9.]\+",$$/c\  "version": "$(VERSION)",' package.json; \
		sed -i '/^export default '"'"'[0-9.]\+'"'"';$$/c\export default '"'"'$(VERSION)'"'"';' src/version.js; \
	fi
.PHONY: version
