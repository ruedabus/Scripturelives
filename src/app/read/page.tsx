import { Suspense } from "react";
import BibleReader from "@/components/BibleReader";

export default function ReadPage() {
  return (
    <Suspense fallback={null}>
      <BibleReader />
    </Suspense>
  );
}
