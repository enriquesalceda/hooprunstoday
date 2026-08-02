import Image from "next/image";
import type { CSSProperties } from "react";

import { submitLead } from "@/app/actions";
import { LeadForm } from "@/app/_components/lead-form";
import { Logo } from "@/components/chrome/logo";
import { StatusDot } from "@/components/chrome/status-dot";
import { SectionLabel } from "@/components/core/section-label";

const gutter = "clamp(16px, 4vw, 40px)";

const bodyCopy: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--mono-9)",
  lineHeight: 1.6,
  color: "var(--text-body)",
  fontWeight: 500,
  textWrap: "pretty",
};

const kickerStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--mono-2)",
  letterSpacing: "var(--track-bar)",
  color: "var(--text-faint)",
  fontWeight: 500,
};

type Feature = {
  number: string;
  image: string;
  alt: string;
  title: [string, string];
  copy: React.ReactNode;
  tags: string;
};

const features: Feature[] = [
  {
    number: "01",
    image: "/img/run-dunk.jpg",
    alt: "Player rising for a dunk under the lights",
    title: ["SHOUT IT.", "THEY COME."],
    copy: (
      <>
        Shout <strong style={{ color: "var(--text-primary)", fontWeight: 700 }}>HOOP RUNS TODAY</strong>{" "}
        — 6pm, Lincoln Park, need three more — and it lands with your people first, then anyone close
        by who hoops. Your crew comes even when the map is quiet. Show up when you said you would and
        it goes on your record.
      </>
    ),
    tags: "THE SHOUT  ·  YOUR CREW  ·  LIVE COURT STATUS",
  },
  {
    number: "02",
    image: "/img/league-game.jpg",
    alt: "Indoor league game in progress",
    title: ["RUN A LEAGUE", "IN A NIGHT"],
    copy: (
      <>
        No spreadsheet. No chasing people for cash. Set the teams, the nights and the fee — schedules,
        dues and stats keep themselves. Anyone with a court and ten friends can run a season.
      </>
    ),
    tags: "AUTO SCHEDULE  ·  ENTRY FEES  ·  STATKEEPING",
  },
  {
    number: "03",
    image: "/img/record-net.jpg",
    alt: "Ball dropping through the net",
    title: ["A RECORD", "THAT TRAVELS"],
    copy: (
      <>
        Every run, every score, every hooper you&apos;ve played beside — verified by the people who
        were on the floor. One card that follows you from the blacktop to the rec league.
      </>
    ),
    tags: "PLAYER CARD  ·  GAME HISTORY  ·  VOUCHES",
  },
];

function FeatureRow({ feature, reversed, last }: { feature: Feature; reversed: boolean; last: boolean }) {
  return (
    <div
      style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: `clamp(28px, 4vw, 48px) ${gutter} ${last ? "clamp(48px, 6vw, 80px)" : "clamp(28px, 4vw, 48px)"}`,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: reversed ? "row-reverse" : "row",
        alignItems: "center",
        gap: "clamp(24px, 4vw, 56px)",
        borderTop: feature.number === "01" ? "none" : "var(--border-faint)",
      }}
    >
      <div style={{ flex: "1 1 380px", minWidth: 0 }}>
        <div style={{ position: "relative", width: "100%", height: "clamp(300px, 38vw, 460px)" }}>
          <Image
            src={feature.image}
            alt={feature.alt}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            style={{ objectFit: "cover", filter: "contrast(1.12)" }}
          />
        </div>
      </div>
      <div style={{ flex: "1 1 340px", minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--display-2)", lineHeight: 1, color: "var(--blacktop-400)" }}>
          {feature.number}
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(32px, 4.4vw, 58px)",
            lineHeight: "var(--lh-display)",
            margin: "12px 0 0",
          }}
        >
          {feature.title[0]}
          <br />
          {feature.title[1]}
        </h2>
        <p style={{ ...bodyCopy, margin: "18px 0 0", maxWidth: 420 }}>{feature.copy}</p>
        <div
          style={{
            marginTop: 22,
            paddingTop: 14,
            borderTop: "var(--border-hairline)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--mono-2)",
            letterSpacing: "var(--track-nav)",
            color: "var(--text-muted)",
            fontWeight: 500,
          }}
        >
          {feature.tags}
        </div>
      </div>
    </div>
  );
}

/* The temporary landing page: what's coming, and one form to get on the
   list. Replaced by the product once the first city opens. */
