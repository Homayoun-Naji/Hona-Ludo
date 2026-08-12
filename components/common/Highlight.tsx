import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Reusable highlight ring applied around any element (piece, tile,
 * color swatch). The game engine will drive which highlight variant
 * is shown; this component only renders the visual state.
 *
 * Variants map to future engine-driven use cases:
 *  - legal:     a piece that can be moved this turn
 *  - selected:  the piece the player has tapped
 *  - active:    the player whose turn it is
 *  - available: an available color in the picker
 *  - unavailable: a color already taken
 */
export const highlightVariants = cva(
  "pointer-events-none absolute -inset-1 rounded-full",
  {
    variants: {
      variant: {
        legal: "ring-2 ring-success/60",
        selected: "ring-2 ring-primary",
        active: "ring-2 ring-primary/40",
        available: "ring-1 ring-white/50",
        unavailable: "ring-1 ring-muted-foreground/30",
        none: "ring-0",
      },
      intensity: {
        subtle: "opacity-60",
        normal: "opacity-100",
        strong: "opacity-100 drop-shadow-[0_0_6px_hsl(0_0%_100%/0.5)]",
      },
    },
    defaultVariants: {
      variant: "none",
      intensity: "normal",
    },
  },
);

export interface HighlightProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof highlightVariants> {}

export function Highlight({ className, variant, intensity, ...props }: HighlightProps) {
  return (
    <div
      className={cn(highlightVariants({ variant, intensity }), className)}
      {...props}
    />
  );
}
