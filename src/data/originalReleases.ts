export const originalReleases: {slug:string; title:string; year:string; description:string; cover:string; spotify:string; platforms:{label:string;url:string}[]}[] = [
  { slug: "inmyveins", title: "In My Veins", year: "2026", description: "A darker, melodic production built around a deep groove, spoken vocals and slow-burning tension.", cover: "/media/in-my-veins-cover.webp", spotify: "https://open.spotify.com/track/029gRb7QR6Cg1TM2YkroDK", platforms: [] },
  { slug: "wideopen", title: "Wide Open", year: "2026", description: "", cover: "/media/wide-open-cover.webp", spotify: "https://open.spotify.com/track/2HBqKVXN4kkwiRzVGPOAyN", platforms: [] },
  { slug: "blasted", title: "Blasted", year: "2026", description: "", cover: "/media/blasted-cover.webp", spotify: "https://open.spotify.com/track/2sQmYmr3hwOvRKE72Xf9iK", platforms: [] },
  { slug: "amsterdam", title: "Amsterdam", year: "2026", description: "", cover: "/media/amsterdam-cover.webp", spotify: "https://open.spotify.com/track/0j8uHrkVFCDasMD0LwkL5n", platforms: [] },
];
// Add new published releases at the beginning of this list.
export const [latestRelease, ...previousReleases] = originalReleases;
