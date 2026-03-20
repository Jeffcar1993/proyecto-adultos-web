import { FooterPageLayout } from "@/components/layout/FooterPageLayout"

export function PoliticaPrivacidad() {
  return (
    <FooterPageLayout
      title="Política de Privacidad"
      description="Conoce cómo Erotik Colombia protege y gestiona tu información personal. Aplicamos medidas técnicas y administrativas para garantizar tu privacidad y seguridad."
      canonical="/politica-privacidad"
    >
      <p>
        Protegemos la información personal de nuestros usuarios y aplicamos medidas técnicas y administrativas
        para su seguridad.
      </p>
      <p>
        Recopilamos únicamente los datos necesarios para operar la plataforma, mejorar la experiencia del usuario
        y ofrecer soporte. No comercializamos información sensible sin consentimiento expreso.
      </p>
      <p>
        Puedes solicitar la actualización o eliminación de tus datos en cualquier momento escribiendo a nuestro
        canal de contacto oficial.
      </p>
    </FooterPageLayout>
  )
}
