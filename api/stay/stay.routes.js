const express = require('express');
const {
  requireAuth,
  requireHost,
} = require('../../middlewares/requireAuth.middleware');
const { log } = require('../../middlewares/logger.middleware');
const {
  getStays,
  getStayById,
  addStay,
  updateStay,
} = require('./stay.controller');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getStays);
router.get('/:id', getStayById);
router.post('/', requireAuth, requireHost, addStay);
// router.post('/', addStay);
router.put('/:id', requireAuth, requireHost, updateStay);
router.put('/:id', updateStay);
module.exports = router;
