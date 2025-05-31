const express = require('express');
const router = express.Router();
const { createCoupon, getAllCoupons } = require('../controllers/couponController');


router.post('/', createCoupon);
router.get('/', getAllCoupons);

module.exports = router;
