# ngx-highlight

An angular directive to auto-highlight an element on focus (mouseenter/
mouseleave) or focus (focusin/focusout) or both.

## Installation

```sh
npm install @npcz/ngx-highlight --save
```

or

```sh
yarn add @npcz/ngx-highlight
```

## Usage

#### 1. Import the `HighlightModule`

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HighlightModule } from '@npcz/ngx-highlight';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HighlightModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

#### 2. Import the `HighlightModule`

Specify the highlighting style you want to be applied by defining a variable in
the component file of type `HighlightStyleConfig`

```ts
type HighlighStyle = 'shadow' | 'outline' | 'background' | 'none';
export type HighlightStyleConfig = {
  hover?: HighlighStyle;
  focus?: HighlighStyle;
  debounceTime?: number;
};
```

```ts
import { Component } from '@angular/core';
import { HighlightStyleConfig } from '@npcz/ngx-highlight';

@Component({
  selector: 'exmp-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  highlightStyle: HighlightStyleConfig = {
    hover: 'background',
  };
}
```

#### 3. Apply the directive to the element to be highlighted in the template

```html
<div [hcHighlight]="highlightStyle">
  This block will be highlighted on hover with a different background
</div>
```

#### 4. Include the theming support styles in your app

ngx-highlight uses SASS styling and provides mixins that can be integrated into
and angular material application theme. Simply follow the instructions at https://material.angular.io/guide/theming. The theme file is located in `node_modules/@happycoding/ngx-highlight/src/styles`.

Alternatively you can define your own style using the following CSS classes:

| event | style      | class               |
| ----- | ---------- | ------------------- |
| hover | outline    | hc-hover-outline    |
|       | background | hc-hover-background |
|       | shadow     | hc-hover-shadow     |
| focus | outline    | hc-focus-outline    |
|       | background | hc-focus-background |
|       | shadow     | hc-focus-shadow     |
