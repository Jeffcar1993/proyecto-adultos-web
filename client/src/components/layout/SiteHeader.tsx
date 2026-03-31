import { Link } from "react-router-dom"
import { UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchHeader } from "@/components/SearchHeader"
import { useAuth } from "@/context/useAuth"
import { useNavigate } from "react-router-dom"

export function SiteHeader() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

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

        {/* BUSCADOR - Con autocompletado */}
        <SearchHeader />

        {/* ACCIONES */}
        <div className="flex items-center gap-3">
          {!token ? (
            <>
              <Link to="/iniciar-sesion" className="hidden text-sm font-bold text-zinc-600 hover:text-zinc-900 md:block px-4">
                Iniciar Sesión
              </Link>

              <Button asChild className="h-12 rounded-full bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700">
                <Link to="/crear-cuenta">Crear Cuenta</Link>
              </Button>

              <Link to="/iniciar-sesion" className="md:hidden text-zinc-600">
                <UserCircle size={32} />
              </Link>
            </>
          ) : (
            <>
              <Button asChild className="hidden h-12 rounded-full bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 md:inline-flex">
                <Link to="/mi-perfil">Mi Perfil</Link>
              </Button>

              <Button onClick={handleLogout} className="h-12 rounded-full bg-red-600 px-6 text-sm font-bold text-white hover:bg-red-700">
                Cerrar Sesión
              </Button>

              <Link to="/mi-perfil" className="md:hidden text-zinc-600">
                <UserCircle size={32} />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}