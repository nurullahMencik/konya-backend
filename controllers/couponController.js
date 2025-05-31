const Coupon = require('../models/CouponModel');

// Admin creates a coupon
const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage } = req.body;

    const existing = await Coupon.findOne({ code });
    if (existing) return res.status(400).json({ message: 'Kupon zaten mevcut.' });

    const newCoupon = new Coupon({ code, discountPercentage });
    await newCoupon.save();
    res.status(201).json({ message: 'Kupon oluşturuldu.', coupon: newCoupon });
  } catch (error) {
    res.status(500).json({ message: 'Kupon oluşturulamadı.', error: error.message });
  }
};

// All coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Kuponlar alınamadı.', error: error.message });
  }
};

module.exports = { createCoupon, getAllCoupons };
