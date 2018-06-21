const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const { url, dbName } = require('./connection')

const connect = async () => {
  // Use connect method to connect to the server
    return MongoClient.connect(url)
}

const getCollection = (db, coll) => {
  return db.collection(coll)
}

const dropMongoRow = async function(args) {
  const connection = await connect()
  const db = connection.db(dbName)

  const collection = await getCollection(db, args.coll)
  return collection.deleteOne(args.qr)
}

module.exports = dropMongoRow
