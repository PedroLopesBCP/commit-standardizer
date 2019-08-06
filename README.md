# Commit Standardizer

## Summary

Commit standardizer is a tiny nodejs library intended to help users maintain a clean git commit history, and aims to aid the use of automated changelog generation tools; which in our case is generate-changelog (https://www.npmjs.com/package/generate-changelog).

To achieve this objective commit-standardizer uses the prompts (https://www.npmjs.com/package/prompts) to receive user input in order to mount the desired commit message.

## Notes

At the moment, since this project is very new there isn't a lot of customization available to the end user. However i intend to make a more complete solution and clean solution for any developer out there. To use this library, follow the simple steps shown below.

## Installation

``` bash
  npm i commit-standardizer
```

## Usage

To start using commit-standardizer, simply create a js file with the following contents.

```javascript
  const cs = require('commit-standardizer');

  (async () => {
    await cs.getCommit();
  })();
```
After the previous step, you simply call this js file inside one of your package.json scripts. In my case i created a folder called "scripts" and a js file named "commit.js". After that i added the following script do my package.json:

```bash
  "commit": "node scripts/commit.js",
```

After following all the steps show above, you can simply run "npm run commit" and answer the prompts in the console.
