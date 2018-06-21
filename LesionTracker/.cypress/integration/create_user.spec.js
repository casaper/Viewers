describe('view the first images', () => {
  it('has complete login form at main url when not logged in', () => {
    cy.visit('http://127.0.0.1:3000')

    cy.root()
      .get('#btnTestDrive')
      .should('have.text', 'Test Drive')
      .should('have.prop', 'title', 'Login with Demo User')

    cy.root()
      .get('body')
      .should('contain', 'Sign In.')

    cy.root()
      .get('#signInPageEmailInput')
      .should('not.have.value')
      .should('have.prop', 'type', 'text')

    cy.root()
      .get('#signInPagePasswordInput')
      .should('not.have.value')
      .should('have.prop', 'type', 'password')

    cy.root()
      .get('#signInToAppButton')
      .should('be.disabled')
      .should('contain', 'Sign In')

    cy.root()
      .get('#needAnAccountButton')
      .should('contain', 'Need an account?')

    cy.root()
      .get('#forgotPasswordButton')
      .should('contain', 'Forgot password?')
  })
})
