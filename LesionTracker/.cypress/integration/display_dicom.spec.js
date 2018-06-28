describe('display dicom image', () => {
  it('shows dicom image', async () => {
    // await cy.deleteOrthancServerImages().promisify()
    // await cy.uploadOrthancServerImages().promisify()
    await cy.refreshOrthancServerImages().promisify()
    await cy.mongoRestore('../test/db_snapshots/01_initial_with_testing_user.gz').promisify()

    // Get all the instances from one dates serie
    const seriesInstances = await cy.getSerieInstanceUids('20180110').promisify()
    await cy.login()

    // Setup route listeners for all images in serie
    seriesInstances.forEach(({ FileUuid, FileSize, IndexInSeries, MainDicomTags: { SOPInstanceUID } }) => {
      cy.route({ method: 'GET', url: `**objectUID=${SOPInstanceUID}**`,
        onResponse: xhr => {
          expect(xhr.response.headers).to.have.property('content-type', 'application/dicom')
          expect(xhr.response.body.byteLength).to.eq(FileSize)
        }
      }).as(FileUuid)
    })

    // select serie to view
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
    cy.wait(seriesInstances.map(({ FileUuid }) => `@${FileUuid}`), { timeout: 30000 }).then(wadoXHRRequests => {
      // verify if correct ammount of images has been requested and received
      expect(wadoXHRRequests).to.have.length(seriesInstances.length)
    })

  })
})
