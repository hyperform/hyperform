ROLLUP := ./node_modules/.bin/rollup
ROLLUP_ARGS := -c

JSHINT := node_modules/.bin/jshint
JSHINT_ARGS :=

all: js
.PHONY: all

js: dist/hyperform.js dist/hyperform.min.js \
    dist/hyperform.amd.js dist/hyperform.amd.min.js \
    dist/hyperform.cjs.js dist/hyperform.cjs.min.js \
    dist/hyperform.esm.js dist/hyperform.esm.min.js
.PHONY: js

# see
# https://stackoverflow.com/a/10609434/113195
# for this trick to invoke rollup just once for all files
dist/hyperform.amd.min.js \
dist/hyperform.cjs.min.js \
dist/hyperform.esm.min.js \
dist/hyperform.min.js \
dist/hyperform.js \
dist/hyperform.amd.js \
dist/hyperform.cjs.js \
dist/hyperform.esm.js: intermediate-build-step

.INTERMEDIATE: intermediate-build-step
intermediate-build-step: src/hyperform.js src/*.js src/*/*.js
	@echo "* build $@"
	@mkdir -p dist
	@$(ROLLUP) $(ROLLUP_ARGS)

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
.PHONY: test-functional

version:
	@# needs a VERSION= variable on the command line!
	@# assumes line 3 in bower.json is the version!
	@if [ ! -z '$(VERSION)' ]; then \
		sed -i '/^export default '"'"'[0-9.]\+'"'"';$$/c\export default '"'"'$(VERSION)'"'"';' src/version.js; \
		sed -i '3c\  "version": "$(VERSION)",' bower.json; \
		sed -i 's/## UNRELEASED$$/## UNRELEASED\n\n## v$(VERSION)/' CHANGELOG.md; \
	fi
.PHONY: version

GNUPLOT_STYLE := impulses

cmpsize:
	git log --reverse --pretty=format:%H dist/hyperform.min.js | \
	( \
	  while read x; do git show "$$x:dist/hyperform.min.js" | wc -c ; done; \
	  cat dist/hyperform.min.js | wc -c \
	) | \
	gnuplot -p -e "set ylabel 'bytes'; set key outside; set key above; plot '< cat' using 1 title 'size of dist/hyperform.min.js' with $(GNUPLOT_STYLE)"
.PHONY: cmpsize

translate.po: src/*.js src/*/*.js
	xgettext -LJavascript -k_ -o $@ --from-code utf-8 $^
