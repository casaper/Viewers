const { cyExec, cyRequest } = require('./promisifyedCys')

const orthancUrl = Cypress.env('ORTHANC_URL') || 'http://orthanc:orthanc@127.0.0.1:8042'
const orthancContainerName = Cypress.env('ORTHANC_NAME') || 'lesion-tracker_orthanc_1'

const getPatients = () => cyRequest({ url: `${orthancUrl}/patients` })

const getStudies = () => cyRequest({ url: `${orthancUrl}/studies` })

const getSeries = () => cyRequest({ url: `${orthancUrl}/series` })
const getSerie = (serieId) => cyRequest({ url: `${orthancUrl}/series/${serieId}` })
const getSerieInstances = (serieId) => cyRequest({ url: `${orthancUrl}/series/${serieId}/instances` })

const getInstances = () => cyRequest({ url: `${orthancUrl}/instances` })

const findQuery = (query) => cyExec(
  `curl -X POST "${orthancUrl}/tools/find" --data '${JSON.stringify(query)}'`
)

const deletePatient = (patientId) => cyRequest({ method: 'DELETE', url: `${orthancUrl}/patients/${patientId}` })
const deleteStudy = (studyId) => cyRequest({ method: 'DELETE', url: `${orthancUrl}/studies/${studyId}` })
const deleteSerie = (serieId) => cyRequest({ method: 'DELETE', url: `${orthancUrl}/series/${serieId}` })
const deleteInstance = (instanceId) => cyRequest({ method: 'DELETE', url: `${orthancUrl}/instances/${instanceId}` })

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

Cypress.Commands.add('deleteOrthancServerImages', () => {
  return cy.exec(`docker exec "${orthancContainerName}" /usr/bin/delete_images`)
})
Cypress.Commands.add('uploadOrthancServerImages', () => {
  return cy.exec(`docker exec "${orthancContainerName}" /usr/bin/upload_images`)
})

Cypress.Commands.add('reloadOrthancServerImages', () => {
  return cy.exec(`docker exec "${orthancContainerName}" /bin/sh -c '/usr/bin/delete_images && /usr/bin/upload_images'`)
})
