// ავტორიზაცია - გამარტივებული კოდის ჩაწერა
Cypress.Commands.add('login', (email, password) => {
  cy.get('body > header > div > a.iprof > p').click();
  cy.get('body > div.pop-box.avtorization.active > form > div:nth-child(5) > input').type(email);
  cy.get('body > div.pop-box.avtorization.active > form > div:nth-child(6) > input').type(password);
  cy.get('body > div.pop-box.avtorization.active > form > button').click();
  cy.contains('მოგესალმებით').should('be.visible');
});
