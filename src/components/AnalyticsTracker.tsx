import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = "G-MFXSXKR8EV";

/**
 * Sends a GA4 page_view on every client-side route change.
 * Must be rendered inside <BrowserRouter>.
 */
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    const page_path = location.pathname + location.search + location.hash;
    window.gtag("event", "page_view", {
      page_path,
      page_location: window.location.href,
      page_title: document.title,
      send_to: GA_ID,
    });
  }, [location]);

  return null;
};

export default AnalyticsTracker;
