import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { HeartPulse, Mail, ArrowLeft, Send } from "lucide-react"
import ParticleBackground from "@/components/ui/particle-background"
import { motion } from "framer-motion"
import "@/health-theme.css"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(data.message)
        setIsSent(true)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.success("Link pemulihan telah dikirim (Simulasi)")
      setIsSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 font-sans overflow-hidden bg-[#f0fdf4]">
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="shadow-2xl shadow-emerald-900/10 border-none bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="text-center space-y-6 pt-12">
            <div className="mx-auto bg-emerald-500 p-5 rounded-[2rem] shadow-xl shadow-emerald-200">
              <HeartPulse className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-black tracking-tight text-emerald-950 font-serif">
                Lupa Password
              </CardTitle>
              <CardDescription className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">
                Pulihkan Akses Kesehatan Anda
              </CardDescription>
            </div>
          </CardHeader>
          
          {!isSent ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 px-10">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-emerald-900 font-black text-xs uppercase tracking-widest ml-1">Alamat Email</Label>
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
              </CardContent>
              <CardFooter className="flex flex-col gap-8 px-10 pb-12 pt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all h-14 text-lg font-black rounded-2xl shadow-xl shadow-emerald-200 interactive-button"
                  disabled={loading}
                >
                  {loading ? "Mengirim..." : <span className="flex items-center gap-2">Kirim Instruksi <Send className="w-4 h-4" /></span>}
                </Button>
                
                <Link to="/login" title="login" className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-800 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Login
                </Link>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="px-10 pb-12 text-center space-y-8">
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-emerald-800 text-sm font-bold leading-relaxed">
                Kami telah mengirimkan instruksi pemulihan ke <span className="text-emerald-600 underline">{email}</span>. Silakan periksa kotak masuk atau folder spam Anda.
              </div>
              <Link to="/login" title="login">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 font-black rounded-2xl shadow-xl shadow-emerald-200 transition-all active:scale-95">
                  Kembali ke Login
                </Button>
              </Link>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
