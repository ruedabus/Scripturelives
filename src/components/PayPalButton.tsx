"use client";

import Script from "next/script";
import { useState } from "react";

const HOSTED_BUTTON_ID = "BY773FGZ696TY";
const PAYPAL_SDK_URL =
  "https://www.paypal.com/sdk/js?client-id=BAAAEDHKL2HvNP29uT736TPt35iAHqs8-74rzz9u6QVxRBp6F7St8ye2RzQUcQqjD0E8S6_oE1FBZ__pJc&components=hosted-buttons&enable-funding=venmo&currency=USD";

export default function PayPalButton() {
  const [ready, setReady] = useState(false);

  function initButton() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paypal = (window as any).paypal;
    if (!paypal) return;
    paypal
      .HostedButtons({ hostedButtonId: HOSTED_BUTTON_ID })
      .render(`#paypal-container-${HOSTED_BUTTON_ID}`);
    setReady(true);
  }

  return (
    <>
      <Script src={PAYPAL_SDK_URL} onLoad={initButton} strategy="lazyOnload" />
      <div
        id={`paypal-container-${HOSTED_BUTTON_ID}`}
        className="flex justify-center min-h-[50px]"
      />
      {!ready && (
        <p className="text-xs text-stone-400 text-center mt-2 animate-pulse">
          Loading PayPal…
        </p>
      )}
    </>
  );
}
