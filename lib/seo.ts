/** Shared Open Graph / Twitter defaults so per-route metadata does not drop root images. */

export const SITE_NAME = "Good'Ai";
export const OG_LOCALE = "en_AU";
export const OG_IMAGE = {
  url: "/brand/coastal-phone.webp",
  width: 1536,
  height: 1024,
  alt: "Good'Ai — Good work. More life.",
} as const;

export const ogDefaults = {
  siteName: SITE_NAME,
  locale: OG_LOCALE,
  type: "website" as const,
  images: [OG_IMAGE],
};

export const twitterDefaults = {
  card: "summary_large_image" as const,
  images: [OG_IMAGE.url],
};
