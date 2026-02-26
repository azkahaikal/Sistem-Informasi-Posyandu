import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { HeartPulse, Mail, ArrowLeft } from "lucide-react"
import ParticleBackground from "@/components/ui/particle-background"

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
          <div className="mx-auto bg-green-500 p-4 rounded-2xl shadow-lg shadow-green-200">
            <HeartPulse className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-extrabold tracking-tight text-green-900 font-serif">
              Lupa Password
            </CardTitle>
            <CardDescription className="text-green-600 font-medium">
              Masukkan email Anda untuk reset password
            </CardDescription>
          </div>
        </CardHeader>
        
        {!isSent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 px-8">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-800 font-semibold text-sm">Alamat Email</Label>
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
            </CardContent>
            <CardFooter className="flex flex-col gap-6 px-8 pb-10 pt-4 mt-4">
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 active:scale-95 transition-all py-6 text-lg font-bold rounded-xl shadow-lg shadow-green-200"
                disabled={loading}
              >
                {loading ? "Mengirim..." : "Kirim Instruksi"}
              </Button>
              
              <Link to="/login" title="login" className="flex items-center gap-2 text-sm text-green-700 hover:text-green-900 hover:underline">
                <ArrowLeft className="w-4 h-4" /> Kembali ke Login
              </Link>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="px-8 pb-10 text-center space-y-4">
            <div className="bg-green-50 p-4 rounded-xl text-green-800 text-sm font-medium">
              Link reset password telah dikirim ke email <strong>{email}</strong>. Silakan cek kotak masuk Anda.
            </div>
            <Link to="/login" title="login">
              <Button className="w-full bg-green-600 hover:bg-green-700 py-6 font-bold rounded-xl">
                Selesai
              </Button>
            </Link>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
