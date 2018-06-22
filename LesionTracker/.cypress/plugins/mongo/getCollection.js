const MongoClient = require('mongodb').MongoClient;

// connection settings
const url = 'mongodb://127.0.0.1:3001/meteor'
const dbName = 'meteor'

const connect = async () => MongoClient.connect(url)
const getDb = (connection) => connection.db(dbName)
const getCollection = async (coll) => {
  const connection = await connect()
  const db = getDb(connection)
  return db.collection(coll)
}

module.exports = getCollection
