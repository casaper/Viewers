
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

const queryMongo = async function(args) {
  const connection = await connect()
  const db = connection.db(dbName)

  const collection = await getCollection(db, args.coll)
  const cursor = await collection.find(args.qr)
  return cursor.toArray()
}

module.exports = queryMongo