export default function Home() {
  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: `0 ${gutter}`,
          height: 64,
          borderBottom: "var(--border-hairline)",
          position: "sticky",
          top: 0,
          background: "var(--surface-app)",
          zIndex: 10,
        }}
      >
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StatusDot />
          <span style={{ ...kickerStyle, letterSpacing: "var(--track-nav)", color: "var(--text-muted)" }}>
            BUILDING NOW
          </span>
        </div>
      </header>

      <section
        style={{
          position: "relative",
          height: "min(92vh, 900px)",
          minHeight: 600,
          overflow: "hidden",
          borderBottom: "var(--border-hairline)",
        }}
      >
        <Image
          src="/img/hero-court.jpg"
          alt="Outdoor court at golden hour, seen from above"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", filter: "contrast(1.1) brightness(0.9)" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(13,13,12,0.55) 0%, rgba(13,13,12,0.25) 40%, rgba(13,13,12,0.92) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            height: "100%",
            maxWidth: 1240,
            margin: "0 auto",
            padding: `0 ${gutter} clamp(40px, 6vw, 72px)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ ...kickerStyle, color: "var(--text-secondary)", marginBottom: "clamp(16px, 3vw, 28px)" }}>
            THE HOME FOR LOCAL BASKETBALL
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(46px, 10.5vw, 164px)",
              lineHeight: 0.86,
              margin: 0,
              color: "var(--text-primary)",
              textWrap: "balance",
            }}
          >
            SOMEBODY IS
            <br />
            ALWAYS PLAYING.
            <br />
            YOU JUST CAN&apos;T
            <br />
            SEE THEM YET.
          </h1>
          <p style={{ ...bodyCopy, maxWidth: 560, margin: "clamp(20px, 3vw, 32px) 0 0" }}>
            Runs happen every night, three blocks from your door. We&apos;re building the app that
            shows you where they are, who&apos;s in, and what happened when the game ended.
          </p>
        </div>
      </section>

      <section style={{ borderBottom: "var(--border-hairline)", padding: `clamp(48px, 7vw, 96px) ${gutter}` }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "clamp(24px, 4vw, 64px)" }}>
          <div style={{ flex: "1 1 220px", paddingTop: 6 }}>
            <SectionLabel style={{ letterSpacing: "var(--track-bar)" }}>WHY WE&apos;RE DOING THIS</SectionLabel>
          </div>
          <p
            style={{
              flex: "3 1 460px",
              margin: 0,
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(24px, 3.4vw, 44px)",
              lineHeight: 1.12,
              color: "var(--text-primary)",
              textWrap: "pretty",
            }}
          >
            BASKETBALL IS THE CHEAPEST GYM, THE BEST THERAPY AND THE FASTEST WAY TO KNOW YOUR
            NEIGHBOURS. ALL IT NEEDS IS SOMEONE ELSE AT THE COURT WHEN YOU GET THERE. THAT&apos;S THE
            ONLY PROBLEM WE&apos;RE SOLVING.
          </p>
        </div>
      </section>

      <section style={{ borderBottom: "var(--border-hairline)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: `clamp(40px, 5vw, 64px) ${gutter} 0` }}>
          <SectionLabel style={{ letterSpacing: "var(--track-bar)" }}>WHAT&apos;S COMING</SectionLabel>
        </div>
        {features.map((feature, i) => (
          <FeatureRow
            key={feature.number}
            feature={feature}
            reversed={i % 2 === 1}
            last={i === features.length - 1}
          />
        ))}
      </section>

      <section style={{ position: "relative", overflow: "hidden", borderBottom: "var(--border-hairline)" }}>
        <Image
          src="/img/band-lines.jpg"
          alt="Court markings from above"
          fill
          sizes="100vw"
          style={{ objectFit: "cover", filter: "contrast(1.2) brightness(0.55)" }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: 1100,
            margin: "0 auto",
            padding: `clamp(72px, 11vw, 160px) ${gutter}`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(30px, 5.2vw, 80px)",
              lineHeight: 0.95,
              color: "var(--text-primary)",
              textWrap: "balance",
            }}
          >
            THE BEST HOUR OF YOUR WEEK IS OUTSIDE, ON YOUR FEET, KEEPING SCORE WITH PEOPLE YOU LIKE.
          </p>
        </div>
      </section>

      <section id="list" style={{ padding: `clamp(56px, 8vw, 120px) ${gutter}`, borderBottom: "var(--border-hairline)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <SectionLabel style={{ letterSpacing: "var(--track-bar)" }}>GET ON THE LIST</SectionLabel>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(38px, 6.4vw, 84px)",
              lineHeight: 0.9,
              margin: "16px 0 0",
              color: "var(--text-primary)",
            }}
          >
            BE THERE FOR
            <br />
            THE FIRST RUN.
          </h2>
          <p style={{ ...bodyCopy, margin: "20px 0 0", maxWidth: 520 }}>
            We&apos;re opening one city at a time, and the first hoopers in shape how it plays. Leave
            your name and one way to reach you.
          </p>
          <LeadForm action={submitLead} />
        </div>
      </section>

      <footer
        style={{
          padding: `28px ${gutter}`,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Logo size={14} />
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--mono-1)", letterSpacing: "var(--track-nav)", color: "var(--text-faint)", fontWeight: 500 }}>
          BUILT FOR THE PEOPLE WHO SHOW UP &nbsp;·&nbsp; © 2026
        </div>
      </footer>
    </div>
  );
}
