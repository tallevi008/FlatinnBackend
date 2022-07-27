const express = require('express');
const {
  requireAuth,
  requireHost,
} = require('../../middlewares/requireAuth.middleware');
const { log } = require('../../middlewares/logger.middleware');
const {
  getOrders,
  getOrderById,
  addOrder,
  updateOrder,
} = require('./order.controller');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getOrders);
router.get('/:id', getOrderById);
router.post('/', requireAuth, addOrder);
// router.post('/', addOrder);
// router.put('/:id', updateOrder);
router.put('/:id', requireAuth, requireHost, updateOrder);
module.exports = router;
