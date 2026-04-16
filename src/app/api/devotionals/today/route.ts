import { NextResponse } from "next/server";
import { DEVOTIONALS } from "@/data/devotionals";

export async function GET() {
  const todayIndex = new Date().getDate() % DEVOTIONALS.length;
  const devotional = DEVOTIONALS[todayIndex];

  return NextResponse.json({
    title: devotional.title,
    verse: devotional.verse,
    reference: devotional.reference,
    reflection: devotional.reflection,
    prayer: devotional.prayer,
    url: "https://www.scripturelives.com"
  });
}