import { Component } from '@angular/core';

@Component({
  selector: 'hcpg-playground-example',
  templateUrl: './example.component.html',
  styles: [
    `
      .example__container {
        padding: 1rem;
      }
    `,
  ],
})
export class ExampleComponent {
  message = '';

  onClicked(): void {
    this.message = 'Button clicked!';
  }
}
