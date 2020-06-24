import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppModule } from './app/app.module';
import { PlaygroundModule } from 'angular-playground';
import { PlaygroundHelpersModule } from './app/helpers/playground-helpers.module';

PlaygroundModule.configure({
  overlay: false,
  modules: [BrowserAnimationsModule],
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

// Double bootstrap to also bootstrap the playground helpers module
platformBrowserDynamic().bootstrapModule(PlaygroundHelpersModule);
