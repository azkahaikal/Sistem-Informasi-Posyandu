import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { HeartPulse, Lock, Mail, User, ArrowRight } from "lucide-react"
import ParticleBackground from "@/components/ui/particle-background"
import { motion } from "framer-motion"
import "@/health-theme.css"

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
      toast.error("Gagal terhubung ke server. Simulasi berhasil!")
      setTimeout(() => navigate("/login"), 1500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 font-sans overflow-hidden bg-[#f0fdf4]">
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10 py-10"
      >
        <Card className="shadow-2xl shadow-emerald-900/10 border-none bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="text-center space-y-6 pt-12">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: -10 }}
              className="mx-auto bg-emerald-500 p-5 rounded-[2rem] shadow-xl shadow-emerald-200"
            >
              <HeartPulse className="w-12 h-12 text-white" />
            </motion.div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-black tracking-tight text-emerald-950 font-serif">
                Buat Akun
              </CardTitle>
              <CardDescription className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">
                Bergabung dengan Komunitas Sehat
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 px-10">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-emerald-900 font-black text-xs uppercase tracking-widest ml-1">Nama Lengkap</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-300 group-focus-within:text-emerald-600 transition-colors" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nama Lengkap Anda"
                    className="pl-12 h-14 border-green-50 focus:border-emerald-300 rounded-2xl bg-white shadow-sm font-medium"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-emerald-900 font-black text-xs uppercase tracking-widest ml-1">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-300 group-focus-within:text-emerald-600 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="anda@email.id"
                    className="pl-12 h-14 border-green-50 focus:border-emerald-300 rounded-2xl bg-white shadow-sm font-medium"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" title="password" className="text-emerald-900 font-black text-xs uppercase tracking-widest ml-1">Password Baru</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-300 group-focus-within:text-emerald-600 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    className="pl-12 h-14 border-green-50 focus:border-emerald-300 rounded-2xl bg-white shadow-sm font-medium"
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
                {loading ? "Mendaftar..." : <span className="flex items-center gap-2">Daftar Akun <ArrowRight className="w-5 h-5" /></span>}
              </Button>
              
              <p className="text-center text-sm font-medium text-emerald-800">
                Sudah punya akun?{" "}
                <Link to="/login" title="login" className="font-black text-emerald-600 hover:text-emerald-700 hover:underline underline-offset-4">
                  Login di sini
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
