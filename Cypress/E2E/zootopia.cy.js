describe('Zootopia E2E Tests', () => {
  let users;

  before(() => {
    cy.fixture('users').then(data => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.visit('https://testzootopia.loremipsum.ge/ka');
  });

  it('რეგისტრაცია სწორ მონაცემებზე', () => {
    // პროფილის ღილაკზე კლიკი (force რადგან შესაძლოა იყოს დამალული)
    cy.get('.menu-pop > .rprof', { timeout: 10000 })
      .should('exist')
      .click({ force: true });

    // გადამოწმება რომ ჩანს ავტორიზაციის ტექსტი და გადავდივართ რეგისტრაციაზე
    cy.get('.input-shablon > p')
      .should('be.visible')
      .and("contain", users.validUser.avtorizaciaargaq);

    cy.get('.input-shablon > p > a')
      .should('be.visible')
      .click();

    cy.get('.bred > :nth-child(2) > a')
      .should('be.visible')
      .and("contain", users.validUser.registracia);

    // ვავსებთ ველებს
    cy.get(':nth-child(1) > .ismile').type(users.validUser.firstName);
    cy.get('.ipir').type(users.validUser.personalId);
    cy.get(':nth-child(2) > .imail').type(users.validUser.email.replace('{{timestamp}}', Date.now()));
    cy.get(':nth-child(4) > .itel').type(users.validUser.phone);
    cy.get(':nth-child(5) > .ipass').type(users.validUser.password);
    cy.get('.reg-form-left > :nth-child(6) > .ipass').type(users.validUser.password);

    // პროფილის ტიპის არჩევა და პირობების დადასტურება
    cy.get('[for="profile2"]').click({ force: true });
    cy.get('label[for="etx"] svg').click({ force: true });

    // რეგისტრაცია
    cy.get('.regsub').click({ force: true });

    // წარმატებული რეგისტრაციის შეტყობინება
    cy.contains('მომხმარებელი წარმატებით დარეგისტრირდა', { timeout: 10000 }).should('be.visible');

    // დაბრუნება მთავარ გვერდზე
    cy.url().should('include', '/ka');

    // პროფილის ღილაკზე ვალიდაცია რომ გამოჩნდა ახალი მომხმარებელი
    cy.get('.menu-pop > .iprof').should('contain', users.validUser.firstName);
  });

  it('რეგისტრაცია არასწორი მონაცემებით (validation check)', () => {
    cy.get('body > header > div > a.iprof').click();
    cy.get('body > main > ul > li:nth-child(2) > a').click();

    cy.get('body > main > div.registration > form > div.reg-form-content > div.reg-form-left > div:nth-child(1) > input').type(users.invalidUser.firstName);
    cy.get('body > main > div.registration > form > div.reg-form-content > div.reg-form-left > div:nth-child(3) > input').type(users.invalidUser.email);
    cy.get('body > main > div.registration > form > div.reg-gorm-foo.cart-form-item > label > p').click();
    cy.contains('რეგისტრაცია').click();

    cy.contains('გთხოვთ შეიყვანოთ ვალიდური მონაცემები').should('be.visible');
    cy.url().should('include', '/registration');
  });

  it('პროდუქტის კალათაში დამატება', () => {
    cy.get('body > main > div:nth-child(5) > div.swiper-container.product-slider.swiper-container-initialized.swiper-container-horizontal > div > div:nth-child(2) > div.price-cart > div.product-cart.add.cancel-animation > p').click();
    cy.get('body > header > div > a.icart').click();
    cy.get('body > main > div.cart-box').should('contain', 'პროდუქტი');
    cy.url().should('include', '/cart');
  });

  it('კალათაში რაოდენობის გაზრდა და შემცირება', () => {
    cy.get('body > header > div > a.icart').click();
    cy.get('body > main > div.cart-box > div.swiper > div > div:nth-child(1) > div.spinner > button.plus.change-qty-by-one').click();
    cy.get('body > main > div.cart-box > div.swiper > div > div:nth-child(1) > div.spinner > button.minus.change-qty-by-one').click();
    cy.get('body > main > div.cart-box > div.swiper > div > div:nth-child(1) > div.spinner > input')
      .invoke('val')
      .then(val => expect(parseInt(val)).to.be.gte(1));
  });

  it('კალათის გახსნა და შიგნით პროდუქტების შემოწმება', () => {
    cy.get('body > header > div > a.icart').click();
    cy.get('body > main > div.cart-box').should('be.visible');
    cy.get('body > main > div.cart-box').find('.swiper-slide').its('length').should('be.gte', 1);
  });

  it('ავტორიზაცია სწორი მონაცემებით', () => {
    cy.login(users.loginUser.email, users.loginUser.password);
  });

  it('ავტორიზაცია არასწორი მონაცემებით', () => {
    cy.get('body > header > div > a.iprof > p').click();
    cy.get('body > div.pop-box.avtorization.active > form > div:nth-child(5) > input').type(users.wrongLoginUser.email);
    cy.get('body > div.pop-box.avtorization.active > form > div:nth-child(6) > input').type(users.wrongLoginUser.password);
    cy.get('body > div.pop-box.avtorization.active > form > button').click();

    cy.contains('ელფოსტა ან პაროლი არასწორია').should('be.visible');
    cy.url().should('include', '/login');
  });

});
