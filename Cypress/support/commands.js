// ავტორიზაცია - 
Cypress.Commands.add('login', (loginemail, password) => {
    cy.get('.menu-pop > .rprof').click();
    cy.get('.avtorization > .input-shablon > h2').should("contain","ავტორიზაცია");
    cy.get(':nth-child(5) > .imail').type(loginemail);
    cy.get('.ipass').type(password);
    cy.get('.avtorization > .input-shablon > .form-button').click();
})
