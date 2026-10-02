import Image from "next/image";

import { submitLead } from "@/app/actions";
import { LeadForm } from "@/app/_components/lead-form";

import styles from "./page.module.css";

const pillars = [
  { label: "[ 01 / COURT ]", lines: ["PICKUP RUNS ALL DAY", "RUN YOUR OWN LEAGUE"] },
  { label: "[ 02 / ACTION ]", lines: ["RUN YOUR OWN COMPETITION", "BUCKETS GET RECEIPTS"] },
  { label: "[ 03 / IDENTITY ]", lines: ["YOUR CARD. YOUR CRED.", "THE LOCKER ROOM"] },
];

/* The pre-launch landing page: the wordmark, what's coming, and one form to
   get on the list. Replaced by the product once the first city opens. */
export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.bar}>
        <span>THE BASKETBALL APP</span>
        <span className={styles.live}>
          <span className={styles.dot} aria-hidden="true" />
          LIVE SOON
        </span>
      </div>

      <div className={styles.lockup}>
        <Image
          src="/wordmark-white.svg"
          alt="HOOPRUNS"
          width={600}
          height={521}
          priority
          unoptimized
          className={styles.wordmark}
        />
        <div className={styles.today}>.TODAY</div>
      </div>

      <div className={styles.pillars}>
        {pillars.map((pillar) => (
          <div key={pillar.label} className={styles.pillar}>
            <span className={styles.pillarLabel}>{pillar.label}</span>
            {pillar.lines.map((line) => (
              <span key={line} className={styles.pillarLine}>
                {line}
              </span>
            ))}
          </div>
        ))}
      </div>

      <LeadForm action={submitLead} />
    </main>
  );
}
