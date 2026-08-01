"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import type { HandleAvailability } from "@/app/join/record/actions";
import type { RecordFormState } from "@/app/join/record/state";
import { Button } from "@/components/core/button";
import { BackLink } from "@/components/core/back-link";
import { Chip } from "@/components/core/chip";
import { SectionLabel } from "@/components/core/section-label";
import { DateField, type DobPart } from "@/components/forms/date-field";
import { FieldRow } from "@/components/forms/field-row";
import { PickerRow } from "@/components/forms/picker-row";
import { UnitToggle } from "@/components/forms/unit-toggle";
import { missingFields } from "@/domain/record";
import type { Court } from "@/lib/api/courts";

const POSITIONS = ["POINT GUARD", "SHOOTING GUARD", "WING", "FORWARD", "CENTER"] as const;

type HandleStatus = "empty" | "short" | "checking" | "free" | "taken";

type Props = {
  courts: Court[];
  action: (prev: RecordFormState, formData: FormData) => Promise<RecordFormState>;
  checkAvailability: (handle: string) => Promise<HandleAvailability>;
  debounceMs?: number;
};

const hintStyle = {
  fontFamily: "var(--font-mono)",
  fontWeight: 500,
  fontSize: "var(--mono-2)",
  color: "var(--text-faint)",
  lineHeight: 1.6,
} as const;

const slugHandle = (v: string) => v.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");

