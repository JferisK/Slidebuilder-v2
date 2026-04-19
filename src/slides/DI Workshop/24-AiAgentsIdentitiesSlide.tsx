import * as React from "react";
import type { CodeSlide } from "../types";
import { PALETTE, StandardTitle, mix } from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle
    eyebrow="Operating Model für neue Identitäten"
    title="AI Agents und nicht-menschliche Identitäten"
    tags={[
      { label: "Machine Identities", tone: "signal" },
      { label: "Scoped Access", tone: "trust" },
    ]}
  />
);

const BodySlot: React.FC = () => (
  <div
    style={{
      height: "100%",
      display: "grid",
      gridTemplateRows: "auto 1fr auto",
      gap: 8,
      padding: "0.5% 0.2%",
    }}
  >
    <div
      style={{
        width: "54%",
        padding: "7px 10px",
        borderRadius: 8,
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--slide-primary) 74%, var(--slide-text)), color-mix(in srgb, var(--slide-primary) 56%, var(--slide-text)))",
        color: "var(--slide-bg)",
        fontFamily: PALETTE.heading,
        fontSize: 12,
        lineHeight: 1.14,
      }}
    >
      AI Agents sind eine neue Identitaetsklasse mit eigenem Scope, eigener Verantwortung und
      eigenem Lifecycle.
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 0.95fr",
        gap: 22,
        minHeight: 0,
      }}
    >
      <div
        style={{
          minHeight: 0,
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          gap: 10,
        }}
      >
        <div
          style={{
            color: PALETTE.primary,
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontFamily: PALETTE.heading,
          }}
        >
          Neue Identitaetsrealitaet
        </div>
        <div
          style={{
            minHeight: 0,
            borderRadius: 8,
            padding: "14px 14px 12px",
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--slide-primary) 12%, var(--slide-bg)), color-mix(in srgb, var(--slide-bg) 96%, var(--slide-secondary)))",
            border: `1px solid ${mix(PALETTE.primary, "transparent", 18)}`,
            display: "grid",
            gridTemplateRows: "auto auto auto",
            gap: 10,
          }}
        >
          <div
            style={{
              color: PALETTE.primary,
              fontSize: 28,
              lineHeight: 0.96,
              fontFamily: PALETTE.heading,
            }}
          >
            Agent Identity
          </div>
          <div
            style={{
              color: PALETTE.text,
              fontSize: 12,
              lineHeight: 1.2,
              fontFamily: PALETTE.body,
              maxWidth: "90%",
            }}
          >
            Nicht Tool, sondern handelnde Identitaet. Sie nutzt Tools, Daten und Aktionen in
            wechselnden Kontexten und kann echte Entscheidungen vorbereiten oder ausloesen.
          </div>
          <div
            style={{
              display: "grid",
              gap: 7,
            }}
          >
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--slide-primary) 82%, var(--slide-text)), color-mix(in srgb, var(--slide-primary) 68%, var(--slide-text)))",
              }}
            >
              <div
                style={{
                  color: PALETTE.bg,
                  fontSize: 13,
                  lineHeight: 1.04,
                  fontFamily: PALETTE.heading,
                }}
              >
                Eigene ID + Sponsor
              </div>
              <div
                style={{
                  marginTop: 4,
                  color: mix(PALETTE.bg, "transparent", 92),
                  fontSize: 11,
                  lineHeight: 1.18,
                  fontFamily: PALETTE.body,
                }}
              >
                Jeder Agent braucht eine klar trennbare Identitaet und eine verantwortliche Person
                oder Rolle.
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            color: PALETTE.text,
            fontSize: 11,
            lineHeight: 1.18,
            fontFamily: PALETTE.body,
          }}
        >
          Der naechste Mitarbeiter oder Kunde kann AI sein. Genau deshalb wird Identity-first
          Security breiter und schwieriger.
        </div>
      </div>

      <div
        style={{
          minHeight: 0,
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          gap: 10,
        }}
      >
        <div
          style={{
            color: PALETTE.signal,
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontFamily: PALETTE.heading,
          }}
        >
          Governance-Rail
        </div>
        <div
          style={{
            minHeight: 0,
            paddingLeft: 14,
            borderLeft: `3px solid ${mix(PALETTE.signal, "transparent", 28)}`,
            display: "grid",
            alignContent: "start",
            gap: 10,
          }}
        >
          <div
            style={{
              color: PALETTE.signal,
              fontSize: 26,
              lineHeight: 0.96,
              fontFamily: PALETTE.heading,
              maxWidth: "92%",
            }}
          >
            Ein Agent braucht nicht nur Zugriff, sondern Fuehrung.
          </div>

          {[
            {
              title: "Ownership",
              text: "Pro Agent ein Sponsor, klare Verantwortung und nachvollziehbare Delegation.",
              tone: PALETTE.trust,
            },
            {
              title: "Granularer Scope",
              text: "Tools, Daten, Aktionen und Kontext muessen separat begrenzt werden.",
              tone: PALETTE.primary,
            },
            {
              title: "Kurzlebige Rechte",
              text: "Delegierte, fein granulare und moeglichst kurzlebige Credentials statt stehender Privilegien.",
              tone: PALETTE.signal,
            },
            {
              title: "Lifecycle + Logging",
              text: "Registrierung, Review, Rezertifizierung, Logging und saubere Abschaltung muessen mitlaufen.",
              tone: PALETTE.deep,
            },
          ].map((item, index) => (
            <div
              key={item.title}
              style={{
                position: "relative",
                paddingLeft: 18,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -20,
                  top: 4,
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: item.tone,
                  border: `2px solid ${PALETTE.bg}`,
                }}
              />
              <div
                style={{
                  color: item.tone,
                  fontSize: 14,
                  lineHeight: 1.04,
                  fontFamily: PALETTE.heading,
                }}
              >
                {String(index + 1).padStart(2, "0")} {item.title}
              </div>
              <div
                style={{
                  marginTop: 3,
                  color: PALETTE.text,
                  fontSize: 11,
                  lineHeight: 1.18,
                  fontFamily: PALETTE.body,
                }}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            color: PALETTE.text,
            fontSize: 11,
            lineHeight: 1.18,
            fontFamily: PALETTE.body,
          }}
        >
          Risikoformel: Agent Sprawl, Oversharing und fehlende Governance erzeugen neue
          Angriffswege. Gute Steuerung startet deshalb mit klar begrenzten Use Cases.
        </div>
      </div>
    </div>

    <div
      style={{
        color: PALETTE.text,
        fontSize: 11,
        lineHeight: 1.18,
        fontFamily: PALETTE.body,
      }}
    >
      Merksatz: <span style={{ color: PALETTE.signal, fontFamily: PALETTE.heading }}>AI Agents brauchen sauberes IAM.</span>{" "}
      Eigene Identitaet, menschliche Verantwortung, enger Handlungsspielraum und kontrollierter
      Lifecycle gehoeren zusammen.
    </div>
  </div>
);

const AiAgentsIdentitiesSlide: CodeSlide = {
  id: "diw-24-ai-agents-identities",
  name: "24 · AI Agents und nicht-menschliche Identitäten",
  description: "Zukunftsfolie zu Agenten, Maschinenidentitäten und Governance.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default AiAgentsIdentitiesSlide;
