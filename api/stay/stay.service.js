const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

// GET LIST
// TODO: move filter to back
async function query(filterBy) {
  try {
    const criteria = _buildCriteria(filterBy)

    const collection = await dbService.getCollection('stay')

    //original!!!! if the limit does not work.
    // var stays = await collection.find(criteria).toArray()

    var stays = await collection.find(criteria).limit(150).toArray()

    // stays.map((stay) => console.log('stay = ', stay.address.city))
    // stays.map((stay) => console.log('stay city = ', stay.address.city))

    console.log('found stays length= ', stays.length)
    console.log('criteria=', criteria)
    console.log('filterBy=', filterBy)
    filterBy
    // var stays = await collection.find(criteria).limit(50).toArray()
    // _sort(stays, filterBy.sortBy);
    return stays
  } catch (err) {
    logger.error('cannot find stays', err)
    throw err
  }
}

// GET BY ID
async function getById(stayId) {
  try {
    const collection = await dbService.getCollection('stay')
    const stay = collection.findOne({ _id: ObjectId(stayId) })
    return stay
  } catch (err) {
    logger.error(`while finding stay ${stayId}`, err)
    throw err
  }
}

// POST (add stay)
async function add(stay) {
  try {
    const collection = await dbService.getCollection('stay')
    stay.createdAt = ObjectId(stay._id).getTimestamp()
    const addedStay = await collection.insertOne(stay)
    return addedStay.ops[0]
  } catch (err) {
    logger.error('cannot insert stay', err)
    throw err
  }
}

// PUT (Update stay)
async function update(stay) {
  try {
    var id = ObjectId(stay._id)
    delete stay._id
    const collection = await dbService.getCollection('stay')

    await collection.updateOne({ _id: id }, { $set: { ...stay } })
    stay._id = id
    return stay
  } catch (err) {
    logger.error(`cannot update stay ${stay._id}`, err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  let criteria = {}

  console.log('filterBy=', filterBy)

  // filterBy.address = 'rio'
  // if (filterBy.address) {
  //   criteria.address = {}
  //   const regex = new RegExp(filterBy.address, 'i')
  //   criteria.address.city = { $regex: regex }
  // }

  //works for roomType
  // criteria.address = {}
  // const regex = new RegExp('Private', 'i')
  // criteria.address.city = { $regex: regex }

  // working for roomType
  // criteria.name = {}
  // criteria.name = { $regex: 'test', $options: 'i' }

  //workkk
  // criteria = { 'address.city': { $regex: 'rio', $options: 'i' } }

  // // working for roomType
  // criteria.roomType = {}
  // criteria.roomType = { $regex: 'vate', $options: 'i' }

  // // filter by city
  if (filterBy.address) {
    // prettier-ignore
    criteria = {'address.city': { '$regex': filterBy.address, '$options': 'i' } }
  }
  // //filter by inStock
  // if (filterBy.isInStock) {
  //   criteria.inStock =
  //     filterBy.isInStock === 'true' ? { $eq: true } : { $eq: false }
  // }

  // //filter by labels
  // if (filterBy.selectedLabels) {
  //   criteria.labels = { $in: filterBy.selectedLabels }
  // }
  console.log('criteria filter=', criteria)
  return criteria
}

function _sort(stays, sortBy) {
  if (!sortBy) return

  switch (sortBy) {
    case 'createdAt':
      stays.sort((t1, t2) => t1.createdAt - t2.createdAt)
      break
    case 'name':
      stays.sort((t1, t2) => t1.name.localeCompare(t2.name))
      break
    case 'price':
      stays.sort((t1, t2) => t1.price - t2.price)
      break
  }
}

module.exports = {
  query,
  getById,
  add,
  update,
}
