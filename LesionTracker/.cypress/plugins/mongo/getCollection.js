const getDb = require('./getDb')

const getCollection = async (coll) => {
  const db = await getDb()
  return db.collection(coll)
}

module.exports = getCollection
