"use client";

import Link from "next/link";

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export default function EmergencyPage() {
  // NOTE: intentionally unwrapped (no AppLayout/PublicHeader) — this page
  // carries its own lightweight styles and must stay distraction-free.
  return (
    <div className="container section" style={{ maxWidth: 640 }}>
      <p className="badge badge-primary">Emergency</p>
      <h1>If this is an emergency, call now</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>
        For life-threatening situations in Rajkot, call the emergency
        ambulance number <strong>108</strong> first. Then follow the steps below.
      </p>

      <div className="flex flex-col gap-4" style={{ marginTop: 24 }}>
        <a href="tel:108" className="btn btn-primary btn-lg" style={{ fontSize: "1.25rem", padding: "16px 24px" }}>
          <span className="material-symbols-outlined" aria-hidden="true">
            call
          </span>
          Call 108 now
        </a>
        {waNumber ? (
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-lg"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              chat
            </span>
            Message us on WhatsApp instead
          </a>
        ) : null}
      </div>

      <section className="card" style={{ marginTop: 24 }}>
        <div className="card-body">
          <h2 className="text-lg font-bold">What to say on the call</h2>
          <ol style={{ marginTop: 12, paddingLeft: 20, display: "grid", gap: 8 }}>
            <li>Your exact location (landmark, area, city).</li>
            <li>What happened and how many people are affected.</li>
            <li>Age and condition of the person (breathing? conscious? bleeding?).</li>
            <li>Your callback phone number — stay on the line.</li>
          </ol>
        </div>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="card-body">
          <h2 className="text-lg font-bold">While you wait</h2>
          <ul style={{ marginTop: 12, paddingLeft: 20, display: "grid", gap: 8 }}>
            <li>Keep the person still and warm; do not move spinal injuries.</li>
            <li>Apply firm pressure to heavy bleeding with a clean cloth.</li>
            <li>Do not give food, water, or medicine unless told to by 108.</li>
            <li>Send someone to flag down the ambulance at the gate/road.</li>
          </ul>
        </div>
      </section>

      <div className="flex gap-2 flex-wrap" style={{ marginTop: 24 }}>
        <Link href="/hospitals" className="btn btn-ghost">
          Find nearby hospitals
        </Link>
        <Link href="/" className="btn btn-ghost">
          Back to home
        </Link>
      </div>
    </div>
  );
}
