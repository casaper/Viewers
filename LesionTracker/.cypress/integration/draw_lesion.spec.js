describe('drawing laesion', () => {
  it('associate series', async () => {
    await cy.mongoRestore().promisify()
    cy.login().then(() => {

      cy.visit('http://127.0.0.1:3000/studylist')
      // select serie to view
      cy.get('input[name="daterange"]').clear().type('06/22/1999 - 06/22/2018')
      cy.get('button').contains('Apply').click()
      cy.get('body').type('{meta}', { release: false })
        .get('.studylistStudy').contains('Jan 10, 2018').click()
      cy.get('body').type('{meta}', { release: false })
        .get('.studylistStudy').contains('May 10, 2018').click()
      cy.get('.studylistStudy').contains('May 10, 2018').trigger('contextmenu')
      cy.get('ul.dropdown-menu li a').contains('Associate').click()
      cy.get('#studyAssociationTable')
        .contains('tbody > tr', 'May 10, 2018')
        .within(() => {
          cy.get('input[value="followup"]').check('followup', { force: true })
        })
      cy.get('form.modal-content .modal-footer > button')
        .contains('Save')
        .click({force: true})
    })
  })

  it('can draw lesion', async () => {
    await cy.mongoRestore('../test/timepoints_test_db.gz').promisify()

    await cy.login()
    // select serie to view
    cy.get('input[name="daterange"]').clear().type('06/22/1999 - 06/22/2018')
    cy.get('button').contains('Apply').click()
    cy.get('body').contains('Jan 10, 2018').dblclick()

    cy.get('.toolbarSectionTools').within(() => {
      cy.get('#toggleTarget').click().get('#bidirectional').click()
    })
  })
})
