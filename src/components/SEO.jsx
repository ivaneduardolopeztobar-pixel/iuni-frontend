import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, url, image }) {
  const siteName = "iUNI - Empleo Estudiantil";
  const fullTitle = title ? title + " | " + siteName : siteName;
  const defaultDesc = "Plataforma de empleo para estudiantes universitarios de El Salvador. Encuentra tu primer empleo profesional.";
  const desc = description || defaultDesc;
  const defaultImage = "/icon-512.png";
  const img = image || defaultImage;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Spanish" />
      <meta name="author" content="iUNI" />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={img} />
      <meta property="og:locale" content="es_SV" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      {/* Canonical */}
      {url && <link rel="canonical" href={url} />}
    </Helmet>
  );
}
