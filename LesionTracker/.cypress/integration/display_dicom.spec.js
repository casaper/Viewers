describe('display dicom image', () => {
  it('shows dicom image', () => {
    cy.login().then(() => {
      cy.get('input[name="daterange"]').clear().type('06/22/1999 - 06/22/2018')
      cy.get('button').contains('Apply').click()
      cy.get('td').contains('Jan 10, 2018').dblclick()
      const overlay = cy.get('.viewerMain .imageViewerViewportOverlay')
      overlay.get('.topright').should('contain', 'LUNG').should('contain', '1/68')
      cy.get('div.bottomleft.dicomTag').should('contain', 'W: 1225, L: -670')
      cy.get('div.topleft.dicomTag').should('contain', 'R00000004').should('contain', 'Example Patient')


    })
  })
})
