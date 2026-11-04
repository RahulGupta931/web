"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { DemoQuickLogin } from "@/components/demo-quick-login";
import { useNavigationLoading } from "@/components/navigation-loading-provider";
import { navIcons } from "@/components/nav-icons";
import { BRAND } from "@/config/branding";
import { instagramPhoto } from "@/content/website/instagram-media";
import { PanelAlerts } from "@/components/panel-alerts";
import { getApiErrorMessage } from "@/lib/api";

/** Bento collage tiles for the login panel background (left on desktop). */
const LOGIN_COLLAGE = [
  { photo: instagramPhoto("campus-8.jpg"), layout: "col-start-1 row-start-1 row-span-3" },
  { photo: instagramPhoto("campus-7.jpg"), layout: "col-start-2 row-start-1" },
  { photo: instagramPhoto("campus-5.jpg"), layout: "col-start-2 row-start-2" },
  { photo: instagramPhoto("campus-28.jpg"), layout: "col-start-2 row-start-3" },
  { photo: instagramPhoto("campus-21.jpg"), layout: "col-start-3 row-start-1 row-span-2" },
  { photo: instagramPhoto("campus-4.jpg"), layout: "col-start-3 row-start-3" },
] as const;

export function LoginScreen() {
  const { login } = useAuth();
  const { startNavigation } = useNavigationLoading();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const HomeIcon = navIcons.home;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const redirectTo = await login(email, password);
      startNavigation();
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-[100dvh] w-full bg-neutral-950 lg:grid lg:min-h-screen lg:grid-cols-2">
      <section
        className="relative flex min-h-[38vh] flex-col overflow-hidden px-4 pb-10 pt-[max(0.75rem,env(safe-area-inset-top))] lg:min-h-screen lg:justify-center lg:px-10 lg:pb-12 lg:pt-12"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-0.5 bg-neutral-900 sm:gap-1">
            {LOGIN_COLLAGE.map(({ photo, layout }) => (
              <div key={photo.src} className={`relative min-h-[4.5rem] overflow-hidden ${layout}`}>
                <img src={photo.src} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-neutral-950/55" />
        </div>

        <header className="relative z-10 flex items-center justify-between lg:absolute lg:inset-x-0 lg:top-0 lg:px-10 lg:pt-8">
          <Link
            href="/"
            className="rkps-ease rkps-press inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/15"
          >
            <HomeIcon className="h-4 w-4" aria-hidden />
            Home
          </Link>
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold/90 lg:hidden">
            {BRAND.shortName}
          </span>
        </header>

        <div className="relative z-10 mt-6 flex flex-1 flex-col items-center justify-center text-center lg:mt-0">
          <div className="animate-[login-float_4s_ease-in-out_infinite]">
            <Image
              src={BRAND.crestSrc}
              alt=""
              width={200}
              height={240}
              className="h-[min(38vw,10rem)] w-[min(46vw,12rem)] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] lg:h-44 lg:w-52"
              priority
            />
          </div>
          <h1 className="mt-5 max-w-xs text-lg font-bold leading-snug text-white lg:mt-8 lg:max-w-md lg:text-2xl">
            {BRAND.name}
          </h1>
          <p className="mt-2 text-sm font-medium italic text-brand-gold">{BRAND.motto}</p>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.25em] text-white/75 lg:text-xs">
            {BRAND.tagline}
          </p>
          <p className="mt-4 hidden max-w-sm text-sm leading-relaxed text-white/90 lg:block">
            Sign in as Super Admin, Principal, Teacher, or Student to access your panel.
          </p>
        </div>
      </section>

      <section
        className="relative z-10 -mt-6 flex flex-col rounded-t-[1.75rem] bg-surface shadow-[0_-16px_48px_rgba(0,0,0,0.2)] lg:mt-0 lg:rounded-none lg:shadow-none lg:overflow-y-auto lg:max-h-[100dvh]"
      >
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 lg:justify-center lg:px-8 lg:py-10">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--border)] lg:hidden" aria-hidden />

          <h2 className="text-xl font-bold text-heading lg:text-2xl">Welcome back</h2>
          <p className="mt-1 text-sm text-muted">Use your school email and password</p>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                className="input-field mt-1.5 !rounded-xl !py-3"
              />
            </label>
            <div className="block">
              <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wide text-muted">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field !rounded-xl !py-3 !pr-14"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-1 text-xs font-semibold text-heading hover:text-brand"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <PanelAlerts error={error} errorTitle="Sign in failed" />

            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full !rounded-xl !py-3.5 text-base font-semibold shadow-[0_8px_24px_rgba(15,23,42,0.15)] disabled:opacity-60"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <DemoQuickLogin collapsible disabled={pending} />

          <p className="mt-6 text-center text-sm text-muted lg:mt-8">
            <Link href="/" className="font-medium text-brand hover:underline">Back to home</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
