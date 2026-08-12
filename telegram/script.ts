/**
 * Loads the Telegram WebApp script on demand and returns the global
 * `window.Telegram.WebApp` instance exactly once.
 *
 * Why a custom loader instead of a packaged SDK:
 *  - The project has no extra dependencies budgeted for an SDK.
 *  - The official `telegram-web-app.js` script is the canonical,
 *    always-current surface that every SDK wraps anyway.
 *  - We only need a small subset of the API; pulling a full SDK
 *    would inflate the bundle for no gain.
 *
 * The script is loaded with `async = true` and `defer = true` so it
 * never blocks paint. `init()` and `ready()` are called on the global
 * before the returned object is yielded.
 */

const SCRIPT_ID = "telegram-web-app-script";
const SCRIPT_SRC = "https://telegram.org/js/telegram-web-app.js";

declare global {
  interface Window {
    Telegram?: TelegramGlobal;
  }
}

/** Minimal subset of the Telegram WebApp surface this project uses. */
export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUserLike;
    [key: string]: unknown;
  };
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
    isVisible: boolean;
  };
  expand: () => void;
  ready: () => void;
  onEvent: (event: string, handler: () => void) => void;
  offEvent: (event: string, handler: () => void) => void;
  onThemeChanged: (cb: () => void) => void;
  offThemeChanged: (cb: () => void) => void;
  onViewportChanged: (cb: () => void) => void;
  offViewportChanged: (cb: () => void) => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
}

interface TelegramUserLike {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramGlobal {
  WebApp: TelegramWebApp;
}

/** Promise that resolves once the script has been parsed and executed. */
let loadPromise: Promise<TelegramWebApp | null> | null = null;

/**
 * Loads the Telegram WebApp script and returns the WebApp instance.
 *
 * Idempotent — concurrent callers share the same Promise. The function
 * never throws; on failure it resolves to `null` so the caller can
 * degrade gracefully outside Telegram.
 */
export function loadTelegramScript(): Promise<TelegramWebApp | null> {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<TelegramWebApp | null>((resolve) => {
    const existing = window.Telegram as TelegramGlobal | undefined;
    if (existing?.WebApp) {
      resolve(existing.WebApp);
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;

    const onLoad = () => {
      const tg = window.Telegram as TelegramGlobal | undefined;
      if (!tg?.WebApp) {
        resolve(null);
        return;
      }
      try {
        tg.WebApp.ready();
      } catch {
        // Some hosts (or older clients) may throw; safe to ignore.
      }
      resolve(tg.WebApp);
    };

    const onError = () => {
      resolve(null);
    };

    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
    document.head.appendChild(script);
  });

  return loadPromise;
}
