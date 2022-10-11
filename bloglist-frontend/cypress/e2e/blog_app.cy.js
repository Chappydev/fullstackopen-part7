describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'George Frenulum',
      username: 'georgie',
      password: 'password'
    };
    cy.request('POST', 'http://localhost:3003/api/users', user);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function() {
    cy.contains('Username');
    cy.contains('Password');
    cy.contains('Login');
  });

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('georgie');
      cy.get('#password').type('password');
      cy.get('#login-button').click();

      cy.contains('George Frenulum is logged in');
    });

    it('fails with wrong credentials', function() {
      cy.get('#username').type('georgie');
      cy.get('#password').type('wrong-password');
      cy.get('#login-button').click();

      cy.get('.error')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)');

      cy.get('html').should('not.contain', 'George Frenulum is logged in');
    });
  });

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('georgie');
      cy.get('#password').type('password');
      cy.get('#login-button').click();
    });

    it('A blog can be created', function() {
      cy.contains('New Note').click();
      cy.get('.title-input').type('Title...');
      cy.get('.author-input').type('Author...');
      cy.get('.url-input').type('Url...');
      cy.get('#submit-note').click();

      cy.contains('Title... Author...');
    });
  });

  describe('When logged in and a blog created', function() {
    beforeEach(function() {
      cy.get('#username').type('georgie');
      cy.get('#password').type('password');
      cy.get('#login-button').click();

      cy.contains('New Note').click();
      cy.get('.title-input').type('Title...');
      cy.get('.author-input').type('Author...');
      cy.get('.url-input').type('Url...');
      cy.get('#submit-note').click();
    });

    it('A blog can be liked', function() {
      cy.contains('Title... Author...').parent().find('button').click();
      cy.contains('like').click();
      cy.contains('Title... now has 1 likes');
      cy.contains('likes: 1');
    });

    it('The blog can be deleted by its creator', function() {
      cy.contains('Title... Author...').parent().find('button').click();
      cy.contains('Remove').click();

      cy.get('.success')
        .should('contain', 'Title... was successfully removed')
        .and('have.css', 'color', 'rgb(0, 128, 0)');
      cy.should('not.contain', 'Title... Author...');
    });

    it('The blogs are ordered by # of likes', function() {
      cy.contains('New Note').click();
      cy.get('.title-input').type('Blog with most likes');
      cy.get('.author-input').type('Popular Author');
      cy.get('.url-input').type('Url...');
      cy.get('#submit-note').click();

      cy.contains('Blog with most likes Popular Author').parent().find('button').click();
      cy.contains('Blog with most likes Popular Author').parent().find('button').eq(1).click();
      cy.contains('likes: 1');

      cy.get('.blog-container').eq(0).should('contain', 'Blog with most likes');
      cy.get('.blog-container').eq(1).should('contain', 'Title... Author...');
    });
  });
});