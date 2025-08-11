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
    cy.get('body > header > div > a.iprof').click();
    cy.get('body > main > ul > li:nth-child(2) > a').click();

    cy.get('body > main > div.registration > form > div.reg-form-content > div.reg-form-left > div:nth-child(1) > input').type(users.validUser.firstName);
    cy.get('body > main > div.registration > form > div.reg-form-content > div.reg-form-left > div:nth-child(2) > input').type(users.validUser.lastName);
    cy.get('body > main > div.registration > form > div.reg-form-content > div.reg-form-left > div:nth-child(3) > input')
      .type(users.validUser.email.replace('{{timestamp}}', Date.now()));
    cy.get('body > main > div.registration > form > div.reg-form-content > div.reg-form-left > div:nth-child(4) > input').type(users.validUser.personalId);
    cy.get('body > main > div.registration > form > div.reg-form-content > div.reg-form-left > div:nth-child(5) > input').type(users.validUser.phone);
    cy.get('body > main > div.registration > form > div.reg-form-content > div.reg-form-left > div:nth-child(6) > input').type(users.validUser.password);
    cy.get('body > main > div.registration > form > div.reg-gorm-foo.cart-form-item > label > p').click();
    cy.contains('რეგისტრაცია').click();

    cy.contains('მომხმარებელი წარმატებით დარეგისტრირდა').should('be.visible');
    cy.url().should('include', '/ka');  // მეორე Assertion
  });

  it('რეგისტრაცია არასწორი მონაცემებით (validation check)', () => {
    cy.get('body > header > div > a.iprof').click();
    cy.get('body > main > ul > li:nth-child(2) > a').click();

    cy.get('body > main > div.registration > form > div.reg-form-content > div.reg-form-left > div:nth-child(1) > input').type(users.invalidUser.firstName);
    cy.get('body > main > div.registration > form > div.reg-form-content > div.reg-form-left > div:nth-child(3) > input').type(users.invalidUser.email);
    cy.get('body > main > div.registration > form > div.reg-gorm-foo.cart-form-item > label > p').click();
    cy.contains('რეგისტრაცია').click();

    cy.contains('გთხოვთ შეიყვანოთ ვალიდური მონაცემები').should('be.visible');
    cy.url().should('include', '/registration'); // მეორე Assertion
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
    // Assertion: თუ მოცულობა დაბრუნდა პირვანდელზე
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
