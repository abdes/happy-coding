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

### 1. Import the `HighlightModule`

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

### 2. Import the `HighlightModule`

Specify the highlighting style you want to be applied by defining a variable in
the component file of type `HighlightStyleConfig`

```ts
type HighlighStyle = 'shadow' | 'outline' | 'background' | 'none';
export type HighlightStyleConfig = {
  hover?: HighlighStyle;
  focus?: HighlighStyle;
};
```

You can optionally specify a different debounce time for the hover and focus
events as a number of milliseconds. The directive attribute 'hcHighlightDebounce'
is provided for that purpose.

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

### 3. Apply the directive to the element to be highlighted in the template

```html
<div [hcHighlight]="highlightStyle">
  This block will be highlighted on hover with a different background
</div>
<!-- with custom debounce time -->
<div [hcHighlight]="highlightStyle" hcHighlightDebounce="100">
  This block will be highlighted on hover with a different background
</div>
```

### 4. Include the theming support styles in your app

ngx-highlight uses SASS styling and provides mixins that can be integrated into
and angular material application theme. Simply follow the instructions for
[Angular Material Theming](https://material.angular.io/guide/theming). The theme
file is located in `node_modules/@npcz/ngx-highlight/src/styles`.

Alternatively you can define your own style using the following CSS classes:

| event | style      | class               |
| ----- | ---------- | ------------------- |
| hover | outline    | hc-hover-outline    |
|       | background | hc-hover-background |
|       | shadow     | hc-hover-shadow     |
| focus | outline    | hc-focus-outline    |
|       | background | hc-focus-background |
|       | shadow     | hc-focus-shadow     |

## Debounce Time

To reduce the frequency at which the hover or focus changes are fired, the
implementation debounces the events. The default debounce time is in the
`DEFAULT_DEBOUNCE_TIME` constant exported in the public api.

A debounce time of `0` means no debouncing.

A negative value for the `hcHighlightDebounce` property will be adjusted to `0`.

An undefined value will be adjusted to the default value.

Resetting the debounce value after the component is initialized is ok and the
effect is immediate.

## Updating styles after the component is initialized

It is perfectly acceptable to change the highlight styles after the component
is initialized. The changes will take effect immediately. NOte however that
when specifying a new style config (`HighlightStyleConfig` object), the new
value will be merged with the default styles (`DEFAULT_STYLE_CONFIG`) and
**not the current styles**.

Therefore, ensure that the new style config is wholistic and has no assumption
on the current style.
