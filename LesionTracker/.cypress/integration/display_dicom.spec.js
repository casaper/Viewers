describe('display dicom image', () => {
  it('shows dicom image', () => {
    cy.refreshOrthancServerImages().then(() => {
      // Get all the instances from one dates serie
      cy.getSerieInstanceUids('20180110').then(seriesInstances => {
        // wait for login form to finish
        cy.login().then(() => {

          // Setup route listeners for all images in serie
          seriesInstances.forEach(({ FileUuid, FileSize, IndexInSeries, MainDicomTags: { SOPInstanceUID } }) => {
            cy.route({ method: 'GET', url: `**objectUID=${SOPInstanceUID}**`,
              onResponse: xhr => {
                console.log(xhr)
                expect(xhr.response.headers).to.have.property('content-type', 'application/dicom')
              }
            }).as(FileUuid)
          })


          cy.get('input[name="daterange"]').clear().type('06/22/1999 - 06/22/2018')
          cy.get('button').contains('Apply').click()
          cy.get('body').contains('Jan 10, 2018').dblclick()


          // Check out some different image indexes
          cy.get('.topright').should('contain', 'LUNG').should('contain', '1/68')
          cy.get('.imageSlider')
              .invoke('val', 10).trigger('change')
            .get('.topright')
              .should('contain', '10/68')
          cy.get('.imageSlider')
              .invoke('val', 68).trigger('change')
            .get('.topright')
              .should('contain', '68/68')


          cy.get('div.bottomleft.dicomTag').should('contain', 'W: 1225, L: -670')
          cy.get('div.topleft.dicomTag').should('contain', 'R00000004').should('contain', 'Example Patient')

          // Wait for all images to be loaded
          cy.wait(seriesInstances.map(({ FileUuid }) => `@${FileUuid}`), { timeout: 30000 })
        })
      })
    })
  })
})
