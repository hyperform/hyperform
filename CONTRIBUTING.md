# Contributing to Hyperform

Cool, thanks for joining in and welcome aboard! If you have Node.js and `make`
installed, you are ready to start.

**Before you start editing:** If you don’t directly fix an already reported
issue, please do open a new one before! Otherwise there might be the chance,
that your work is not fully aligned with Hyperform’s goals, and your time
wasted.

## Set-Up

Log in to [GitHub](https://github.com) and fork
[Hyperform](https://github.com/hyperform/hyperform) (button in the upper-right
corner). Then switch to your terminal:

```sh
$ git clone git@github.com:YourUserName/hyperform.git
$ cd hyperform
$ npm install
# now you're ready to go. Try your first build to see if everything works:
$ make -B && git status
```

Git should show no file changes. Start editing the files in `src` and build
again with `make`.

## Testing Your Edit

For this you need a [SauceLabs](https://saucelabs.com/) account. It’s free to
register and allows testing in a bunch of browsers concurrently. Export your
SauceLabs API token from your profile page to your shell:

```sh
$ export SAUCE_USERNAME=your_saucelabs_user
$ export SAUCE_ACCESS_KEY=your_api_key
```

Then you can run all tests with a single command:

```sh
$ make test
```

If you do not want to create a SauceLabs account, you can also do the tests
manually:

```sh
$ make test-syntax
$ make test-unit
```

and then open `test/functional/index.html` in your browser and verify, that
all tests return green.

**Attention:** The functional tests are performed on `dist/hyperform.js`. Don’t
forget to `make` that file prior to testing!

## Keeping a Look at the File Size

If you have [`gnuplot`](http://gnuplot.sourceforge.net/) installed, try

```sh
$ make cmpsize
```

This produces a nice little chart of how the size of `dist/hyperform.min.js`
changed over time. If you notice a huge peak at the very end, maybe there could
be one or the other byte shoved off before you commit :wink:.

## Submitting a Pull Request

See [Github’s help page](https://help.github.com/articles/using-pull-requests/)
on how that works exactly (with screenshots!). Please try to make title and
description of the change request meaningful.

## If Something Goes Wrong

If you encounter any problem, grab Manuel on
[Twitter](https://twitter.com/m_strehl) or via
[e-mail](http://www.manuel-strehl.de/about/contact).
