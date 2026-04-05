"use client";

import { useEffect, useRef, useState } from "react";

const HOSTED_BUTTON_ID = "BY773FGZ696TY";
const PAYPAL_SDK_URL =
  "https://www.paypal.com/sdk/js?client-id=BAAAEDHKL2HvNP29uT736TPt35iAHqs8-74rzz9u6QVxRBp6F7St8ye2RzQUcQqjD0E8S6_oE1FBZ__pJc&components=hosted-buttons&enable-funding=venmo&currency=USD";

export default function PayPalButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    // If SDK already loaded (e.g. hot reload), render immediately
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).paypal) {
      renderButton();
      return;
    }

    const script = document.createElement("script");
    script.src = PAYPAL_SDK_URL;
    script.async = true;
    script.onload = renderButton;
    script.onerror = () => setStatus("error");
    document.body.appendChild(script);

    return () => {
      // clean up only if component unmounts before load
      if (!script.dataset.loaded) document.body.removeChild(script);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderButton() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paypal = (window as any).paypal;
    if (!paypal || !containerRef.current) return;
    // Avoid double-render
    if (containerRef.current.childElementCount > 0) return;
    try {
      paypal
        .HostedButtons({ hostedButtonId: HOSTED_BUTTON_ID })
        .render(containerRef.current);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={containerRef} className="w-full flex justify-center min-h-[55px]" />
      {status === "loading" && (
        <p className="text-xs text-stone-400 animate-pulse">Loading PayPal…</p>
      )}
      {status === "error" && (
        <p className="text-xs text-red-400">
          Could not load PayPal. Please try refreshing the page.
        </p>
      )}
    </div>
  );
}
