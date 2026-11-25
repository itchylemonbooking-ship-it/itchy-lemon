/** Verified radio support records. Add future stations here; do not infer reach or time zones. */
export type RadioSupportRecord = {
  slug: string;
  station: string;
  programme: string;
  year: string;
  summary: string;
  originals: string[];
  playHistory: { date: string; tracks: { time: string; title: string }[]; image: string; alt: string }[];
  externalHistory: string;
};

export const radioSupport: RadioSupportRecord[] = [
  {
    slug: "pinnacle-nexus-radio",
    station: "Pinnacle Nexus Radio",
    programme: "World Groove",
    year: "2026",
    summary: "Four Itchy Lemon originals documented in TuneYou's play history on 19 and 24 November 2026.",
    originals: ["Amsterdam", "Blasted", "In My Veins", "Wide Open"],
    playHistory: [
      {
        date: "24 November 2026",
        image: "/media/radio/pinnacle-tuneyou-2026-11-24.png",
        alt: "Original TuneYou play-history screenshot for 24 November 2026, showing four Itchy Lemon tracks.",
        tracks: [
          { time: "17:31", title: "Amsterdam" },
          { time: "17:38", title: "Blasted" },
          { time: "17:43", title: "In My Veins (Original Mix)" },
          { time: "17:51", title: "Wide Open" }
        ]
      },
      {
        date: "19 November 2026",
        image: "/media/radio/pinnacle-tuneyou-2026-11-19.png",
        alt: "Original TuneYou play-history screenshot for 19 November 2026, showing three Itchy Lemon tracks.",
        tracks: [
          { time: "17:45", title: "Amsterdam" },
          { time: "17:51", title: "Blasted" },
          { time: "17:57", title: "In My Veins (Original Mix)" }
        ]
      }
    ],
    externalHistory: "https://tuneyou.com/intl/es/radio/es/pinnacle-nexus-radio"
  }
];
