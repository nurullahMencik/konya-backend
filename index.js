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

// === GÜVENİLİR PROXY (Render için şart) ===
app.set('trust proxy', 1);

// === CORS Ayarı (Tüm HTTP istekleri için geçerli) ===
const allowedOrigins = [
  "http://localhost:5173",
  "http://konyaereglisatis.com",
  "https://konyaereglisatis.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Tarayıcı CORS preflight isteğinde origin boş olabilir
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS policy hatası: Erişim engellendi"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// === Middleware ===
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// === Routes ===
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/profile", profileRoutes);

// === Socket.IO Ayarı ===
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  }
});

const users = {}; // { username: socketId }

io.on("connection", (socket) => {
  console.log("Yeni kullanıcı bağlandı:", socket.id);

  socket.on("join", (username) => {
    users[username] = socket.id;
    console.log(`Kullanıcı ${username} socketId: ${socket.id}`);
    io.emit("user-list", users);
  });

  socket.on("disconnect", () => {
    for (const [username, id] of Object.entries(users)) {
      if (id === socket.id) {
        delete users[username];
        console.log(`${username} bağlantıyı kapattı.`);
        break;
      }
    }
    socket.broadcast.emit("call-ended");
    io.emit("user-list", users);
  });

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

  socket.on("answer-call", ({ signal, to }) => {
    io.to(to).emit("call-accepted", signal);
  });

  socket.emit("me", socket.id);
});

// === Veritabanı ve sunucu başlat ===
const PORT = process.env.PORT || 5000;
databaseConnect();

server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor...`);
});
