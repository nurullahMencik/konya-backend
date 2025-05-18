// models/User.js (düzenlenmiş hali)
const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  myCourses: [ //kullnıcının satın aldıgı kurslar
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  createdCourses: [ // Kullanıcının oluşturduğu kurslar
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
   isAdmin: {
    type: Boolean,
    default: false
  },
  
  date: {
    type: Date,
    default: new Date()
  },
});

module.exports = mongoose.model("auth", authSchema);
