import ProductDetailPage from "./ProductClient";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sparkinnovations.com";

async function getProduct(slug) {
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const title = `${product.name} — Price ₹${product.price?.toLocaleString("en-IN")} | Buy Online`;
  const description = product.description
    ? `${product.description.substring(0, 150)}. Buy genuine ${product.name} at best price with free installation & Kutchina warranty.`
    : `Buy ${product.name} at best price. Genuine Kutchina product with official warranty & free installation.`;
  const image = product.images?.[0] || "/og-image.jpg";

  return {
    title,
    description,
    keywords: [
      product.name,
      `${product.name} price`,
      `buy ${product.name}`,
      product.category?.replace(/-/g, " "),
      "Kutchina",
      "kitchen appliance",
    ].filter(Boolean),
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title,
      description,
      url: `/products/${slug}`,
      type: "website",
      images: [{ url: image, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  // Product JSON-LD Schema
  const productJsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.images || [],
        url: `${SITE_URL}/products/${slug}`,
        brand: { "@type": "Brand", name: "Kutchina" },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "INR",
          availability: product.inStock !== false
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: "Spark Innovations" },
          url: `${SITE_URL}/products/${slug}`,
        },
        ...(product.specs?.length && {
          additionalProperty: product.specs.map((s) => ({
            "@type": "PropertyValue",
            name: s.label,
            value: s.value,
          })),
        }),
      }
    : null;

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_URL}/products` },
      ...(product
        ? [{ "@type": "ListItem", position: 3, name: product.name, item: `${SITE_URL}/products/${slug}` }]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <ProductDetailPage params={params} />
    </>
  );
}
