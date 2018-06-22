Cypress.Commands.add('mongoRestore', () => {
  cy.exec('mongo "$MONGO_URL" --eval "db.dropDatabase()"').then(() => {
    cy.exec('mongorestore ' +
      '--uri="${MONGO_URL:-\'http://127.0.0.1:3001/meteor\'}" ' +
      '--gzip ' +
      '--archive="${MONGO_DUMP_PATH:-/tmp/test_mongo_dump.gz}"')
  })
})

Cypress.Commands.add('restoreTestingUser', () => {
  cy.exec(
    'mongo "$MONGO_URL" --eval \'' +
    'db.users.deleteOne(' +
      '{ "emails.address": { "$eq": "testing.user@example.com" } }' +
    ')\''
  ).then(result => {
    cy.exec(
      'mongoimport --uri="$MONGO_URL" ' +
      '--collection users --type json ' +
      '--file "${TRAVIS_BUILD_DIR:-..}/test/testing_user.json"'
    )
  })
})
