# Organizing libraries

Libraries can be used by other libraries as well as by applications. Some of
them can also bu published to NPM for reuse outside of this workspace (these
are referred to as _publishable_ libraries). They can be independent of the
target platform (e.g. web, electron, nodejs, etc...) or can be designed for a
specific platform.

We organize libraries in terms of scope and type, which determine the location
of the library under the `libs` directory and the Nx tags associated with the
project for dependency rules enforcement.

A library scope is a logical grouping that determines the end-use scenarios of
libraries:

- If a library is designed for use by any application and for any target
  platform, its scope is **"shared"**. It is tagged with _scope:shared_.

- If a shared library is published to an external repo (such as npmjs or github
  packages) for consumption by external users, its scope is **"published"**. It
  is tagged with _scope:shared_ and _scope:published_.

- If a **"shared"** library is designed for use only on a certain platform (e.g.
  web, electron, nodejs,...), its scope is further restricted to the **platform
  name**. It is tagged with _scope:platforn-name_

- If a library is designed for a specific application, its scope is the prefix
  **"app-"** and the **app name**. It is tagged with _scope:app-{app-name}_

- If an **"app-specific"** library is designed for a specific platform, its
  scope is further restricted to the **platform name**. It is tagged with
  _scope:app-{app-name}-{platform-name}_.

A library type is a logical way to specify the domain of the library:

- `data`: contains services and utilities for interacting with back-end systems
  and all code related to state management, tagged with _type:data_

- `feature`: contain smart UI (with injected services) for specific business
  use-cases or pages in an application, tagged with _type:feature_

- `ui`: contains only presentational components (that rely only on inputs and
  outputs), tagged with _type:ui_

- `util`: contains common utilities and services used by other libraries and
  applications, tagged with _type:util_

## Example

```txt
└───libs
    ├───app-pictures
    │   ├───core
    │   ├───data-store
    │   ├───electron
    │   │   └───feature-local-pictures
    │   ├───feature-authentication
    │   ├───feature-edit
    │   ├───feature-my-pictures
    │   ├───feature-search-bar
    │   ├───ui-image-resizer
    │   └───web
    │       └───feature-cloud-pictures
    ├───electron
    │   └───feature-file-browser
    ├───nodejs
    │   ├───feature-auth-api
    │   └───feature-profile-api
    ├───published
    │   ├───ngx-highlight
    │   └───ngx-search-bar
    ├───shared
    │   ├───core
    │   ├───data-profile
    │   ├───ui-album
    │   ├───ui-profile
    │   ├───util-angular
    │   └───util-logging
    └───web
        ├───core
        ├───ui-footer
        └───ui-header
```

## Module boundaries rules

The scope and type are used to enforce module boundaries with Nx. The tags are
specified in the `nx.json` file and the dependency rules are specified in the
`.eslintrc.js` file.

Module boundaries linting can be done with:

```shell
$ yarn nx workspace-lint

yarn run v1.22.4
$ nx workspace-lint
Done in 0.96s.
```
