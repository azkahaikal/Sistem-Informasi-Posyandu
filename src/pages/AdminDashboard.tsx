export default function AdminDashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{
        width: "220px",
        backgroundColor: "#2c3e50",
        color: "white",
        padding: "20px"
      }}>
        <h2>Admin</h2>
        <hr style={{ borderColor: "#555" }} />

        <p style={{ cursor: "pointer" }}>Dashboard</p>
        <p style={{ cursor: "pointer" }}>Data Balita</p>
        <p style={{ cursor: "pointer" }}>Data Ibu Hamil</p>
        <p style={{ cursor: "pointer" }}>Laporan</p>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: "30px",
        backgroundColor: "#f4f6f9"
      }}>
        <h1>Dashboard Admin Posyandu</h1>

        <div style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px"
        }}>
          
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "200px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}>
            <h3>Total Balita</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>0</p>
          </div>

          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "200px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}>
            <h3>Total Ibu Hamil</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>0</p>
          </div>

        </div>
      </div>
    </div>
  )
}