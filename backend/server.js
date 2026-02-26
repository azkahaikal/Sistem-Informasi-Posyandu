require("dotenv").config()
const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
const bcrypt = require("bcrypt")

const app = express()

app.use(cors())
app.use(express.json())

// Tambahkan rute GET untuk cek apakah server jalan
app.get("/", (req, res) => {
  res.send("Backend Posyandu API is running... 🚀")
})

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", 
  database: "posyandu"
})

db.connect(err => {
  if (err) {
    console.error("❌ Database gagal connect:", err.message)
    console.log("👉 Pastikan Anda sudah menjalankan 'node db_setup.js' dan MySQL aktif.")
  } else {
    console.log("✅ Database berhasil connect ke 'posyandu'")
  }
})

app.post("/api/register", async (req, res) => {
  const { name, email, password, role = "masyarakat" } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email sudah terdaftar" })
          }
          return res.status(500).json({ message: "Gagal menyimpan data" })
        }
        res.status(201).json({ message: "Registrasi berhasil" })
      }
    )
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" })

      if (results.length === 0) {
        return res.status(401).json({ message: "Email tidak ditemukan" })
      }

      const valid = await bcrypt.compare(password, results[0].password)

      if (!valid) {
        return res.status(401).json({ message: "Password salah" })
      }

      // Kirim role ke frontend
      res.json({ 
        message: "Login berhasil",
        user: {
          id: results[0].id,
          name: results[0].name,
          email: results[0].email,
          role: results[0].role
        }
      })
    }
  )
})

app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body
  // Logic sederhana: cek apakah email ada
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (results.length > 0) {
      res.json({ message: "Instruksi reset password dikirim ke email Anda (Mock)" })
    } else {
      res.status(404).json({ message: "Email tidak terdaftar" })
    }
  })
})

app.listen(5000, () => {
  console.log("Server jalan di http://localhost:5000 🚀")
})