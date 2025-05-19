const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const databaseConnect = require("./config/database.js");
const authRouter = require("./routes/authRoute.js");
const courseRouter = require("./routes/courseRoute.js");
const purchaseRoutes = require("./routes/purchaseRoutes.js");
const profileRoutes = require('./routes/profileRoute.js');

dotenv.config();
const app = express();
const server = http.createServer(app);

// === Socket.IO Ayarı ===
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://konyaereglisatis.com", "https://konyaereglisatis.com"],
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// === Kullanıcı adı - socketId eşleştirmesi için map ===
const users = {}; // { username: socketId }

// === Socket bağlantı işlemleri ===
io.on("connection", (socket) => {
  console.log("Yeni kullanıcı bağlandı:", socket.id);

  // Kullanıcı kendini tanıtırken (join olurken)
  socket.on("join", (username) => {
    users[username] = socket.id;
    console.log(`Kullanıcı ${username} socketId: ${socket.id}`);
    io.emit("user-list", users); // İsteğe bağlı: tüm client’lara online listesi
  });

  // Kullanıcı ayrıldığında
  socket.on("disconnect", () => {
    for (const [username, id] of Object.entries(users)) {
      if (id === socket.id) {
        delete users[username];
        console.log(`${username} bağlantıyı kapattı.`);
        break;
      }
    }
    socket.broadcast.emit("call-ended");
    io.emit("user-list", users); // Listeyi güncelle
  });

  // Çağrı başlat
  socket.on("call-user", ({ userToCallUsername, signalData, from, name }) => {
    const toSocketId = users[userToCallUsername];
    if (toSocketId) {
      io.to(toSocketId).emit("call-user", {
        signal: signalData,
        from,
        name
      });
    }
  });

  // Çağrıya cevap ver
  socket.on("answer-call", ({ signal, to }) => {
    io.to(to).emit("call-accepted", signal);
  });

  // Socket ID’sini gönder
  socket.emit("me", socket.id);
});


// === Middleware ===
app.use(cors({
  origin: ['http://localhost:5173', 'https://konyaereglisatis.com'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// === Routes ===
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/profile", profileRoutes);


// === Veritabanı + Sunucu başlat ===
const PORT = process.env.PORT || 5000;
databaseConnect();

server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor...`);
});
