"use client";

const DONATE_URL =
  "https://www.paypal.com/donate?business=info%40scripturelives.com&item_name=Scripture+Lives+Ministry+Support&currency_code=USD";

export default function PayPalButton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <a
        href={DONATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 rounded-xl bg-[#0070BA] px-8 py-3.5 text-base font-bold text-white hover:bg-[#005ea6] transition"
      >
        {/* PayPal logo mark */}
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c1.379 3.443-.517 6.964-5.14 6.964h-3.532L10.3 21.337h3.836c.524 0 .97-.382 1.051-.9l.043-.258 1.005-6.37.065-.351c.081-.518.527-.9 1.051-.9h.66c4.3 0 7.663-1.747 8.647-6.797.407-2.087.024-3.83-1.436-4.844z"/>
        </svg>
        Donate with PayPal
      </a>
      <p className="text-xs text-stone-400">
        You will be taken to PayPal&apos;s secure site to complete your gift.
      </p>
    </div>
  );
}
