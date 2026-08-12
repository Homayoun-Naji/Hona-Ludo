import { type PlayerColor } from "@/constants/colors";
import { getPlayerColorStyle } from "@/config/player-colors";
import { cn } from "@/lib/utils";

export interface PlayerAvatarProps {
  /** Display name shown alongside the avatar. */
  displayName: string;
  /** Chosen color. May be null during the join handshake. */
  color: PlayerColor | null;
  /** Whether it is currently this player's turn. */
  isActive?: boolean;
  /** Connection / lifecycle metadata. */
  status?: "online" | "offline" | "eliminated";
  /** Size preset. */
  size?: "sm" | "md" | "lg";
  /** Optional additional class. */
  className?: string;
}

const sizeMap = {
  sm: {
    container: "size-8",
    dot: "size-4",
    name: "text-sm",
  },
  md: {
    container: "size-10",
    dot: "size-5",
    name: "text-base",
  },
  lg: {
    container: "size-12",
    dot: "size-6",
    name: "text-lg",
  },
} as const;

/**
 * A presentational player avatar: the player's selected game color
 * displayed as a colored circle, next to the display name.
 *
 * The color circle is the player's visual identity. The Host role
 * is intentionally NOT indicated here — that is the job of the
 * separate Host badge, so the Host does not visually appear to be
 * a "better" or privileged player.
 *
 * Receives all data through props — never imports domain state.
 */
export function PlayerAvatar({
  displayName,
  color,
  isActive = false,
  status = "online",
  size = "md",
  className,
}: PlayerAvatarProps) {
  const style = getPlayerColorStyle(color);
  const s = sizeMap[size];

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        "rtl:flex-row-reverse",
        className,
      )}
    >
      <span className={cn("font-medium text-foreground", s.name)}>
        {displayName}
      </span>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full",
          "border-2 border-transparent bg-muted",
          s.container,
          isActive && "ring-2 ring-primary",
          status === "eliminated" && "grayscale",
        )}
        aria-label={color ? style.label : undefined}
      >
        {color ? (
          <span
            className={cn(
              "block rounded-full",
              status === "offline" && "opacity-40",
            )}
            style={{ backgroundColor: style.hex }}
            data-testid={`player-color-${color}`}
          />
        ) : (
          <span
            className={cn("block rounded-full bg-muted-foreground/40", s.dot)}
          />
        )}
      </div>
    </div>
  );
}
