LifterLMS Dash Docset
=====================

A docset of [LifterLMS](https://lifterlms.com) for the Mac OS X app [Dash](https://kapeli.com/dash).

### Manual Installation

1. Download and extract the Zip of this repository.
2. Open Dash
3. Double Click "LifterLMS.docset"

### Install for Docset Generation

1. Clone this repo and cd into the directory.
2. Install node dependencies: `npm install`
3. Install [Dashing](https://github.com/technosophos/dashing): `brew install dashing`

### Generate the Docset

1. Scrape the docs from https://developer.lifterlms.com: `npm run scrape` (this takes a while)
2. Generate the docset with Dashing: `npm run generate`

### Contribute the Docset to Dash User Contributions

1. Sync the forked user contribution repo: `npm run sync-fork`
2. Bump the package version (use `npm version`)
3. Prepare distribution files: `npm run dist`
4. Commit changes to the fork: `cd Dash-User-Contributions && git add -A && git commit -m "LifterLMS Version 3.33.2" && git push origin master && cd ../`
5. Open a PR in the primary repo: https://github.com/Kapeli/Dash-User-Contributions/compare/master...gocodebox:master

