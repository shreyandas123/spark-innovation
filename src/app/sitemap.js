const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sparkinnovations.com";

async function fetchAllProducts() {
  try {
    const res = await fetch(`${API_URL}/api/products?limit=500`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

async function fetchAllCategories() {
  try {
    const res = await fetch(`${API_URL}/api/categories`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || [];
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const [products, categories] = await Promise.all([
    fetchAllProducts(),
    fetchAllCategories(),
  ]);

  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/inquiry`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/jobs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryPages = categories.map((category) => ({
    url: `${SITE_URL}/categories/${category.slug}`,
    lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
