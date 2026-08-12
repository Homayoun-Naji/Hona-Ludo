"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ColorPicker } from "@/components/room/ColorPicker";
import { PlayerList, type PlayerSummary } from "@/components/player/PlayerList";
import { MAX_PLAYERS, MIN_PLAYERS } from "@/constants/game";
import { PLAYER_COLORS, type PlayerColor } from "@/constants/colors";
import { Users, Copy, LogIn } from "lucide-react";

/**
 * Mock static data for Phase 3 — the waiting room renders but is not
 * wired to Socket.IO yet. This file is a client component so
 * ColorPicker state can be demonstrated without a server round-trip.
 *
 * The local player (you) is the host, so the "شروع بازی" button is
 * visible. Other players have chosen red and blue, leaving green,
 * yellow and purple available in the picker.
 */
const LOCAL_PLAYER_ID = "local";

const MOCK_PLAYERS: PlayerSummary[] = [
  {
    id: LOCAL_PLAYER_ID,
    displayName: "شما",
    color: null,
    isHost: true,
    isActive: false,
    status: "online",
    ready: false,
  },
  {
    id: "2",
    displayName: "سارا",
    color: "red",
    isHost: false,
    isActive: false,
    status: "online",
    ready: true,
  },
  {
    id: "3",
    displayName: "علی",
    color: "blue",
    isHost: false,
    isActive: false,
    status: "offline",
    ready: false,
  },
];

export default function WaitingRoomPage() {
  const iAmHost = true;

  // Colors already taken by other players (host has not picked yet).
  const occupants: Partial<Record<PlayerColor, string | null>> = {};
  MOCK_PLAYERS.filter((p) => p.id !== LOCAL_PLAYER_ID).forEach((p) => {
    if (p.color) occupants[p.color] = p.id;
  });

  // Local color state — the host still picks a color like everyone.
  const [selectedColor, setSelectedColor] = useState<PlayerColor | null>(
    null,
  );

  const handleColorSelect = (color: PlayerColor) => {
    setSelectedColor(color);
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Room header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">اتاق بازی</h1>
          <p className="text-sm text-muted-foreground">
            کد اتاق: <span className="font-mono font-medium">ABC-123</span>
          </p>
        </div>
        <Button variant="ghost" size="sm" aria-label="کپی لینک اتاق">
          <Copy aria-hidden />
          <span>اشتراک‌گذاری</span>
        </Button>
      </header>

      {/* Players card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" aria-hidden />
            <span>بازیکنان ({MOCK_PLAYERS.length}/{MAX_PLAYERS})</span>
          </CardTitle>
          <CardDescription>
            {MOCK_PLAYERS.length < MIN_PLAYERS
              ? `نیاز به ${MIN_PLAYERS - MOCK_PLAYERS.length} بازیکن دیگر`
              : "آماده شروع بازی"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlayerList players={MOCK_PLAYERS} />
        </CardContent>
      </Card>

      {/* Color selection — host and non-host both see it */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">انتخاب رنگ شما</CardTitle>
          <CardDescription>
            {iAmHost
              ? "رنگ خود را انتخاب کنید سپس می‌توانید بازی را شروع کنید"
              : "برای شروع، رنگ خود را انتخاب کنید"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ColorPicker
            availableColors={[...PLAYER_COLORS]}
            occupants={occupants}
            selected={selectedColor}
            onSelect={handleColorSelect}
          />
        </CardContent>
      </Card>

      {/* Ready / Start controls */}
      <footer className="flex justify-center pb-2">
        {iAmHost ? (
          <Button
            variant="default"
            size="lg"
            className="w-36"
            disabled={MOCK_PLAYERS.length < MIN_PLAYERS}
            aria-label="شروع بازی"
          >
            <LogIn aria-hidden />
            <span>شروع بازی</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="lg"
            className="w-36"
            disabled={!selectedColor}
            aria-label="آماده‌سازی"
          >
            <span>آماده‌ام</span>
          </Button>
        )}
      </footer>
    </div>
  );
}
