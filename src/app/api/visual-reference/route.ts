import { NextRequest, NextResponse } from "next/server";

export type VisualReference = {
  title: string;
  description: string;
  thumbnail: string | null;
  wikipediaUrl: string;
  additionalImages: { src: string; caption: string }[];
};

// Biblical disambiguation hints — helps Wikipedia find the right article
const DISAMBIGUATION_HINTS: Record<string, string> = {
  tabernacle: "Tabernacle_(Judaism)",
  ark: "Ark_of_the_Covenant",
  "ark of the covenant": "Ark_of_the_Covenant",
  temple: "Temple_in_Jerusalem",
  "temple of solomon": "Solomon's_Temple",
  "solomon's temple": "Solomon's_Temple",
  menorah: "Temple_menorah",
  passover: "Passover",
  sabbath: "Shabbat",
  covenant: "Covenant_(biblical)",
  "burning bush": "Burning_bush",
  "golden calf": "Golden_calf",
  manna: "Manna",
  "sea of galilee": "Sea_of_Galilee",
  "dead sea": "Dead_Sea",
  "jordan river": "Jordan_River",
  "mount sinai": "Mount_Sinai",
  "mount of olives": "Mount_of_Olives",
  calvary: "Calvary",
  golgotha: "Calvary",
  "garden of gethsemane": "Garden_of_Gethsemane",
  "garden of eden": "Garden_of_Eden",
  "tower of babel": "Tower_of_Babel",
  "noah's ark": "Noah's_Ark",
  "ten commandments": "Ten_Commandments",
  "high priest": "High_Priest_of_Israel",
  "holy of holies": "Holy_of_Holies",
  "bronze serpent": "Nehushtan",
  nehushtan: "Nehushtan",
  levite: "Levite",
  pharisee: "Pharisees",
  sadducee: "Sadducees",
  synagogue: "Synagogue",
  sanhedrin: "Sanhedrin",
  crucifixion: "Crucifixion_of_Jesus",
  resurrection: "Resurrection_of_Jesus",
  baptism: "Baptism_of_Jesus",
  "last supper": "Last_Supper",
  pentecost: "Pentecost",
  "holy spirit": "Holy_Spirit_in_Christianity",
  // People
  moses: "Moses",
  abraham: "Abraham",
  david: "David",
  solomon: "Solomon",
  elijah: "Elijah",
  daniel: "Daniel",
  noah: "Noah",
  joseph: "Joseph_(Genesis)",
  "john the baptist": "John_the_Baptist",
  mary: "Mary,_mother_of_Jesus",
  paul: "Paul_the_Apostle",
  peter: "Saint_Peter",
  "mary magdalene": "Mary_Magdalene",
  herod: "Herod_the_Great",
  nebuchadnezzar: "Nebuchadnezzar_II",
  cyrus: "Cyrus_the_Great",
  pilate: "Pontius_Pilate",
};

async function fetchWikipediaSummary(title: string): Promise<VisualReference | null> {
  const encoded = encodeURIComponent(title.replace(/ /g, "_"));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "ScriptureAlive/1.0 (educational Bible study app)" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (data.type === "disambiguation") return null;

  return {
    title: data.title ?? title,
    description: data.extract ?? "",
    thumbnail: data.thumbnail?.source ?? null,
    wikipediaUrl: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encoded}`,
    additionalImages: [],
  };
}

async function searchWikipedia(query: string): Promise<string | null> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + " Bible biblical")}&srlimit=3&format=json&origin=*`;

  const res = await fetch(url, {
    headers: { "User-Agent": "ScriptureAlive/1.0" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;

  const data = await res.json();
  const hits = data?.query?.search ?? [];
  if (hits.length === 0) return null;

  return hits[0].title as string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  if (!q || q.length < 2) {
    return NextResponse.json({ result: null });
  }

  // Check disambiguation hints first
  const hintKey = Object.keys(DISAMBIGUATION_HINTS).find(
    (k) => q === k || q.includes(k) || k.includes(q)
  );
  const preferredTitle = hintKey ? DISAMBIGUATION_HINTS[hintKey] : null;

  // Try preferred title first
  if (preferredTitle) {
    const result = await fetchWikipediaSummary(preferredTitle);
    if (result) return NextResponse.json({ result });
  }

  // Try direct lookup
  const directResult = await fetchWikipediaSummary(q);
  if (directResult) return NextResponse.json({ result: directResult });

  // Fall back to Wikipedia search
  const searchTitle = await searchWikipedia(q);
  if (searchTitle) {
    const searchResult = await fetchWikipediaSummary(searchTitle);
    if (searchResult) return NextResponse.json({ result: searchResult });
  }

  return NextResponse.json({ result: null });
}
