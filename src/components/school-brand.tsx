import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/config/branding";

type SchoolBrandProps = {
  size?: "xs" | "sm" | "md" | "lg";
  showMotto?: boolean;
  showTagline?: boolean;
  /** When false, only the logo image is shown */
  showName?: boolean;
  href?: string;
  className?: string;
  /** onBrand = white text on maroon sidebar; default = dark text on light surfaces */
  tone?: "onBrand" | "default";
};

const logoSizes = { xs: 32, sm: 44, md: 72, lg: 120 } as const;

export function SchoolBrand({
  size = "md",
  showMotto = false,
  showTagline = true,
  showName = true,
  href,
  className = "",
  tone = "default",
}: SchoolBrandProps) {
  const px = logoSizes[size];
  const onBrand = tone === "onBrand";
  const titleClass = onBrand ? "text-white" : "text-heading";
  const tagClass = onBrand ? "text-brand-gold/90" : "text-brand";

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src={BRAND.logoSrc}
        alt={BRAND.name}
        width={px}
        height={px}
        className="shrink-0 rounded-lg object-contain"
        style={{ width: "auto", height: "auto", maxWidth: px, maxHeight: px }}
        priority
      />
      {showName && (
        <div className="min-w-0">
          <p className={`font-semibold leading-tight text-sm sm:text-base ${titleClass}`}>
            {BRAND.shortName}
          </p>
          {showTagline && (
            <p className={`text-[10px] uppercase tracking-wider sm:text-xs ${tagClass}`}>
              {BRAND.tagline}
            </p>
          )}
          {showMotto && (
            <p className="mt-1 text-xs italic text-brand-gold">{BRAND.motto}</p>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition opacity-95 hover:opacity-100">
        {content}
      </Link>
    );
  }
  return content;
}

export function SchoolBrandHero({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <Image
        src={BRAND.logoSrc}
        alt={BRAND.name}
        width={160}
        height={160}
        className="rounded-2xl object-contain shadow-lg ring-4 ring-white/20"
        style={{ width: "auto", height: "auto", maxWidth: 160, maxHeight: 160 }}
        priority
      />
      <h1 className="mt-6 max-w-md text-xl font-bold leading-snug text-white sm:text-2xl">
        {BRAND.name}
      </h1>
      <p className="mt-2 text-sm font-medium text-brand-gold">{BRAND.motto}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/80">{BRAND.tagline}</p>
    </div>
  );
}
