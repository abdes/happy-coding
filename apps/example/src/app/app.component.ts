import { Component } from '@angular/core';
import { HighlightStyleConfig } from '@happy-coding/ngx-highlight';

@Component({
  selector: 'exmp-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // TODO: Implement dark/light theme switching
  isDarkTheme = false;

  title = 'example';
  highlightStyle: HighlightStyleConfig = {
    hover: 'background',
  };
}
