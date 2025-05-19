const express = require("express");
const router = express.Router();
const User = require("../models/authModel");
const Course = require("../models/courseModel");

const ALL_CATEGORIES = ["Frontend", "Backend", "Full Stack", "Mobil Geliştirme", "Veri Bilimi"];

router.get('/simple-ai/:username', async (req, res) => {
  try {
    const username = req.params.username;

    // Kullanıcıyı bul ve satın alınan kursları populate et
    const user = await User.findOne({ username }).populate('myCourses');
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    // Kullanıcının satın aldığı kursların kategorileri
    const userCategories = [...new Set(user.myCourses.map(c => c.category))];

    // Kullanıcının sahip olmadığı kategoriler
    const recommendCategories = ALL_CATEGORIES.filter(cat => !userCategories.includes(cat));

    // Eğer kullanıcı tüm kategorileri aldıysa, zaten sahip olduğu kategorilerden öneri ver
    const queryCategories = recommendCategories.length ? recommendCategories : userCategories;

    // Kullanıcının sahip olduğu kursların _id'leri
    const ownedCourseIds = user.myCourses.map(c => c._id);

    // Öneriler: önerilen kategorilerden ve kullanıcıda olmayan kurslar
    const recommendations = await Course.find({
      category: { $in: queryCategories },
      _id: { $nin: ownedCourseIds }
    }).limit(3);

    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
