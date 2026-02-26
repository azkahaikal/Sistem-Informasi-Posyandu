import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { HeartPulse, Lock, Mail, ArrowRight } from "lucide-react"
import ParticleBackground from "@/components/ui/particle-background"
import { motion } from "framer-motion"
import "@/health-theme.css"

export default function LoginMasyarakat() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulasi login untuk demo jika API belum siap
      if (email === "admin@posyandu.id" && password === "admin123") {
        toast.success("Selamat Datang, Admin!")
        localStorage.setItem("userRole", "admin")
        localStorage.setItem("userName", "Admin Posyandu")
        setTimeout(() => navigate("/dashboard"), 1000)
        return
      }

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`Selamat Datang, ${data.user.name}!`)
        localStorage.setItem("userRole", data.user.role)
        localStorage.setItem("userName", data.user.name)
        setTimeout(() => navigate("/dashboard"), 1000)
      } else {
        toast.error(data.message || "Email atau password salah")
      }
    } catch (err) {
      // Untuk tujuan demo, biarkan masuk jika gagal fetch (opsional, sesuaikan)
      toast.error("Gagal terhubung ke server. Menggunakan data simulasi...")
      localStorage.setItem("userRole", "masyarakat")
      localStorage.setItem("userName", "Warga Contoh")
      setTimeout(() => navigate("/dashboard"), 1500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 font-sans overflow-hidden bg-[#f0fdf4]">
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <Card className="shadow-2xl shadow-emerald-900/10 border-green-100 bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border-none">
          <CardHeader className="text-center space-y-6 pt-12">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="mx-auto bg-emerald-500 p-5 rounded-[2rem] shadow-xl shadow-emerald-200 animate-float"
            >
              <HeartPulse className="w-12 h-12 text-white" />
            </motion.div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-black tracking-tight text-emerald-950 font-serif">
                Selamat Datang
              </CardTitle>
              <CardDescription className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">
                Sistem Informasi Posyandu Digital
              </CardDescription>
            </div>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-10">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-emerald-900 font-black text-xs uppercase tracking-widest ml-1">Email Anda</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-300 group-focus-within:text-emerald-600 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.id"
                    className="pl-12 h-14 border-green-50 focus:border-emerald-300 focus-visible:ring-emerald-500/20 rounded-2xl bg-white shadow-sm font-medium"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <Label htmlFor="password" title="password" className="text-emerald-900 font-black text-xs uppercase tracking-widest">Password</Label>
                  <Link to="/forgot-password" title="forgot-password" className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-700 transition-colors">
                    Lupa password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-300 group-focus-within:text-emerald-600 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-12 h-14 border-green-50 focus:border-emerald-300 focus-visible:ring-emerald-500/20 rounded-2xl bg-white shadow-sm font-medium"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-8 px-10 pb-12 pt-6">
              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all h-14 text-lg font-black rounded-2xl shadow-xl shadow-emerald-200 interactive-button"
                disabled={loading}
              >
                {loading ? (
                  <motion.span 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    Memverifikasi...
                  </motion.span>
                ) : (
                  <span className="flex items-center gap-2">
                    Masuk Sekarang <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
              
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-green-100"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/50 backdrop-blur px-4 text-emerald-400 font-bold tracking-widest">Atau</span>
                </div>
              </div>

              <p className="text-center text-sm font-medium text-emerald-800">
                Baru di sini?{" "}
                <Link to="/register" title="register" className="font-black text-emerald-600 hover:text-emerald-700 hover:underline underline-offset-4">
                  Daftar Akun Gratis
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
