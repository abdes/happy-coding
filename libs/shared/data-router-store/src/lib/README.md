# NgRx Router Store

If an application uses routes / navigation, the routing becomes an essential
part of the application state.

Without incorporating Router in the Store, container components can’t depend
on the store alone. Components then also need Router / `ActivatedRouteSnapshot`
to figure out `path` / `query` params needed to select state of slice from Store
and / or dispatch actions to modify the state slice with respect to the current
route.

Code duplication, inconsistencies and difficulty to maintain will result if the
router state is not part of the central store.

Following the principle of **dependency inversion**, if Components extract _path /
query_ params from Router state just to use them with their interactions with
Store, why not let `store/selectors` and `reducers/side-effects` deal with the
router and let components depend only the Store?

We need **ngrx-router-store** to reduce route changes into the store and dispatch
route change events on the actions stream to allow routes and their mutation
to be the part of centralized state in the store.

[More details: NgRx Router Store | Reduce & Select Route Params](https://medium.com/simars/ngrx-router-store-reduce-select-route-params-6baff607dd9)

## Adding ngrx-router-store package

[ngrx-router-store](https://ngrx.io/guide/router-store) provides bindings to
connect the Angular Router with Store. During each router navigation cycle,
multiple actions are dispatched that allow you to listen for changes in the
router's state. You can then select data from the state of the router to
provide additional information to the application.

```shell script
yarn add @ngrx/router-store
```

## Adding a feature module (Angular Router State)

1. Generate the Angular module

   ```shell script
   yarn ng g module --project root-store --name router-store --module root-store
   ```

2. Generate the feature store with @ngrx schematics

   ```shell script
   yarn ng g @ngrx/schematics:feature --creators --name=router-store --flat=false --module router-store --project root-store --spec --api=false

   CREATE libs/root-store/src/lib/router-store/router-store.actions.ts (141 bytes)
   CREATE libs/root-store/src/lib/router-store/router-store.reducer.spec.ts (341 bytes)
   CREATE libs/root-store/src/lib/router-store/router-store.reducer.ts (481 bytes)
   CREATE libs/root-store/src/lib/router-store/router-store.effects.spec.ts (632 bytes)
   CREATE libs/root-store/src/lib/router-store/router-store.effects.ts (616 bytes)
   CREATE libs/root-store/src/lib/router-store/router-store.selectors.spec.ts (362 bytes)
   CREATE libs/root-store/src/lib/router-store/router-store.selectors.ts (256 bytes)
   UPDATE libs/root-store/src/lib/router-store/router-store.module.ts (551 bytes)
   ```

3. Refactor/Rename the directory to `+router`
4. Refactor/Rename files to remove the prefix `router-store` except from the module
   file. We just wanna simplify things up here as all files will be prefixed by their
   containing folder.

## The router state and the state serializer

We'll define the router state the way we want to see it in the [`reducer`](./reducer.ts)
file and we will write a custom [`serializer`](https://ngrx.io/guide/router-store/configuration)
to ask NgRx to give it to us the way we want it.

## Configuring the router store module

To make router state {params, queryParams, data}: MergedRoute a part of our
centralized NgRx store `state['router']`, we will update the module file
[router-store.module.ts](./router-store.module.ts).

## Add router to the app

In the [app module file](../../../../../apps/vtree/src/app/app.module.ts), add the
router module:

```typescript
    RouterModule.forRoot(
      [], // appRoutes to be defined
      {
        initialNavigation: 'enabled',
        // The onSameUrlNavigation property defines what the router should do if
        // it receives a navigation request to the current URL. By default, the router will ignore
        // this navigation. However, this prevents features such as a “refresh” button. Use this
        // option to configure the behavior when navigating to the current URL. Default is ‘ignore’.
        onSameUrlNavigation: 'reload'
      }),
```

## Write selectors to access to router state

We add a `getMergedRoute` selector for conveniently getting the MergedRoute from the router
state to the [selectors.ts](./selectors.ts) file.

## Write effects for navigation actions

As actions are added for navigation to the [actions](./actions.ts) file, eventually,
effects can be also added to the [effects](./effects.ts) file to implement the
corresponding side effects.

Of particular notice is the effect that automatically update the application title
as we navigate, taking the title from the data of the route. More details are at the
article [Declarative Title Updater with Angular and ngrx](https://alligator.io/angular/title-updater/).

## Fix and write unit tests

- [How to test NgRx Router State Serializer](https://medium.com/@marko.sulamagi/how-to-test-ngrx-router-state-serializer-87114c73ad21)
- [Testing Reducers in NGRX Store](https://ultimatecourses.com/blog/ngrx-store-testing-reducers)
- [NgRx Testing: Effects](https://brianflove.com/2018/06/28/ngrx-testing-effects/)
