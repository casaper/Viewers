describe('view the first images', () => {

  it('displays the ct', () => {
    cy.visit('http://localhost:3000')
    expect(true).to.equal(true)
    cy.get('#btnTestDrive').click()
    cy.get('#studyDate').clear().type('06/19/1999 - 06/19/2018')
    cy.get('.applyBtn').click()
    cy.get('#studyListData > :nth-child(1)').trigger('contextmenu')
    cy.get('form.dropdown.open > .dropdown-menu.dropdown-menu-left.bounded > li:nth-child(1) > .form-action > span').click()
  })
})
