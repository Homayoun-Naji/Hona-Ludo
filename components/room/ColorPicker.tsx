import { PLAYER_COLORS, type PlayerColor } from "@/constants/colors";
import { getPlayerColorStyle } from "@/config/player-colors";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface ColorPickerProps {
  /** All colors available for selection (from room settings). */
  availableColors: PlayerColor[];
  /**
   * Map of color -> player id currently holding that color, or null.
   * Colors with a non-null owner are disabled.
   */
  occupants: Partial<Record<PlayerColor, string | null>>;
  /** The color currently selected by this client. */
  selected?: PlayerColor | null;
  /**
   * Called when the user selects a color.
   * Disabled colors never invoke this.
   */
  onSelect: (color: PlayerColor) => void;
  /** Whether selection is currently locked (e.g. game started). */
  disabled?: boolean;
  className?: string;
}

/**
 * Reusable, touch-friendly color selection grid.
 *
 * Each swatch shows:
 *  - selected: a primary ring + checkmark
 *  - unavailable (occupied): disabled opacity + no interaction
 *  - available (free): solid, tappable
 *
 * Purely presentational — no room sync.
 */
export function ColorPicker({
  availableColors,
  occupants,
  selected,
  onSelect,
  disabled,
  className,
}: ColorPickerProps) {
  const colors = availableColors.length > 0 ? availableColors : PLAYER_COLORS;

  return (
    <div
      className={cn(
        "grid grid-cols-5 gap-2",
        "touch-pan-y",
        className,
      )}
      role="radiogroup"
      aria-label="انتخاب رنگ بازیکن"
    >
      {colors.map((color) => {
        const style = getPlayerColorStyle(color);
        const isTaken = occupants[color] != null;
        const isSelected = selected === color;
        const isUnavailable = isTaken && !isSelected;

        return (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={style.label}
            disabled={disabled || isUnavailable}
            onClick={() => onSelect(color)}
            className={cn(
              "relative mx-auto -m-1 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isSelected
                ? "border-primary ring-2 ring-primary ring-offset-2"
                : "hover:border-border",
              isUnavailable
                ? "cursor-not-allowed opacity-35"
                : disabled
                  ? "cursor-wait opacity-50"
                  : "cursor-pointer hover:scale-105",
            )}
          >
            <span
              className="block h-8 w-8 rounded-full"
              style={{ backgroundColor: style.hex }}
            />
            {isSelected && (
              <Check
                className="absolute -end-1 -bottom-1 rounded-full bg-primary text-primary-foreground"
                size={14}
                aria-hidden
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
