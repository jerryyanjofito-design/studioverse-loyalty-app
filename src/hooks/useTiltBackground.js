import { useEffect } from "react";

const MAX_TILT = 16; // px, how far the background can drift

// Drives --tilt-x/--tilt-y on the document root from device motion (phones)
// or mouse position (desktop, for testing without a sensor).
export function useTiltBackground() {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let targetX = 0, targetY = 0, curX = 0, curY = 0, raf;

    function tick() {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      root.style.setProperty("--tilt-x", `${curX.toFixed(2)}px`);
      root.style.setProperty("--tilt-y", `${curY.toFixed(2)}px`);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    const clamp = (v) => Math.max(-MAX_TILT, Math.min(MAX_TILT, v));

    function onOrientation(e) {
      if (e.beta === null || e.gamma === null) return;
      targetX = clamp((e.gamma / 45) * MAX_TILT);
      targetY = clamp(((e.beta - 90) / 45) * MAX_TILT);
    }

    function onMouseMove(e) {
      targetX = clamp(((e.clientX / window.innerWidth) * 2 - 1) * MAX_TILT);
      targetY = clamp(((e.clientY / window.innerHeight) * 2 - 1) * MAX_TILT);
    }

    let removeOrientation = null;
    function enableOrientation() {
      window.addEventListener("deviceorientation", onOrientation);
      removeOrientation = () => window.removeEventListener("deviceorientation", onOrientation);
    }

    const DOE = window.DeviceOrientationEvent;
    let removeGesture = null;
    if (DOE && typeof DOE.requestPermission === "function") {
      // iOS 13+ requires a user gesture before sensor access can be requested.
      const requestOnGesture = () => {
        DOE.requestPermission().then((state) => {
          if (state === "granted") enableOrientation();
        }).catch(() => {});
      };
      window.addEventListener("click", requestOnGesture, { once: true });
      window.addEventListener("touchend", requestOnGesture, { once: true });
      removeGesture = () => {
        window.removeEventListener("click", requestOnGesture);
        window.removeEventListener("touchend", requestOnGesture);
      };
    } else if (DOE) {
      enableOrientation();
    }

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      removeOrientation?.();
      removeGesture?.();
      root.style.removeProperty("--tilt-x");
      root.style.removeProperty("--tilt-y");
    };
  }, []);
}
