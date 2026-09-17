export default function ScriptureTimelineBanner() {
  return (
    <div
      className="w-full overflow-hidden shrink-0 sticky top-[52px] md:top-[56px] z-40"
      style={{ borderBottom: "1px solid rgba(201,149,42,0.25)", background: "#0a1120" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/banner_enhancement2.png"
        alt="Scripture Lives — the story of Scripture from Creation to the New Jerusalem: Creation, Noah's Ark, the Red Sea, King David, Bethlehem, Jesus' Ministry, the Cross, the Empty Tomb, and the New Jerusalem"
        className="w-full block"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </div>
  );
}
