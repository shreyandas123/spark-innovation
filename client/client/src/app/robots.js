export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sparkinnovations.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/me", "/checkout", "/cart", "/wishlist", "/auth", "/orders", "/api"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