export function RecordFlow({ courts, action, checkAvailability, debounceMs = 600 }: Props) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" });
  const [screen, setScreen] = useState<"record" | "courtpick">("record");
  const [realName, setRealName] = useState("");
  const [handle, setHandle] = useState("");
  const [dob, setDob] = useState({ d: "", m: "", y: "" });
  const [heightValue, setHeightValue] = useState("");
  const [unit, setUnit] = useState<"FT" | "CM">("FT");
  const [positions, setPositions] = useState<string[]>([]);
  const [homeCourtId, setHomeCourtId] = useState("");
  const [handleStatus, setHandleStatus] = useState<HandleStatus>("empty");
  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => clearTimeout(checkTimer.current ?? undefined), []);

  function onHandleChange(raw: string) {
    const slug = slugHandle(raw);
    setHandle(slug);
    clearTimeout(checkTimer.current ?? undefined);
    if (slug.length === 0) {
      setHandleStatus("empty");
      return;
    }
    if (slug.length < 3) {
      setHandleStatus("short");
      return;
    }
    setHandleStatus("checking");
    checkTimer.current = setTimeout(() => {
      void checkAvailability(slug).then((result) => {
        setHandleStatus((current) => {
          if (current !== "checking") return current;
          if (result === "free") return "free";
          if (result === "taken") return "taken";
          return "empty";
        });
      });
    }, debounceMs);
  }

  const homeCourt = courts.find((c) => c.id === homeCourtId);

  if (screen === "courtpick") {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <BackLink label="RECORD" onClick={() => setScreen("record")} />
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "var(--display-5)",
            lineHeight: 0.95,
            color: "var(--text-primary)",
            padding: "var(--space-5) 0 0",
          }}
        >
          HOME COURT
        </h1>
        <SectionLabel style={{ padding: "var(--space-4) 0 var(--space-7)" }}>
          COURT DIRECTORY {"//"} {courts.length} TRACKED · PICK WHERE YOU RUN MOST
        </SectionLabel>
        <div>
          {courts.map((court) => {
            const selected = court.id === homeCourtId;
            return (
              <div
                key={court.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setHomeCourtId(court.id);
                  setScreen("record");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setHomeCourtId(court.id);
                    setScreen("record");
                  }
                }}
                style={{
                  borderBottom: "var(--border-hairline)",
                  borderTop: "var(--border-hairline)",
                  marginTop: -1,
                  padding: "22px 0",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-4)",
                  background: selected ? "var(--selected-bg)" : "transparent",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--display-4)",
                    lineHeight: 0.95,
                    color: selected ? "var(--selected-ink)" : "var(--text-primary)",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "var(--space-5)",
                  }}
                >
                  {court.name}
                  {selected && (
                    <span
                      style={{
                        flex: "none",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        fontSize: "var(--mono-2)",
                        background: "var(--surface-app)",
                        color: "var(--text-primary)",
                        padding: "4px 8px",
                      }}
                    >
                      ▶ HOME
                    </span>
                  )}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 500,
                    fontSize: "var(--mono-4)",
                    color: selected ? "var(--selected-ink)" : "var(--text-secondary)",
                  }}
                >
                  {court.courtType}
                </span>
              </div>
            );
          })}
        </div>
        <p style={{ ...hintStyle, padding: "var(--space-7) 0 var(--space-11)" }}>
          HOME COURT SHOWS ON YOUR PROFILE. CHANGE IT ANY TIME.
        </p>
      </div>
    );
  }

  const missing = missingFields({ realName, handle, dob, heightValue, positions, homeCourtId });
  const ready = missing.length === 0;
  const subdomainPreview =
    handleStatus === "free" ? `${handle}.hoopruns.today` : "HANDLE PENDING";

  const handleHints: Record<HandleStatus, { text: string; ink: string; weight?: number }> = {
    empty: { text: "3–20 CHARACTERS · LOWERCASE, NUMBERS, UNDERSCORE", ink: "var(--text-faint)" },
    short: { text: "TOO SHORT · MINIMUM 3 CHARACTERS", ink: "var(--text-muted)" },
    checking: { text: "CHECKING AVAILABILITY…", ink: "var(--text-secondary)" },
    taken: { text: `TAKEN · TRY ${handle}_hoops`, ink: "var(--text-muted)" },
    free: { text: `AVAILABLE · ${handle}.hoopruns.today`, ink: "var(--text-primary)" },
  };
  const handleHint =
    state.status === "error" && state.fields?.handle
      ? { text: state.fields.handle.toUpperCase(), ink: "var(--text-muted)" }
      : handleHints[handleStatus];

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: "var(--display-5)",
          lineHeight: 0.95,
          color: "var(--text-primary)",
        }}
      >
        PLAYER RECORD
      </h1>
      <p style={{ ...hintStyle, padding: "var(--space-4) 0 var(--space-11)" }}>
        WRITES TO YOUR PUBLIC PROFILE · {subdomainPreview}
      </p>

      {state.status === "error" && (
        <p role="alert" style={{ ...hintStyle, color: "var(--text-muted)", fontWeight: 700, paddingBottom: "var(--space-5)" }}>
          {state.message.toUpperCase()}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "var(--portrait-col-web) 1fr",
          gap: "var(--space-12)",
          alignItems: "start",
        }}
      >
        {/* Portrait — deferred feature; the design's dashed doctrine for absent things */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <SectionLabel>PORTRAIT</SectionLabel>
          <div
            style={{
              width: "100%",
              height: "var(--portrait-h-web)",
              background: "var(--surface-well)",
              border: "var(--border-pending)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <span style={{ ...hintStyle, letterSpacing: "var(--track-label)" }}>
              DROP A MONO PORTRAIT
            </span>
          </div>
          <p style={hintStyle}>SHOT IN MONO · FACE VISIBLE · NO TEAM KIT REQUIRED</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", minWidth: 0 }}>
          <FieldRow
            label="REAL NAME"
            id="real_name"
            name="real_name"
            placeholder="JORDAN MILLER"
            autoComplete="name"
            uppercase
            value={realName}
            onChange={setRealName}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <FieldRow
              label="@HANDLE"
              id="handle"
              name="handle"
              placeholder="jordan_miller"
              autoComplete="username"
              value={handle}
              onChange={onHandleChange}
            />
            <p style={{ ...hintStyle, fontWeight: 700, color: handleHint.ink }}>{handleHint.text}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)" }}>
            <DateField
              day={dob.d}
              month={dob.m}
              year={dob.y}
              onChange={(part: DobPart, value: string) => setDob((prev) => ({ ...prev, [part]: value }))}
            />
            <FieldRow
              label="HEIGHT"
              id="height_value"
              name="height_value"
              placeholder={unit === "FT" ? `6'2"` : "188"}
              uppercase
              value={heightValue}
              onChange={setHeightValue}
              trailing={<UnitToggle options={["FT", "CM"] as const} value={unit} onChange={setUnit} />}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <SectionLabel>POSITION · SELECT ALL THAT APPLY</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
              {POSITIONS.map((position) => (
                <Chip
                  key={position}
                  selected={positions.includes(position)}
                  onClick={() =>
                    setPositions((prev) =>
                      prev.includes(position)
                        ? prev.filter((p) => p !== position)
                        : [...prev, position],
                    )
                  }
                >
                  {position}
                </Chip>
              ))}
            </div>
          </div>

          <PickerRow
            label="HOME COURT"
            value={homeCourt?.name}
            onClick={() => setScreen("courtpick")}
          />

          <PickerRow label="LEAGUE TEAM" placeholder="OPTIONAL" glyph="↓" disabled />
          <p style={hintStyle}>
            LINK A ROSTER TO SYNC LEAGUE STATS. SKIP IT AND STREET CRED STANDS ALONE.
          </p>

          <input type="hidden" name="dob_d" value={dob.d} />
          <input type="hidden" name="dob_m" value={dob.m} />
          <input type="hidden" name="dob_y" value={dob.y} />
          <input type="hidden" name="height_unit" value={unit} />
          <input type="hidden" name="positions" value={JSON.stringify(positions)} />
          <input type="hidden" name="home_court_id" value={homeCourtId} />

          <p style={{ ...hintStyle, paddingTop: "var(--space-5)" }}>
            {ready
              ? `READY · CREATES ${handle}.hoopruns.today`
              : `STILL NEEDED: ${missing.join(" · ")}`}
          </p>

          <Button type="submit" disabled={pending || !ready}>
            {pending ? "CREATING…" : "CREATE PLAYER RECORD"}
          </Button>
        </div>
      </div>
    </form>
  );
}
