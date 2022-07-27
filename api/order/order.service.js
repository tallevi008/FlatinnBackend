const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

// GET LIST
// TODO: move filter to back
async function query(filterBy) {
  try {
    const criteria = {} //_buildCriteria(filterBy);

    const collection = await dbService.getCollection('order')
    var orders = await collection.find(criteria).toArray()
    // _sort(orders, filterBy.sortBy);
    return orders
  } catch (err) {
    logger.error('cannot find orders', err)
    throw err
  }
}

// GET BY ID
async function getById(orderId) {
  try {
    const collection = await dbService.getCollection('order')
    const order = collection.findOne({ _id: ObjectId(orderId) })
    return order
  } catch (err) {
    logger.error(`while finding order ${orderId}`, err)
    throw err
  }
}

// POST (add order)
async function add(order) {
  try {
    const collection = await dbService.getCollection('order')
    order.createdAt = ObjectId(order._id).getTimestamp()
    const addedOrder = await collection.insertOne(order)
    return addedOrder.ops[0]
  } catch (err) {
    logger.error('cannot insert order', err)
    throw err
  }
}

// PUT (Update order)
async function update(order) {
  try {
    var id = ObjectId(order._id)
    delete order._id
    const collection = await dbService.getCollection('order')

    await collection.updateOne({ _id: id }, { $set: { ...order } })
    order._id = id
    return order
  } catch (err) {
    logger.error(`cannot update order ${order._id}`, err)
    throw err
  }
}

module.exports = {
  query,
  getById,
  add,
  update,
}
