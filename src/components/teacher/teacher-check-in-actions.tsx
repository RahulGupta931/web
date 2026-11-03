"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { navIcons } from "@/components/nav-icons";
import {
  checkInStateLabel,
  formatCheckDate,
  formatCheckTime,
  formatDuration,
  type CheckInRecord,
} from "@/lib/check-in-display";
import { getApiErrorMessage } from "@/lib/api";
import { useApi } from "@/lib/use-api";

type TodayResponse = {
  today: string;
  canCheckIn: boolean;
  canCheckOut: boolean;
  record: CheckInRecord;
};

function CheckOutConfirmDialog({
  open,
  checkInTime,
  onCancel,
  onConfirm,
  busy,
}: {
  open: boolean;
  checkInTime: string | null;
  onCancel: () => void;
  onConfirm: () => void;
  busy: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-black/45" aria-label="Close" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-confirm-title"
        className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-xl"
      >
        <h2 id="checkout-confirm-title" className="text-lg font-semibold text-heading">Check out now?</h2>
        <p className="mt-2 text-sm text-muted">
          This records your leaving time for today. The principal will see your check-out time.
          {checkInTime ? (
            <>
              {" "}
              You checked in at <span className="font-medium text-heading">{formatCheckTime(checkInTime)}</span>.
            </>
          ) : null}
        </p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="btn-secondary w-full sm:w-auto" disabled={busy}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="btn-primary w-full sm:w-auto disabled:opacity-50" disabled={busy}>
            {busy ? "Checking out…" : "Yes, check out"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TeacherCheckInActions({
  variant = "card",
  embedded = false,
  onMessage,
  onError,
}: {
  variant?: "card" | "bar";
  /** Inside a parent card — omit duplicate chrome and today heading. */
  embedded?: boolean;
  onMessage?: (msg: string | null) => void;
  onError?: (msg: string | null) => void;
}) {
  const { get, post } = useApi();
  const [today, setToday] = useState<TodayResponse | null>(null);
  const [busy, setBusy] = useState<"in" | "out" | null>(null);
  const [confirmOut, setConfirmOut] = useState(false);

  const load = useCallback(async () => {
    try {
      const current = await get<TodayResponse>("/api/teacher/check-in");
      setToday(current);
    } catch (e) {
      onError?.(getApiErrorMessage(e));
    }
  }, [get, onError]);

  useEffect(() => {
    load();
  }, [load]);

  async function punchIn() {
    setBusy("in");
    onError?.(null);
    onMessage?.(null);
    try {
      await post("/api/teacher/check-in", {});
      onMessage?.("Checked in.");
      await load();
    } catch (e) {
      onError?.(getApiErrorMessage(e));
    } finally {
      setBusy(null);
    }
  }

  async function punchOut() {
    setBusy("out");
    onError?.(null);
    onMessage?.(null);
    try {
      await post("/api/teacher/check-out", {});
      onMessage?.("Checked out.");
      setConfirmOut(false);
      await load();
    } catch (e) {
      onError?.(getApiErrorMessage(e));
    } finally {
      setBusy(null);
    }
  }

  const record = today?.record ?? null;

  if (variant === "bar") {
    return (
      <>
        <CheckOutConfirmDialog
          open={confirmOut}
          checkInTime={record?.checkInAt ?? null}
          onCancel={() => setConfirmOut(false)}
          onConfirm={punchOut}
          busy={busy === "out"}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          {today?.canCheckIn && (
            <button
              type="button"
              disabled={busy !== null}
              onClick={punchIn}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-gold py-3.5 text-sm font-bold text-brand-dark shadow-[0_8px_24px_rgb(201_162_39/0.35)] disabled:opacity-50"
            >
              <navIcons.clock className="h-5 w-5" />
              {busy === "in" ? "Checking in…" : "Check in"}
            </button>
          )}
          {today?.canCheckOut && (
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => setConfirmOut(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-brand bg-surface py-3.5 text-sm font-bold text-brand disabled:opacity-50"
            >
              <navIcons.clock className="h-5 w-5" />
              Check out
            </button>
          )}
          {!today?.canCheckIn && !today?.canCheckOut && today && (
            <Link
              href="/teacher/check-in"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3 text-sm font-semibold text-heading"
            >
              View today&apos;s times · {formatCheckTime(record?.checkInAt ?? null)}
            </Link>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <CheckOutConfirmDialog
        open={confirmOut}
        checkInTime={record?.checkInAt ?? null}
        onCancel={() => setConfirmOut(false)}
        onConfirm={punchOut}
        busy={busy === "out"}
      />
      <section
        className={
          embedded
            ? ""
            : "rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6"
        }
      >
        {!embedded && (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Today</p>
            <p className="mt-1 text-lg font-semibold text-heading">
              {today ? formatCheckDate(today.today) : "…"}
            </p>
            <p className="mt-1 text-sm text-muted">{checkInStateLabel(record)}</p>
          </>
        )}

        <dl className={`grid gap-3 sm:grid-cols-3 ${embedded ? "" : "mt-4"}`}>
          <div className="rounded-xl bg-surface-muted/70 px-3 py-3">
            <dt className="text-xs text-muted">Check-in</dt>
            <dd className="mt-1 text-base font-semibold text-heading">{formatCheckTime(record?.checkInAt ?? null)}</dd>
          </div>
          <div className="rounded-xl bg-surface-muted/70 px-3 py-3">
            <dt className="text-xs text-muted">Check-out</dt>
            <dd className="mt-1 text-base font-semibold text-heading">{formatCheckTime(record?.checkOutAt ?? null)}</dd>
          </div>
          <div className="rounded-xl bg-surface-muted/70 px-3 py-3">
            <dt className="text-xs text-muted">Time on campus</dt>
            <dd className="mt-1 text-base font-semibold text-heading">{formatDuration(record?.durationMinutes ?? null)}</dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={!today?.canCheckIn || busy !== null}
            onClick={punchIn}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {busy === "in" ? "Checking in…" : "Check in"}
          </button>
          <button
            type="button"
            disabled={!today?.canCheckOut || busy !== null}
            onClick={() => setConfirmOut(true)}
            className="btn-secondary flex-1 disabled:opacity-50"
          >
            Check out
          </button>
        </div>
      </section>
    </>
  );
}
