import { Link } from "react-router-dom"

const footerLinks = [
  { label: "Politica de privacidad", to: "/politica-privacidad" },
  { label: "Condiciones de uso", to: "/condiciones-uso" },
  { label: "Cookies", to: "/cookies" },
  { label: "Politica de pagos", to: "/politica-pagos" },
  { label: "Contacto", to: "/contacto" },
  { label: "Control parental", to: "/control-parental" },
]

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10">
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-zinc-700">
          {footerLinks.map((link) => (
            <Link key={link.to} to={link.to} className="transition hover:text-zinc-900">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-1 text-sm text-zinc-600">
          <p>Pagina de contenido para adultos. Todos los derechos reservados.</p>
          <p>Diseno Grafico Digital</p>
          <p>© Copyright 2024</p>
        </div>
      </div>
    </footer>
  )
}
