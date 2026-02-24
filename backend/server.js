require("dotenv").config()
const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
const bcrypt = require("bcrypt")

const app = express()

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // isi kalau ada password mysql
  database: "posyandu"
})

db.connect(err => {
  if (err) {
    console.log("Database gagal connect ❌")
  } else {
    console.log("Database berhasil connect ✅")
  }
})

app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body

  db.query(
    "SELECT * FROM admins WHERE email = ?",
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

      res.json({ message: "Login berhasil" })
    }
  )
})

app.listen(5000, () => {
  console.log("Server jalan di http://localhost:5000 🚀")
})