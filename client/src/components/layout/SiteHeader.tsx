import { Link } from "react-router-dom"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-4 px-4 py-4 md:grid-cols-[auto,1fr,auto]">
        <div className="order-2 flex items-center gap-2 md:order-1">
          <Button asChild variant="outline" className="rounded-full px-5">
            <Link to="/iniciar-sesion">Iniciar sesion</Link>
          </Button>
          <Button asChild className="rounded-full px-5">
            <Link to="/crear-cuenta">Crear cuenta</Link>
          </Button>
        </div>

        <form className="order-1 mx-auto flex w-full max-w-2xl items-center gap-2 md:order-2" role="search">
          <Input
            type="search"
            aria-label="Buscar"
            placeholder="Buscar ciudad, servicio o perfil..."
            className="h-11 rounded-full border-zinc-300"
          />
          <Button type="submit" size="icon" className="h-11 w-11 rounded-full" aria-label="Buscar">
            <Search className="h-5 w-5" />
          </Button>
        </form>

        <Link
          to="/"
          className="order-3 ml-auto inline-flex items-center gap-3 rounded-full border border-zinc-200 px-4 py-2 transition hover:border-zinc-400"
          aria-label="Ir al inicio"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white">
            EC
          </span>
          <span className="text-sm font-semibold tracking-wide text-zinc-900">EROTIK COLOMBIA</span>
        </Link>
      </div>
    </header>
  )
}
