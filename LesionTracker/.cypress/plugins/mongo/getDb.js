const MongoClient = require('mongodb').MongoClient

// connection settings
const url = 'mongodb://127.0.0.1:3001/meteor'
const dbName = 'meteor'

const connect = async () => MongoClient.connect(url)
const getDb = async () => {
  const connection = await connect()
  return connection.db(dbName)
}

module.exports = getDb
