JSPM := node_modules/.bin/jspm
JSPM_ARGS := --format global --global-name hyperform --skip-source-maps

UGLIFYJS := node_modules/.bin/uglifyjs
UGLIFYJS_ARGS := --mangle --compress

JSHINT := node_modules/.bin/jshint
JSHINT_ARGS :=

BANNER := /*! hyperform.js.org */

all: js
.PHONY: all

js: dist/hyperform.js dist/hyperform.min.js \
    dist/hyperform.amd.js dist/hyperform.amd.min.js \
    dist/hyperform.cjs.js dist/hyperform.cjs.min.js
.PHONY: js

dist/hyperform.amd.min.js \
dist/hyperform.cjs.min.js \
dist/hyperform.min.js: dist/%.min.js : dist/%.js
	@echo "* build $@"
	@( \
		echo '$(BANNER)'; \
		<"$<" $(UGLIFYJS) $(UGLIFYJS_ARGS) ; \
	) >"$@"

dist/hyperform.amd.js: src/hyperform.js src/*.js src/*/*.js
	@echo "* build $@"
	@mkdir -p dist
	@$(JSPM) build "$<" "$@" $(JSPM_ARGS) --format amd
	@sed -i '1s#^#$(BANNER)\n#' "$@"

dist/hyperform.cjs.js: src/hyperform.js src/*.js src/*/*.js
	@echo "* build $@"
	@mkdir -p dist
	@$(JSPM) build "$<" "$@" $(JSPM_ARGS) --format cjs
	@sed -i '1s#^#$(BANNER)\n#' "$@"

dist/hyperform.js: src/hyperform.js src/*.js src/*/*.js
	@echo "* build $@"
	@mkdir -p dist
	@$(JSPM) build "$<" "$@" $(JSPM_ARGS)
	@sed -i '1s#^#$(BANNER)\n#' "$@"

test: test-syntax test-unit test-functional
.PHONY: test

test-syntax:
	@echo "* run syntax tests"
	@$(JSHINT) $(JSHINT_ARGS) src
.PHONY: test-syntax

test-unit:
	@echo "* run unit tests"
	@node_modules/.bin/ava
.PHONY: test-unit

test-functional:
	@echo "* run functional tests"
	@node_modules/.bin/karma start karma.conf.js
.PHONY: test-unit

icons: stuff/icon.16.png
	@echo "* generate icons"
	@for s in 16 32 57 64 70 72 76 114 120 128 144 150 152 180 192 256 310; do \
		echo "  - $${s}px"; \
		rsvg-convert -w $$s -h $$s stuff/icon.svg > stuff/icon.$$s.png; \
		optipng -quiet -o7 stuff/icon.$$s.png; \
	done
.PHONY: icons

stuff/icon.16.png: stuff/icon.svg

version:
	@# needs a VERSION= variable on the command line!
	@# assumes line 3 in bower.json is the version!
	@if [ ! -z '$(VERSION)' ]; then \
		sed -i '/^export default '"'"'[0-9.]\+'"'"';$$/c\export default '"'"'$(VERSION)'"'"';' src/version.js; \
		sed -i '3c\  "version": "$(VERSION)",' bower.json; \
	fi
.PHONY: version

GNUPLOT_STYLE := impulses

cmpsize:
	git log --reverse --pretty=format:%H dist/hyperform.min.js | \
	( \
	  while read x; do git show "$$x:dist/hyperform.min.js" | wc -c ; done; \
	  wc -c dist/hyperform.min.js \
	) | \
	gnuplot -p -e "plot '< cat' using 1 title 'size of dist/hyperform.min.js' with $(GNUPLOT_STYLE)"
.PHONY: cmpsize
