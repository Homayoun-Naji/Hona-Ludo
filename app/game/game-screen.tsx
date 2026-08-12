"use client";

import { BoardSurface } from "@/components/board/BoardSurface";
import { TurnHeader } from "@/components/game/TurnHeader";
import { Dice } from "@/components/dice/Dice";
import { TurnTimer } from "@/components/timer/TurnTimer";
import { GameControls } from "@/components/game/GameControls";
import { Card } from "@/components/ui/card";

/**
 * The game screen shell — reserves areas for the top bar (turn info
 * + timer), the board area, and the bottom bar (dice + undo + end turn).
 *
 * All content is mock/static data. No engine, no socket, no real
 * dice or timer behavior. Exactly ONE die is rendered.
 */
export default function GameScreen() {
  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* Top: turn / player information */}
      <TurnHeader
        playerName="سارا"
        playerColor="red"
        status="انداختن تاس"
        isMyTurn={true}
      />

      {/* Timer */}
      <div className="flex justify-center">
        <TurnTimer remainingMs={45_000} durationMs={120_000} label="نوبت شما" />
      </div>

      {/* Main: board area */}
      <main className="flex-1">
        <BoardSurface
          placeholder={
            <Card className="border-dashed">
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  صفحه بازی SVG در اینجا قرار خواهد گرفت
                </p>
              </div>
            </Card>
          }
          className="border-2 border-dashed"
        />
      </main>

      {/* Bottom: single die + undo + end turn */}
      <footer className="flex flex-col items-center gap-4">
        <Card className="w-full max-w-sm">
          <div className="flex justify-center py-4">
            <Dice state="value" value={5} isCurrentTurn={true} />
          </div>
        </Card>

        <GameControls
          canUndo={true}
          canEndTurn={true}
          processing={false}
          onUndo={() => {}}
          onEndTurn={() => {}}
        />
      </footer>
    </div>
  );
}
