const MongoClient = require('mongodb').MongoClient
const execPromise = require('./execPromise')

const dbName = 'ohif'

const connect = async () => MongoClient.connect(process.env.MONGO_URL)

const getDb = async () => {
  const connection = await connect()
  return connection.db(dbName)
}

const getCollection = async (coll) => {
  const db = await getDb()
  return db.collection(coll)
}

const mongoDrop = async function({ coll = 'users', find }) {
  const collection = await getCollection(coll)
  return collection.deleteOne(find)
}

const mongoFind = async function({ coll = 'users', find = {} }) {
  const collection = await getCollection(coll)
  const cursor = await collection.find(find)
  return cursor.toArray()
}

const mongoFindOne = async function({ coll = 'users', find = {} }) {
  const collection = await getCollection(coll)
  const cursor = await collection.findOne(find)
  return cursor
}

const mongoRestore = (archivePath = null) => {
  return execPromise(
    `mongo '${process.env.MONGO_URL}' --eval 'db.dropDatabase();' && ` +
    `mongorestore --uri="${process.env.MONGO_URL}" --gzip --archive="${archivePath || process.env.MONGO_INITIAL_DB}"`
  )
}

module.exports = {
  mongoDrop,
  mongoFind,
  mongoFindOne,
  mongoRestore
}
