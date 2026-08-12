import { PlayerAvatar } from "@/components/player/PlayerAvatar";
import { PLAYER_COLORS, type PlayerColor } from "@/constants/colors";
import { cn } from "@/lib/utils";

export interface TurnHeaderProps {
  /** Name of the player whose turn it is. */
  playerName: string;
  /** That player's color. */
  playerColor: string | null;
  /** A status line — e.g. "نوبت بازیکن" or dice result. */
  status: string;
  /** Whether this is the local player's turn. */
  isMyTurn?: boolean;
  className?: string;
}

/**
 * Top-of-screen header showing whose turn it is plus a status line.
 *
 * The status line can display dice results, "your turn", "opponent
 * X", etc. Purely presentational.
 */
export function TurnHeader({
  playerName,
  playerColor,
  status,
  isMyTurn = false,
  className,
}: TurnHeaderProps) {
  const color: PlayerColor | null =
    playerColor && PLAYER_COLORS.includes(playerColor as PlayerColor)
      ? (playerColor as PlayerColor)
      : null;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3",
        "rtl:flex-row-reverse",
        className,
      )}
    >
      <span
        className={cn(
          "text-sm font-medium tabular-nums",
          isMyTurn ? "text-primary" : "text-muted-foreground",
        )}
      >
        {status}
      </span>
      <div className="flex items-center gap-2">
        <PlayerAvatar
          displayName={playerName}
          color={color}
          isActive={isMyTurn}
          size="sm"
          className="justify-center"
        />
        <span className="text-sm font-medium text-muted-foreground">
          {isMyTurn ? "نوبت شما" : "نوبت " + playerName}
        </span>
      </div>
    </div>
  );
}
