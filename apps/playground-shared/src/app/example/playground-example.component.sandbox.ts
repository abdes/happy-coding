import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { sandboxOf } from 'angular-playground';
import { ExampleComponent } from './example.component';

const sandboxConfig = {
  imports: [MatButtonModule, FlexLayoutModule, BrowserAnimationsModule],
  providers: [],
  declarations: [ExampleComponent],
  exports: [ExampleComponent],
  label: 'Activity Bar Component',
};

export default sandboxOf(ExampleComponent, sandboxConfig).add('default', {
  template: '<hcpg-playground-example></hcpg-playground-example>',
});
