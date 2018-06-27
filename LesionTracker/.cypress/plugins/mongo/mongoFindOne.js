const getCollection = require('./getCollection')

const mongoFindOne = async function({ coll = 'users', find = {} }) {
  const collection = await getCollection(coll)
  const cursor = await collection.findOne(find)
  return cursor
}

module.exports = mongoFindOne
