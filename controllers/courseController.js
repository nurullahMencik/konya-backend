const Course = require('../models/courseModel');
const User = require("../models/authModel");
const fs = require("fs");
const path = require('path');

/**
 * Yeni kurs oluşturur. 
 * Kullanıcı var mı kontrol eder, dosya ve görsel yüklendi mi kontrol eder.
 * İlişkili kullanıcıya da oluşturulan kursu ekler.
 */
const createCourse = async (req, res) => {
  try {
    const { title, description, category, user, price } = req.body;

    if (!user) return res.status(400).json({ message: 'Kullanıcı bilgisi eksik!' });
    const foundUser = await User.findOne({ username: user });
    if (!foundUser) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    const file = req.files?.file?.[0];
    const image = req.files?.image?.[0];

    if (!file || !image) return res.status(400).json({ message: 'Dosya ve fotoğraf yüklenmeli' });

    // Cloudinary'e yükleme
    const uploadedVideo = await cloudinary.uploader.upload(file.path, {
      resource_type: "video",
      folder: "courses/videos"
    });
    const uploadedImage = await cloudinary.uploader.upload(image.path, {
      folder: "courses/images"
    });

    const newCourse = new Course({
      title,
      price,
      description,
      category,
      user: foundUser.username,
      fileUrl: uploadedVideo.secure_url,
      imageUrl: uploadedImage.secure_url,
    });

    await newCourse.save();

    // Kullanıcıya kursu bağla
    foundUser.createdCourses.push(newCourse._id);
    await foundUser.save();

    // Geçici dosyaları sil
    fs.unlinkSync(file.path);
    fs.unlinkSync(image.path);

    res.status(201).json({ message: 'Kurs başarıyla oluşturuldu', course: newCourse });

  } catch (error) {
    console.error('Kurs oluşturulurken hata:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

/**
 * Tüm kursları getirir.
 */
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

/**
 * Admin için kurs silme işlemi.
 * Dosyaları (video ve görsel) da diskte siler.
 */
const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({ error: 'Kurs bulunamadı' });
    }

    // Dosya isimleri modelden
    const videoFile = deletedCourse.fileUrl?.replace('/uploads/', '');
    const imageFile = deletedCourse.imageUrl?.replace('/uploads/', '');

    // Dosya yolları
    const videoPath = videoFile && path.join(__dirname, '..', 'public', 'uploads', videoFile);
    const imagePath = imageFile && path.join(__dirname, '..', 'public', 'uploads', imageFile);

    // Dosyaları sil
    [videoPath, imagePath].forEach(file => {
      if (file && fs.existsSync(file)) {
        fs.unlink(file, err => {
          if (err) {
            console.error(`❌ Dosya silinemedi: ${file}`, err);
          } else {
            console.log(`✅ Dosya silindi: ${file}`);
          }
        });
      }
    });

    res.json({ message: 'Kurs ve dosyaları başarıyla silindi.', id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Kurs silinirken bir hata oluştu.');
  }
};

/**
 * Kurs güncelleme fonksiyonu.
 * Yeni dosya varsa dosya URL'lerini günceller.
 * Diğer alanları da günceller.
 */
const updateCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Kurs bulunamadı' });
    }

    const file = req.files?.file;
    const image = req.files?.image;

    if (file && file[0]) {
      course.fileUrl = `/uploads/${file[0].filename}`;
    }

    if (image && image[0]) {
      course.imageUrl = `/uploads/${image[0].filename}`;
    }

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (price) course.price = price;

    await course.save();

    res.status(200).json({ message: 'Kurs başarıyla güncellendi', course });
  } catch (error) {
    console.error('Güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = { createCourse, getCourses, deleteCourse, updateCourse };
