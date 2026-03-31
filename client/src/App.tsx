import { useEffect } from "react"
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"

import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { PublicOnlyRoute } from "@/components/auth/PublicOnlyRoute"
import { FormularioPerfil } from "@/components/FormularioPerfil"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { CrearCuenta } from "@/pages/CrearCuenta"
import { Home } from "@/pages/Home"
import { Explorar } from "@/pages/Explorar"
import { Login } from "@/pages/IniciarSesion"
import { MiPerfil } from "@/pages/MiPerfil"
import { CondicionesUso } from "@/pages/CondicionesUso"
import { ContactoPage } from "@/pages/ContactoPage"
import { ControlParental } from "@/pages/ControlParental"
import { CookiesPage } from "@/pages/CookiesPage"
import { PoliticaPagos } from "@/pages/PoliticaPagos"
import { PoliticaPrivacidad } from "@/pages/PoliticaPrivacidad"

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-zinc-50">
        <SiteHeader />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explorar" element={<Explorar />} />
            <Route path="/mi-perfil" element={<ProtectedRoute><MiPerfil /></ProtectedRoute>} />
            <Route path="/nuevo" element={<ProtectedRoute><FormularioPerfil /></ProtectedRoute>} />
            <Route path="/iniciar-sesion" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/crear-cuenta" element={<PublicOnlyRoute><CrearCuenta /></PublicOnlyRoute>} />
            <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
            <Route path="/condiciones-uso" element={<CondicionesUso />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/politica-pagos" element={<PoliticaPagos />} />
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/control-parental" element={<ControlParental />} />
          </Routes>
        </main>

        <SiteFooter />
      </div>
    </BrowserRouter>
  )
}

export default App