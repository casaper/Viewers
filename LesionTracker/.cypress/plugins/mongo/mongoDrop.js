const getCollection = require('./getCollection')

const mongoDrop = async function({ coll = 'users', find }) {
  const collection = await getCollection(coll)
  return collection.deleteOne(find)
}

module.exports = mongoDrop
