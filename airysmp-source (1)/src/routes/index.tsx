import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import airyLogo from "@/assets/airy-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AirySMP — The Freshest Minecraft SMP" },
      {
        name: "description",
        content:
          "Join AirySMP — the freshest Minecraft SMP experience. Grab ranks, keys, and exclusive cosmetics in the official store.",
      },
      { property: "og:title", content: "AirySMP — The Freshest Minecraft SMP" },
      {
        property: "og:description",
        content: "Ranks, keys, and cosmetics for the AirySMP Minecraft server.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Lilita+One&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

const SERVER_IP = "Airysmp.net";
const SERVER_PORT = "19132";
const STORE_URL = "https://store.airysmp.net";
const DISCORD_URL = "https://discord.gg/usDHbvAh5K";

const NAV_LINKS = [
  { label: "Ranks", href: STORE_URL },
  { label: "Keys", href: STORE_URL },
  { label: "Store", href: STORE_URL },
  { label: "Community", href: DISCORD_URL },
];

interface ServerStatus {
  online: boolean;
  players: number;
  max: number;
}

function Index() {
  const [copied, setCopied] = useState<string | null>(null);
  const [status, setStatus] = useState<ServerStatus | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchStatus = async () => {
      try {
        // Try Bedrock first (port 19132), fall back to Java
        const endpoints = [
          `https://api.mcsrvstat.us/bedrock/3/${SERVER_IP}`,
          `https://api.mcsrvstat.us/3/${SERVER_IP}`,
        ];
        for (const url of endpoints) {
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await res.json();
          if (data?.online) {
            if (!cancelled) {
              setStatus({
                online: true,
                players: data.players?.online ?? 0,
                max: data.players?.max ?? 0,
              });
            }
            return;
          }
        }
        if (!cancelled) setStatus({ online: false, players: 0, max: 0 });
      } catch {
        if (!cancelled) setStatus((s) => s ?? { online: false, players: 0, max: 0 });
      }
    };

    fetchStatus();
    const id = setInterval(fetchStatus, 10_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href="#" className="flex items-center">
          <img src={airyLogo.url} alt="AirySMP" className="h-10 w-auto" />
        </a>
        <button
          onClick={() => copy(SERVER_IP, "nav")}
          className="rounded-full bg-gradient-to-r from-primary to-primary-glow px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 glow-primary"
        >
          {copied === "nav" ? "Copied!" : "Copy IP"}
        </button>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-10">
        <div
          className="absolute inset-0 -z-10 rounded-3xl"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold tracking-widest text-primary-glow">
              <span
                className={`size-2 animate-pulse rounded-full shadow-[0_0_10px_currentColor] ${
                  status?.online === false ? "bg-destructive text-destructive" : "bg-primary-glow"
                }`}
              />
              {status?.online === false ? "SERVERS OFFLINE" : "SERVERS ONLINE"}
            </div>
            <h1 className="mt-6 text-6xl leading-[0.95] md:text-7xl">
              <span className="text-foreground">WELCOME TO</span>
              <br />
              <span className="text-gradient-primary">AIRYSMP</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground">
              The freshest Minecraft SMP experience. Grab ranks, keys and exclusive cosmetics in the official store.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => copy(SERVER_IP, "ip")}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <Copy className="size-4" /> {copied === "ip" ? "Copied!" : SERVER_IP}
              </button>
              <button
                onClick={() => copy(SERVER_PORT, "port")}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <Copy className="size-4" /> {copied === "port" ? "Copied!" : `Port ${SERVER_PORT}`}
              </button>
            </div>

            <div className="mt-10 flex gap-10">
              <Stat
                label="PLAYERS"
                value={status ? String(status.players) : "—"}
              />
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className="transition-transform hover:scale-105"
              >
                <Stat label="DISCORD" value="75+" />
              </a>
              <Stat label="UPTIME" value={status?.online === false ? "OFF" : "24/7"} />
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 -z-10 rounded-full bg-primary/30 blur-3xl" />
            <img
              src={airyLogo.url}
              alt="AirySMP logo"
              className="w-full max-w-sm animate-float drop-shadow-[0_20px_40px_oklch(0.2_0.1_240/0.6)]"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 text-center text-sm text-muted-foreground">
          <img src={airyLogo.url} alt="AirySMP" className="h-12 w-auto opacity-90" />
          <p>© {new Date().getFullYear()} AirySMP. Not affiliated with Mojang or Microsoft.</p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-3xl text-foreground">{value}</div>
      <div className="mt-1 text-xs font-semibold tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
