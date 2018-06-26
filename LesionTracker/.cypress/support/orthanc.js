const orthancUrl = 'http://orthanc:orthanc@127.0.0.1:8042'

const getPatients = () => cy.request('GET', `${orthancUrl}/patients`).its('body')

const getStudies = () => cy.request('GET', `${orthancUrl}/studies`).its('body')

const getSeries = () => cy.request('GET', `${orthancUrl}/series`).its('body')
const getSerie = (serieId) => cy.request('GET', `${orthancUrl}/series/${serieId}`).its('body')
const getSerieInstances = (serieId) => cy.request('GET', `${orthancUrl}/series/${serieId}/instances`).its('body')

const getInstances = () => cy.request('GET', `${orthancUrl}/instances`).its('body')

const findQuery = (query) => cy.exec(
  `curl -X POST "$ORTHANC_URL/tools/find" --data '${JSON.stringify(query)}'`
)

const deletePatient = (patientId) => cy.request('DELETE', `${orthancUrl}/patients/${patientId}`)
const deleteStudy = (studyId) => cy.request('DELETE', `${orthancUrl}/studies/${studyId}`)
const deleteSerie = (serieId) => cy.request('DELETE', `${orthancUrl}/series/${serieId}`)
const deleteInstance = (instanceId) => cy.request('DELETE', `${orthancUrl}/instances/${instanceId}`)

// Get Requests to orthanc server API
Cypress.Commands.add('orthancPatients', getPatients)
Cypress.Commands.add('orthancStudies', getStudies)
Cypress.Commands.add('orthancSeries', getSeries)
Cypress.Commands.add('orthancInstances', getInstances)

// DELETE via orthanc server API
Cypress.Commands.add('orthancDeletePatient', patientId => deletePatient(patientId))
Cypress.Commands.add('orthancDeletePatients', () => {
  getPatients().then(patientIds => {
    patientIds.forEach(patientId => deletePatient(patientId));
  })
})

Cypress.Commands.add('orthancDeleteStudy', patientId => deletePatient(patientId))
Cypress.Commands.add('orthancDeleteStudies', () => {
  getPatients().then(patientIds => {
    patientIds.forEach(patientId => deletePatient(patientId));
  })
})

Cypress.Commands.add('getSerieInstanceUids', (StudyDate = '20180110') => {
  findQuery({ Level: 'Series', Query: { StudyDate } })
    .then(response => getSerieInstances(JSON.parse(response.stdout)[0]))
})

Cypress.Commands.add('refreshOrthancServerImages', () => {
  cy.exec('docker exec "${ORTHANC_NAME:-lesion-tracker_orthanc_1}" /usr/bin/delete_images').then(response => {
    return cy.exec('docker exec "${ORTHANC_NAME:-lesion-tracker_orthanc_1}" /usr/bin/upload_images')
  })
})
