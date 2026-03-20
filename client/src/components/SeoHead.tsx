import { Helmet } from "react-helmet-async"

const SITE_NAME = "Erotik Colombia"
const BASE_URL = "https://erotikcolombia.com"

interface SeoHeadProps {
  title: string
  description: string
  canonical?: string
  noIndex?: boolean
  ogImage?: string
}

export function SeoHead({
  title,
  description,
  canonical,
  noIndex = false,
  ogImage = "/logo.png",
}: SeoHeadProps) {
  const fullTitle = `${title} | ${SITE_NAME}`
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={`${BASE_URL}${ogImage}`} />
      <meta property="og:locale" content="es_CO" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}${ogImage}`} />
    </Helmet>
  )
}
