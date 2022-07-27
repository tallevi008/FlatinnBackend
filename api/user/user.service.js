const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  query,
  getById,
  getByUsername,
  remove,
  update,
  add,
}

async function query(filterBy = {}) {
  const criteria = {} // _buildCriteria(filterBy);
  try {
    const collection = await dbService.getCollection('user')
    var users = await collection.find(criteria).toArray()
    users = users.map((user) => {
      delete user.password
      user.createdAt = ObjectId(user._id).getTimestamp()
      return user
    })
    return users
  } catch (err) {
    logger.error('cannot find users', err)
    throw err
  }
}

async function getById(userId) {
  try {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ _id: ObjectId(userId) })
    delete user.password

    // user.givenReviews = await reviewService.query({
    //   byUserId: ObjectId(user._id),
    // });
    // user.givenReviews = user.givenReviews.map(review => {
    //   delete review.byUser;
    //   return review;
    // });

    return user
  } catch (err) {
    logger.error(`while finding user ${userId}`, err)
    throw err
  }
}
async function getByUsername(username) {
  try {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ username })
    return user
  } catch (err) {
    logger.error(`while finding user ${username}`, err)
    throw err
  }
}

async function remove(userId) {
  try {
    const collection = await dbService.getCollection('user')
    await collection.deleteOne({ _id: ObjectId(userId) })
  } catch (err) {
    logger.error(`cannot remove user ${userId}`, err)
    throw err
  }
}

async function update(user) {
  try {
    id = ObjectId(user._id)
    delete user._id

    const collection = await dbService.getCollection('user')
    await collection.updateOne({ _id: id }, { $set: { ...user } })
    user._id = id
    delete user.password
    return user
  } catch (err) {
    logger.error(`cannot update user ${user._id}`, err)
    throw err
  }
}

async function add(user) {
  try {
    // peek only updatable fields!
    const userToAdd = {
      fullname: user.fullname,
      imgUrl:
        'https://a0.muscache.com/im/pictures/d17abb7c-beb0-4dbe-976e-fc633de18b4b.jpg?aki_policy=profile_small',
      username: user.username,
      password: user.password,
      isHost: user.host || false,
    }
    const collection = await dbService.getCollection('user')
    await collection.insertOne(userToAdd)

    delete userToAdd.password
    return userToAdd
  } catch (err) {
    logger.error('cannot insert user', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.txt) {
    const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
    criteria.$or = [
      {
        username: txtCriteria,
      },
      {
        fullname: txtCriteria,
      },
    ]
  }
  if (filterBy.minBalance) {
    criteria.score = { $gte: filterBy.minBalance }
  }
  return criteria
}
