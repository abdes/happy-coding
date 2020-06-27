# Changelog

## [0.0.6](https://github.com/abdes/happy-coding/compare/ngx-highlight-ngx-highlight-0.0.5...ngx-highlight-0.0.6)

> 27 June 2020

### Fixes

- fix(ngx-highlight): coordination between hover and focus effects [`04c1e10`](https://github.com/abdes/happy-coding/commit/04c1e109d002882b9486c0482a89daa00b5c23c1)
- fix(ngx-highlight): do not start the subscription multiple times on style changes [`42dd48f`](https://github.com/abdes/happy-coding/commit/42dd48feba06a91b3ea9f216ce3d19edca101b6f)

### Dependencies

- deps(ngx-highlight): move tslib to direct dependency [`7a5e7fd`](https://github.com/abdes/happy-coding/commit/7a5e7fd0c2173ef22f8639f7d0e86773f93ae528)

  _As per the [new recommendation](https://angular.io/guide/migration-update-libraries-tslib#why-is-this-migration-necessary) and in preparation for angular v10_

## [0.0.5](https://github.com/abdes/happy-coding/compare/ngx-highlight-ngx-highlight-0.0.4...ngx-highlight-0.0.5)

> 25 June 2020

### Features

- **Breaking change:** feat(ngx-highlight): decouple debounce time from style config [`d42d7de`](https://github.com/abdes/happy-coding/commit/d42d7de362c1ddcaccdccf63a40d4bbac044734d)

  - in normal use of the directive, it is much less likely
    to reset the debounce time then it is to change the highlight style.
    Therefore, instead of treating the debounce time as part of the style
    config, it is more appropriate to treat it separately.

  - default values for style config and for debounce time are now constants
    exported by the module in the public api. This is cleaner.

### Fixes

- fix(ngx-highlight): style changes need to be applied immediately [`e599794`](https://github.com/abdes/happy-coding/commit/e599794cd54a4c2bcd87c58acfa4b016e365c7a8)
- fix(ngx-highlight): hover sub not stopped when component destroyed [`fb6b4bf`](https://github.com/abdes/happy-coding/commit/fb6b4bf5a122f4b8bf8581d694da5097779c4018)

## [0.0.4](https://github.com/abdes/happy-coding/compare/ngx-highlight-ngx-highlight-0.0.3...ngx-highlight-0.0.4)

> 24 June 2020

### Features

- feat(ngx-highlight): support changes after component is initialized [`7428178`](https://github.com/abdes/happy-coding/commit/7428178cb91dec4238dcc49544ce5b036bbce742)

### Fixes

- fix(ngx-highlight): debounceTime changes were not applied properly[`32103cb`](https://github.com/abdes/happy-coding/commit/32103cb7e2b461faf5e83de2e4a3d55847f08fee)
- fix(ngx-highlight): export HighlightStyle for type checking[`d8b0664`](d8b0664fbdde45495ed1a8e19676ba76438b8384)
- fix(ngx-highlight): debounceTime input property not taken into account [`f88b1d4`](f88b1d494149330479483679a7c2b73e6d375aee)

### Dependencies

- deps(ngx-highlight): lodash is no longer needed [`b0b45e3`](https://github.com/abdes/happy-coding/commit/b0b45e31f4caaa407a141be443e0801919a10546)

## [0.0.3](https://github.com/abdes/happy-coding/compare/ngx-highlight-ngx-highlight-0.0.2...ngx-highlight-0.0.3)

> 2020-06-22

### Dependencies

- deps(ngx-highlight): lodash should be listed as dependency ([d92d1b3](https://github.com/abdes/happy-coding/commit/d92d1b3))
- deps(ngx-highlight): tslib should be listed as peer dependency ([86f3547](https://github.com/abdes/happy-coding/commit/86f3547))

### Documentation

- doc(ngx-highlight): change package org to @npcz ([bb2d04b](https://github.com/abdes/happy-coding/commit/bb2d04b))
- doc(ngx-highlight): change package org to @npcz ([f1a724e](https://github.com/abdes/happy-coding/commit/f1a724e))
- doc(ngx-highlight): update org to @npcz ([0d5fc62](https://github.com/abdes/happy-coding/commit/0d5fc62))
- doc(ngx-highlight): update org to @npcz ([c9aee1b](https://github.com/abdes/happy-coding/commit/c9aee1b))

## [0.0.2](https://github.com/abdes/happy-coding/compare/ngx-highlight-ngx-highlight-0.0.1...ngx-highlight-0.0.2)

(2020-06-22)

### Features

- **initial-release:** angular directive to add custom styling to elements on
  hover or focus.
