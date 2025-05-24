const express = require('express');
const router = express.Router();
const User = require('../models/authModel');
const Course = require('../models/courseModel');

// POST /api/discounted-cart
// Body: { username: "johndoe", cartCourseIds: [id1, id2, id3] }
router.post('/discounted-cart', async (req, res) => {
  const { username, cartCourseIds } = req.body;

  try {
    const user = await User.findOne({ username }).populate('myCourses');
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    const userCategories = user.myCourses.map(course => course.category);

    const cartCourses = await Course.find({ _id: { $in: cartCourseIds } });

    const discountedCart = cartCourses.map(course => {
      const hasSameCategory = userCategories.includes(course.category);
      const discountRate = hasSameCategory ? 0.1 : 0;
      const discountedPrice = course.price * (1 - discountRate);

      return {
        ...course.toObject(),
        originalPrice: course.price,
        discountedPrice,
        discountApplied: hasSameCategory
      };
    });

    res.json({ discountedCart });
  } catch (err) {
    console.error("İndirim hesaplama hatası:", err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
