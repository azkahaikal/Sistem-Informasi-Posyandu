const mysql = require("mysql2/promise")
const bcrypt = require("bcrypt")
require("dotenv").config()

const setup = async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "" 
  })

  try {
    await connection.query("CREATE DATABASE IF NOT EXISTS posyandu")
    await connection.query("USE posyandu")

    // Ubah tabel admins menjadi users dengan kolom role
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'masyarakat') DEFAULT 'masyarakat',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("Tabel 'users' dengan sistem Role siap. ✅")

    // Buat Admin Default
    const [admins] = await connection.query("SELECT * FROM users WHERE role = 'admin'")
    if (admins.length === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10)
      await connection.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["Administrator Posyandu", "admin@posyandu.id", hashedPassword, "admin"]
      )
      console.log("Admin default dibuat! (admin@posyandu.id / admin123) 👤")
    }

  } catch (error) {
    console.error("Gagal setup database:", error)
  } finally {
    await connection.end()
    process.exit()
  }
}

setup()
