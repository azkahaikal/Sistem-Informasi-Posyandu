import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { HeartPulse, Lock, Mail, User } from "lucide-react"
import ParticleBackground from "@/components/ui/particle-background"

export default function RegisterMasyarakat() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "masyarakat" })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Pendaftaran Berhasil! Silakan login.")
        setTimeout(() => navigate("/login"), 1500)
      } else {
        toast.error(data.message || "Gagal mendaftar")
      }
    } catch (err) {
      toast.error("Gagal terhubung ke server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 font-sans antialiased">
      <ParticleBackground />

      <Card className="w-full max-w-md shadow-[0_20px_50px_rgba(8,_112,_84,_0.1)] border-green-200 bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden">
        <CardHeader className="text-center space-y-4 pt-10">
          <div className="mx-auto bg-green-500 p-4 rounded-2xl shadow-lg shadow-green-200 animate-pulse-slow">
            <HeartPulse className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-extrabold tracking-tight text-green-900 font-serif">
              Daftar Akun
            </CardTitle>
            <CardDescription className="text-green-600 font-medium">
              Buat akun kesehatan keluarga anda
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 px-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-green-800 font-semibold text-sm">Nama Lengkap</Label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-4 w-4 text-green-400 group-focus-within:text-green-600 transition-colors" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama Lengkap Anda"
                  className="pl-10 h-12 border-green-100 focus:border-green-500 focus-visible:ring-green-500 rounded-xl bg-green-50/30"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-800 font-semibold text-sm">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-green-400 group-focus-within:text-green-600 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="anda@email.id"
                  className="pl-10 h-12 border-green-100 focus:border-green-500 focus-visible:ring-green-500 rounded-xl bg-green-50/30"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" title="password" className="text-green-800 font-semibold text-sm">Password Baru</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-green-400 group-focus-within:text-green-600 transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 border-green-100 focus:border-green-500 focus-visible:ring-green-500 rounded-xl bg-green-50/30"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 px-8 pb-10 pt-4 mt-6">
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 active:scale-95 transition-all py-6 text-lg font-bold rounded-xl shadow-lg shadow-green-200"
              disabled={loading}
            >
              {loading ? "Mendaftar..." : "Daftar Akun"}
            </Button>
            
            <p className="text-center text-sm text-green-700">
              Sudah punya akun?{" "}
              <Link to="/login" title="login" className="font-bold text-green-800 hover:underline">
                Login Sini
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
