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

    // Kullanıcının satın aldığı kursların kategorilerini ve frekanslarını hesapla
    const categoryCounts = {};
    user.myCourses.forEach(course => {
      categoryCounts[course.category] = (categoryCounts[course.category] || 0) + 1;
    });

    // Kullanıcının en çok aldığı kategorileri bul (en az 1 kurs almış olmalı)
    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(item => item[0]);

    // Eğer kullanıcının kursu yoksa rastgele kategorilerden öner
    if (sortedCategories.length === 0) {
      const randomRecommendations = await Course.aggregate([
        { $sample: { size: 3 } }
      ]);
      return res.json(randomRecommendations);
    }

    // Kullanıcının sahip olduğu kursların _id'leri
    const ownedCourseIds = user.myCourses.map(c => c._id);

    // Öneriler: Kullanıcının en çok aldığı kategorilerden ve sahip olmadığı kurslar
    const recommendations = await Course.find({
      category: { $in: sortedCategories },
      _id: { $nin: ownedCourseIds }
    })
    .sort({ createdAt: -1 }) // Yeni eklenen kurslar önce gelsin
    .limit(3);

    // Eğer öneri yoksa, aynı kategorilerden farklı kurslar öner
    if (recommendations.length === 0) {
      const fallbackRecommendations = await Course.find({
        category: { $in: sortedCategories },
        _id: { $nin: ownedCourseIds }
      })
      .limit(3);
      return res.json(fallbackRecommendations);
    }

    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;