export default function ScriptureTimelineBanner() {
  return (
    <div
      className="w-full overflow-hidden shrink-0"
      style={{ borderBottom: "1px solid rgba(201,149,42,0.25)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/banner_enhancement.png"
        alt="The story of Scripture, from Creation to the Eternal Kingdom: Creation, The Fall, Noah and His Ark, Moses and the Law, Prophets, Bethlehem and the Manger, Jesus' Ministry and Miracles, The Cross and Resurrection, The Church Age, The Eternal Kingdom"
        className="w-full block"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </div>
  );
}
