import { Link } from "react-router-dom"
import { LogIn, LogOut, UserCircle, UserPlus, Coins, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchHeader } from "@/components/SearchHeader"
import { useAuth } from "@/context/useAuth"
import { useNavigate } from "react-router-dom"

export function SiteHeader() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()

  const mobileActionBaseClass =
    "md:hidden inline-flex h-10 items-center justify-center gap-2 rounded-full px-3 text-xs font-semibold tracking-tight transition-colors"

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 md:px-6">

        {/* FILA PRINCIPAL: Logo + Búsqueda (desktop) + Acciones */}
        <div className="flex h-16 items-center justify-between gap-3 md:h-20 md:gap-6">

          {/* LOGO */}
          <Link
            to="/"
            className="flex shrink-0 items-center transition-transform hover:scale-105"
            aria-label="Ir al inicio"
          >
            <img
              src="/logo.png"
              alt="Erotik Colombia"
              className="h-10 w-auto object-contain md:h-14 drop-shadow-sm"
            />
          </Link>

          {/* BUSCADOR - solo desktop (md+) */}
          <div className="hidden md:flex flex-1 max-w-lg">
            <SearchHeader className="flex w-full items-center relative" />
          </div>

          {/* ACCIONES */}
          <div className="flex shrink-0 items-center gap-2">
            {!token ? (
              <>
                {/* Desktop */}
                <Link
                  to="/iniciar-sesion"
                  className="hidden text-sm font-bold text-zinc-600 hover:text-zinc-900 lg:block px-3"
                >
                  Iniciar Sesión
                </Link>
                <Button
                  asChild
                  className="hidden h-10 rounded-full bg-blue-600 px-5 text-sm font-bold text-white shadow-md shadow-blue-200 hover:bg-blue-700 md:inline-flex"
                >
                  <Link to="/crear-cuenta">Crear Cuenta</Link>
                </Button>

                {/* Móvil */}
                <Link
                  to="/iniciar-sesion"
                  className={`${mobileActionBaseClass} border border-zinc-200 text-zinc-700 hover:bg-zinc-50`}
                  aria-label="Iniciar sesión"
                >
                  <LogIn size={15} />
                  <span>Ingresar</span>
                </Link>
                <Link
                  to="/crear-cuenta"
                  className={`${mobileActionBaseClass} bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700`}
                  aria-label="Crear cuenta"
                >
                  <UserPlus size={15} />
                  <span>Crear cuenta</span>
                </Link>
              </>
            ) : (
              <>
                {/* Desktop */}
                {user?.is_admin && (
                  <Button
                    asChild
                    variant="outline"
                    className="hidden h-10 rounded-full border-amber-300 px-4 text-sm font-bold text-amber-600 hover:bg-amber-50 md:inline-flex"
                  >
                    <Link to="/admin/ordenes"><ShieldCheck size={15} className="mr-1.5" />Admin</Link>
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  className="hidden h-10 rounded-full border-zinc-200 px-4 text-sm font-bold text-zinc-700 hover:bg-zinc-50 md:inline-flex"
                >
                  <Link to="/billetera"><Coins size={15} className="mr-1.5" />Billetera</Link>
                </Button>
                <Button
                  asChild
                  className="hidden h-10 rounded-full bg-blue-600 px-5 text-sm font-bold text-white shadow-md shadow-blue-200 hover:bg-blue-700 md:inline-flex"
                >
                  <Link to="/mi-perfil">Mi Perfil</Link>
                </Button>
                <Button
                  onClick={handleLogout}
                  className="hidden h-10 rounded-full bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700 md:inline-flex"
                >
                  Cerrar Sesión
                </Button>

                {/* Móvil */}
                {user?.is_admin && (
                  <Link
                    to="/admin/ordenes"
                    className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-amber-300 text-amber-600 hover:bg-amber-50"
                    aria-label="Admin"
                  >
                    <ShieldCheck size={18} />
                  </Link>
                )}
                <Link
                  to="/billetera"
                  className={`${mobileActionBaseClass} h-11 px-4 text-sm border border-zinc-200 text-zinc-700 hover:bg-zinc-50`}
                  aria-label="Billetera"
                >
                  <Coins size={16} />
                  <span>Billetera</span>
                </Link>
                <Link
                  to="/mi-perfil"
                  className={`${mobileActionBaseClass} h-11 px-4 text-sm bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700`}
                  aria-label="Mi perfil"
                >
                  <UserCircle size={16} />
                  <span>Mi perfil</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* BARRA DE BÚSQUEDA MÓVIL - debajo de la fila principal */}
        <div className="pb-3 md:hidden">
          <SearchHeader className="flex w-full items-center relative" />
        </div>

      </div>
    </header>
  )
}