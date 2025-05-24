const express = require('express');
const router = express.Router();
const User = require('../models/authModel');
const Course = require('../models/courseModel');

// Sabit kupon kodu
const FIXED_COUPONS = {
  "nurullah100": 100
};

router.post('/discounted', async (req, res) => {
  try {
    const { username, cartCourseIds } = req.body;
    
    // 1. Validasyon
    if (!username || !cartCourseIds?.length) {
      return res.status(400).json({ message: 'Eksik bilgi' });
    }

    // 2. Verileri çek
    const user = await User.findOne({ username }).populate('myCourses');
    const cartCourses = await Course.find({ _id: { $in: cartCourseIds } });

    // 3. Hesaplamalar
    const userCategories = user?.myCourses?.map(c => c.category) || [];
    
    const discountedCart = cartCourses.map(course => {
      const hasSameCategory = userCategories.includes(course.category);
      const originalPrice = course.price || 0; // Fallback
      const discountedPrice = hasSameCategory 
        ? Math.round(originalPrice * 0.9)
        : originalPrice;

      return {
        ...course.toObject(),
        originalPrice,
        discountedPrice,
        discountApplied: hasSameCategory
      };
    });

    res.json({ discountedCart });
    
  } catch (err) {
    console.error("Hata:", err);
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});
module.exports = router;
