// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const { mongoFind, mongoDrop, mongoFindOne, mongoRestore } = require('./mongo')
const execPromise = require('./execPromise')

const orthancReload = () => {
  return execPromise(
    `docker exec "${process.env.ORTHANC_NAME}" /bin/sh -c '/usr/bin/delete_images && /usr/bin/upload_images'`
  )
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    mongoFind,
    mongoDrop,
    mongoFindOne,
    orthancReload,
    mongoRestore
  })
}
