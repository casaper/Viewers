const orthancUrl = 'http://orthanc:orthanc@127.0.0.1:8042'

Cypress.Commands.add('orthancPatients', () => cy.request('GET', `${orthancUrl}/patients`).its('body'))
Cypress.Commands.add('orthancStudies', () => cy.request('GET', `${orthancUrl}/studies`).its('body'))
Cypress.Commands.add('orthancSeries', () => cy.request('GET', `${orthancUrl}/series`).its('body'))
Cypress.Commands.add('orthancInstances', () => cy.request('GET', `${orthancUrl}/instances`).its('body'))

