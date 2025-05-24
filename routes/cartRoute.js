const express = require('express');
const router = express.Router();
const User = require('../models/authModel');
const Course = require('../models/courseModel');

// Sabit kupon kodu
const FIXED_COUPONS = {
  "nurullah100": 100
};

// POST /api/cart/discounted
router.post('/discounted', async (req, res) => {
  const { username, cartCourseIds, couponCode } = req.body;

  try {
    const user = await User.findOne({ username }).populate('myCourses');
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    const userCategories = user.myCourses.map(course => course.category);

    const cartCourses = await Course.find({ _id: { $in: cartCourseIds } });

    let subtotal = 0;

    const discountedCart = cartCourses.map(course => {
      const hasSameCategory = userCategories.includes(course.category);
      const discountRate = hasSameCategory ? 0.1 : 0;
      const discountedPrice = Math.round(course.price * (1 - discountRate));

      subtotal += discountedPrice;

      return {
        ...course.toObject(),
        originalPrice: course.price,
        discountedPrice,
        discountApplied: hasSameCategory
      };
    });

    let couponDiscount = 0;
    if (couponCode && FIXED_COUPONS[couponCode]) {
      couponDiscount = FIXED_COUPONS[couponCode];
    }

    // En fazla sepet tutarı kadar indirim
    const finalTotal = Math.max(0, subtotal - couponDiscount);
    const tax = Math.round(finalTotal * 0.18); // %18 KDV

    res.json({
      discountedCart,
      subtotal,
      couponDiscount,
      tax,
      total: finalTotal + tax
    });

  } catch (err) {
    console.error("İndirim hesaplama hatası:", err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
