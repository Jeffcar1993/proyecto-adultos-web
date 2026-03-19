import { Link } from "react-router-dom"
import { Search, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-28 max-w-7xl items-center justify-between gap-8 px-6">
        
        {/* LOGO - Escalado para impacto visual */}
        <Link
          to="/"
          className="flex items-center transition-transform hover:scale-105"
          aria-label="Ir al inicio"
        >
          <img
            src="/logo.png"
            alt="Erotik Colombia"
            className="h-16 w-auto object-contain md:h-20 drop-shadow-sm"
          />
        </Link>

        {/* BUSCADOR - Minimalista */}
        <form className="hidden max-w-md flex-1 items-center lg:flex" role="search">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="search"
              placeholder="Buscar ciudad, servicio o perfil..."
              className="h-12 w-full rounded-full border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
        </form>

        {/* ACCIONES */}
        <div className="flex items-center gap-3">
          <Link to="/iniciar-sesion" className="hidden text-sm font-bold text-zinc-600 hover:text-zinc-900 md:block px-4">
            Iniciar Sesión
          </Link>
          
          <Button asChild className="h-12 rounded-full bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700">
            <Link to="/crear-cuenta">Publicar Anuncio</Link>
          </Button>

          <Link to="/iniciar-sesion" className="md:hidden text-zinc-600">
            <UserCircle size={32} />
          </Link>
        </div>
      </div>
    </header>
  )
}