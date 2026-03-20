import { FooterPageLayout } from "@/components/layout/FooterPageLayout"

export function CookiesPage() {
  return (
    <FooterPageLayout
      title="Política de Cookies"
      description="Información sobre el uso de cookies en Erotik Colombia: qué son, para qué las usamos y cómo puedes administrarlas o desactivarlas desde tu navegador."
      canonical="/cookies"
    >
      <p>
        Utilizamos cookies para recordar preferencias, analizar el tráfico del sitio y ofrecer una experiencia
        más rápida y personalizada.
      </p>
      <p>
        Puedes administrar o desactivar las cookies desde la configuración de tu navegador, aunque esto puede
        afectar algunas funcionalidades del sitio.
      </p>
      <p>Al continuar navegando, aceptas el uso de cookies según esta política.</p>
    </FooterPageLayout>
  )
}
