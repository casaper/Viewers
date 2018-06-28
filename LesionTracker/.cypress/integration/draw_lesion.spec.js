const force = { force: true }

describe('drawing laesion', () => {
  it('associate series', async () => {
    await cy.mongoRestore('../test/db_snapshots/01_initial_with_testing_user.gz').promisify()
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
          cy.get('input[value="followup"]').check('followup', force)
        })
      cy.get('form.modal-content .modal-footer > button')
        .contains('Save')
        .click(force)
    })
  })

  it('can draw lesion', async () => {
    await cy.mongoRestore('../test/db_snapshots/02_series_associated.gz').promisify()
    const timePointRecord = await cy.task('mongoFindOne', { coll: 'timepoints',
      find: { studyInstanceUids: { '$eq': '1.3.6.1.4.1.14519.5.2.1.4320.5030.248552508121514040263344871813' }}
    }).promisify()

    await cy.wait(3000).promisify()

    await cy.login()

    cy.visit(`http://127.0.0.1:3000/viewer/timepoints/${timePointRecord.timepointId}`)

    cy.get('#toggleTarget > :nth-child(1)').click(force).get('#bidirectional').should('be.visible')

    // cy.wait(2000).then(() => {
    //   cy.getAllByText('Bidirectional').trigger('click')
    //   // cy.get('.toolbarSection #toggleTarget').trigger('click').trigger('click')
    // })
  })
})
