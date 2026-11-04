# Third-party libraries

Third-party browser files, copied into the repo so the site makes no third-party requests.

| File | Library | Version | Source | License |
|---|---|---|---|---|
| `motion-14.4.0.min.js` | [Motion](https://motion.dev) | 14.4.0 | npm `motion@14.4.0`, `dist/motion.js` (UMD build, sets `window.Motion`) | MIT, see `motion-LICENSE.md` |

npm integrity of the package tarball: `sha512-JJTIdeNjtF2zi/py0ndRKxQF+8z2pcDUgJYXul7zqbhMvyTLRsPFR9ifE/j4cFCpCMlehQVJkTwd7BZFiPKgQg==`

To update: `npm pack motion@<version> --ignore-scripts` in a scratch folder, copy `package/dist/motion.js` here under the new version name, update this table and every `<script>` that loads it.
