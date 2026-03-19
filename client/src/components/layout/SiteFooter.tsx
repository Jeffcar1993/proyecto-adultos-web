import { Link } from "react-router-dom"

const footerLinks = [
  { label: "Política de privacidad", to: "/politica-privacidad" },
  { label: "Condiciones de uso", to: "/condiciones-uso" },
  { label: "Cookies", to: "/cookies" },
  { label: "Política de pagos", to: "/politica-pagos" },
  { label: "Contacto", to: "/contacto" },
  { label: "Control parental", to: "/control-parental" },
]

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-zinc-200 bg-zinc-50 text-zinc-600">
      <div className="mx-auto max-w-7xl px-6 py-16">
        
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Sección de Marca */}
          <div className="lg:col-span-5 space-y-8">
            <Link to="/" className="inline-block">
              <img
                src="/logo.png"
                alt="Erotik"
                className="h-24 w-auto object-contain"
              />
            </Link>
            
            <div className="space-y-4">
              <h3 className="text-sm font-black text-zinc-800 uppercase tracking-widest">
                Plataforma +18 Verificada
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-zinc-500">
                La red de anuncios más segura y discreta de Colombia. Verificamos cada perfil manualmente para tu tranquilidad.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase text-red-600 border border-red-100">
                Solo Adultos
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase text-blue-600 border border-blue-100">
                Privacidad Garantizada
              </span>
            </div>
          </div>

          {/* Enlaces */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-8">
            <div className="space-y-5">
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.slice(0, 3).map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm font-medium hover:text-blue-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-5">
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Soporte</h4>
              <ul className="space-y-3">
                {footerLinks.slice(3).map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm font-medium hover:text-blue-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p>© {currentYear} EROTIK COLOMBIA</p>
            <span className="hidden md:inline text-zinc-300">|</span>
            <p>Contenido para adultos</p>
          </div>
          <div className="flex items-center gap-6">
            <p>Diseño Gráfico Digital</p>
            <p className="text-red-600/50">Verified by Red-Safe</p>
          </div>
        </div>
      </div>
    </footer>
  )
}