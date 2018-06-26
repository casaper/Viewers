const MongoClient = require('mongodb').MongoClient

// connection settings
// const url = Cypress.env('MONGO_URL') || 'mongodb://meteor:test@127.0.0.1:27017?authSource=admin'
const dbName = 'ohif'

const connect = async () => MongoClient.connect(process.env.MONGO_URL)
const getDb = async () => {
  const connection = await connect()
  return connection.db(dbName)
}

module.exports = getDb
