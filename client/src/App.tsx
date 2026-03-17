import { BrowserRouter, Route, Routes } from "react-router-dom"

import { FormularioPerfil } from "@/components/FormularioPerfil"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { CrearCuenta } from "@/pages/CrearCuenta"
import { Home } from "@/pages/Home"
import { IniciarSesion } from "@/pages/IniciarSesion"
import { CondicionesUso } from "@/pages/CondicionesUso"
import { ContactoPage } from "@/pages/ContactoPage"
import { ControlParental } from "@/pages/ControlParental"
import { CookiesPage } from "@/pages/CookiesPage"
import { PoliticaPagos } from "@/pages/PoliticaPagos"
import { PoliticaPrivacidad } from "@/pages/PoliticaPrivacidad"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-50">
        <SiteHeader />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nuevo" element={<FormularioPerfil />} />
            <Route path="/iniciar-sesion" element={<IniciarSesion />} />
            <Route path="/crear-cuenta" element={<CrearCuenta />} />
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