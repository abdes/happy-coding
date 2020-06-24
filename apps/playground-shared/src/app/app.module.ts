import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PlaygroundModule } from 'angular-playground';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, PlaygroundModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
