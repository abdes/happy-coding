export const getGreeting = (): Cypress.Chainable<JQuery<HTMLHeadingElement>> =>
  cy.get('mat-toolbar > .header__greeting');
