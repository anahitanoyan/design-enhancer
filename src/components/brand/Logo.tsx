import logoUrl from "@/assets/logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
  tagline?: string;
}

export function Logo({ size = 40, showWordmark = true, className, tagline }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src={logoUrl}
        alt="OikOS logo"
        width={size}
        height={size}
        className="drop-shadow-sm"
        style={{ width: size, height: size }}
        loading="eager"
      />
      {showWordmark && (
        <div className="leading-tight">
          <div className="text-xl font-semibold tracking-tight text-gradient-brand">OikOS</div>
          {tagline && <div className="text-[11px] text-muted-foreground">{tagline}</div>}
        </div>
      )}
    </div>
  );
}