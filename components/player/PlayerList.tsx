import { PlayerAvatar } from "./PlayerAvatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PlayerSummary {
  id: string;
  displayName: string;
  color: null | "red" | "blue" | "green" | "yellow" | "purple";
  isHost: boolean;
  isActive: boolean;
  status: "online" | "offline" | "eliminated";
  ready: boolean;
}

export interface PlayerListProps {
  players: PlayerSummary[];
  className?: string;
}

/**
 * A vertical list of players for the waiting room. Each row shows
 * the avatar, name, host badge, and connection/ready status.
 *
 * Props-driven; no real-time state is injected.
 */
export function PlayerList({ players, className }: PlayerListProps) {
  if (players.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        هیچ بازیکنی وارد نشده است
      </p>
    );
  }

  return (
    <ul className={cn("flex flex-col gap-2", className)}>
      {players.map((p) => (
        <li
          key={p.id}
          className={cn(
            "flex items-center justify-between",
            "rtl:flex-row-reverse",
            "rounded-lg px-2 py-1.5",
            p.isActive && "bg-accent/50",
            p.status === "eliminated" && "opacity-60",
          )}
        >
          <PlayerMeta player={p} />
          <PlayerAvatar
            displayName={p.displayName}
            color={p.color}
            isActive={p.isActive}
            status={p.status}
            size="md"
          />
        </li>
      ))}
    </ul>
  );
}

function PlayerMeta({ player }: { player: PlayerSummary }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5"
      )}
    >
      {player.isHost && (
        <Badge variant="outline">
          میزبان
        </Badge>
      )}
      {player.status === "eliminated" && (
        <Badge variant="destructive">
          حذف شده
        </Badge>
      )}
      {player.status === "offline" && (
        <Badge variant="muted">
          آفلاین
        </Badge>
      )}
      {!player.isHost &&
        player.status !== "eliminated" &&
        player.status !== "offline" &&
        (player.ready ? (
          <Badge variant="success">
            آماده
          </Badge>
        ) : (
          <Badge variant="muted">
            منتظر
          </Badge>
        ))}
    </div>
  );
}
