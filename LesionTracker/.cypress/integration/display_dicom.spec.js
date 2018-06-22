describe('display dicom image', () => {
  it('shows dicom image', () => {
    cy.orthancPatients().then(patients => {
      cy.log(patients)
    })
  })
})
