const mongoUrl = Cypress.env('MONGO_URL') || 'mongodb://meteor:test@127.0.0.1:27017/ohif?authSource=admin'
const travisBuildDir = Cypress.env('TRAVIS_BUILD_DIR') || '..'
const initialDb = Cypress.env('MONGO_INITIAL_DB') || '../test/db_snapshots/01_initial_with_testing_user.gz'

Cypress.Commands.add('mongoRestore', (archivePath = null) => {
  cy.exec(`mongo '${mongoUrl}' --eval 'db.dropDatabase()'`)
    .then((code, stdout, stderr) => {
      cy.exec(`mongorestore --uri='${mongoUrl}' --gzip --archive='${archivePath || initialDb}'`)
    })
})
