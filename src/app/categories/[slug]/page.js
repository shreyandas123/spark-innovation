import CategoryDetailPage from "./CategoryClient";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sparkinnovations.com";

async function getCategory(slug) {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.categories?.find((c) => c.slug === slug) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  const name = category?.name || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const title = `${name} — Buy Kutchina ${name} Online at Best Prices`;
  const description = category?.description
    ? `${category.description}. Shop genuine Kutchina ${name.toLowerCase()} at best prices with free installation & official warranty from Spark Innovations.`
    : `Explore our range of premium Kutchina ${name.toLowerCase()}. Best prices, free installation & official warranty. Shop now at Spark Innovations.`;

  return {
    title,
    description,
    keywords: [name, `Kutchina ${name.toLowerCase()}`, `buy ${name.toLowerCase()}`, `${name.toLowerCase()} price`, "kitchen appliances", "Kutchina"],
    alternates: { canonical: `/categories/${slug}` },
    openGraph: {
      title,
      description,
      url: `/categories/${slug}`,
      images: category?.image ? [{ url: category.image, width: 800, height: 600, alt: name }] : undefined,
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Categories", item: `${SITE_URL}/categories` },
      { "@type": "ListItem", position: 3, name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), item: `${SITE_URL}/categories/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryDetailPage params={params} />
    </>
  );
}
