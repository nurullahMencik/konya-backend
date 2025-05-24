const express = require("express");
const router = express.Router();

router.post("/apply-coupon", (req, res) => {
  const { code } = req.body;

  // Kupon kodu kontrolü
  if (code === "nurullah100") {
    return res.json({
      success: true,
      discountAmount: 100,
      message: "Kupon başarıyla uygulandı!",
    });
  }

  // Geçersiz kupon
  return res.status(400).json({
    success: false,
    error: "Geçersiz kupon kodu.",
  });
});

module.exports = router;
