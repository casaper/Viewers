const mongoUrl = Cypress.env('MONGO_URL') || 'mongodb://meteor:test@127.0.0.1:27017/ohif?authSource=admin'
const mongoDumpPath = Cypress.env('MONGO_DUMP_PATH') || '../test/db_snapshots/01_initial_with_testing_user.gz'
const travisBuildDir = Cypress.env('TRAVIS_BUILD_DIR') || '..'

Cypress.Commands.add('mongoRestore', (archivePath = null) => {
  cy.exec(`mongo '${mongoUrl}' --eval 'db.dropDatabase()'`)
    .then((code, stdout, stderr) => {
      cy.exec(`mongorestore --uri='${mongoUrl}' --gzip --archive='${archivePath || mongoDumpPath}'`)
    })
})

Cypress.Commands.add('restoreTestingUser', () => {
  const findTestingUser = 'db.users.deleteOne({ "emails.address": { "$eq": "testing.user@example.com" } })'
  cy.exec(`mongo '${mongoUrl}' --eval '${findTestingUser}'`).then(result => {
    cy.exec(`mongoimport --uri='${mongoUrl}' --collection users --type json --file '${travisBuildDir}/test/db_exports/users.json'`)
  })
})
