describe('Login and Signup forms', () => {
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
      .get('input[name="email"]')
      .should('not.have.value')
      .should('have.prop', 'type', 'text')
      .should('have.prop', 'placeholder', 'Your Email')

    cy.root()
      .get('input[name="password"]')
      .should('not.have.value')
      .should('have.prop', 'type', 'password')
      .should('have.prop', 'placeholder', 'Password')

    cy.root()
      .get('#entrySignIn')
      .find('button')
      .should('contain', 'Need an account?')
      .should('contain', 'Forgot password?')
      .should('contain', 'Sign In')

    cy.root()
      .get('#signInToAppButton')
      .should('be.disabled')
  })

  it('has a complete sign up form', () => {
    cy.visit('http://127.0.0.1:3000')

    cy.get('#needAnAccountButton').click()

    cy.root()
      .get('input[name="fullName"]')
      .should('have.prop', 'placeholder', 'Full Name')
      .should('have.prop', 'type', 'text')
      .should('not.have.value')

    cy.root()
      .get('input[name="email"]')
      .should('have.prop', 'placeholder', 'Email Address')
      .should('have.prop', 'type', 'email')
      .should('not.have.value')

    cy.root()
      .get('input[name="password"]')
      .should('have.prop', 'placeholder', 'Password')
      .should('have.prop', 'type', 'password')
      .should('not.have.value')

    cy.root()
      .get('input[name="confirm"]')
      .should('have.prop', 'placeholder', 'Confirm Password')
      .should('have.prop', 'type', 'password')
      .should('not.have.value')

    cy.root()
      .get('button[type="submit"]')
      .should('contain', 'Join Now')

    cy.root()
      .get('button#signUpPageSignInButton')
      .should('contain', 'Have an account? Sign in')
  })

  it('can sign up for an account', async () => {
    const fullName = 'Johny Tester'
    const email = 'john.testing@example.com'
    const password = 'Apass453Fullfillingtherequireme*nts@'
    await cy.task('mongoRestore')
    // await cy.mongoRestore().promisify()

    cy.visit('http://127.0.0.1:3000/entrySignUp')

    cy.root().get('input[name="fullName"]').type(fullName)

    cy.root().get('input[name="email"]').type(email)

    cy.root().get('input[name="password"]').type(password)
    cy.root().get('input[name="confirm"]').type(password)

    cy.root().get('button[type="submit"]').click()

    cy.location('pathname').should('include', 'studylist')
    cy.get('a').contains('Johny T.').should('exist')

    cy.task('mongoFind', {
      coll: 'users',
      find: { 'emails.address': { $eq: email } }
    }).then(rows => {
      expect(rows).to.have.length(1)
      expect(rows[0].emails[0].address).to.eql(email)
      cy.log(rows[0].emails)
    })
  })

  it('can log in to testing user account', async () => {
    await cy.task('mongoRestore')

    cy.visit('http://127.0.0.1:3000/entrySignIn')

    cy.get('input[name="email"]').type('testing.user@example.com')
    cy.get('input[name="password"]').type('Apass453Fullfillingtherequireme*nts@')

    cy.get('button').contains('Sign In').click()
    cy.location('pathname').should('include', 'studylist')
    cy.get('a').contains('Testing U.').should('exist')
  })
})
