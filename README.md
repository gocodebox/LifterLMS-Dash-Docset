LifterLMS Dash Docset
=====================

A docset of [LifterLMS](https://lifterlms.com) for the Mac OS X app [Dash](https://kapeli.com/dash).

### Manual Installation

1. Download and extract the Zip of this repository.
2. Open Dash
3. Double Click "LifterLMS.docset"

### Generate the Docset

1. Clone this repo and cd into the directory.
2. Install node dependencies: `npm install`
3. Install [Dashing](https://github.com/technosophos/dashing): `brew install dashing`
4. Scrape the docs from https://developer.lifterlms.com: `node index.js` (this takes a while)
5. Generate the docset with Dashing: `npm run-script dashing`

