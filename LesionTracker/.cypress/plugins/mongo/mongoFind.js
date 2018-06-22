const getCollection = require('./getCollection')

const mongoFind = async function({ coll = 'users', find = {} }) {
  const collection = await getCollection(coll)
  const cursor = await collection.find(find)
  return cursor.toArray()
}

module.exports = mongoFind
