import * as React from "react";
import type { CodeSlide } from "../types";
import { PALETTE, StandardTitle, mix } from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle
    eyebrow="Zukunft und Relevanz"
    title="Warum IAM durch KI und Deepfakes wichtiger wird"
    tags={[
      { label: "Deepfakes", tone: "risk" },
      { label: "ITDR", tone: "signal" },
    ]}
  />
);

const DefenseStep: React.FC<{
  step: string;
  title: string;
  text: string;
  tone: "primary" | "trust" | "signal";
}> = ({ step, title, text, tone }) => {
  const color =
    tone === "trust"
      ? PALETTE.trust
      : tone === "signal"
        ? PALETTE.signal
        : PALETTE.primary;

  return (
    <div
      style={{
        padding: "8px 10px",
        borderRadius: 6,
        background: mix(PALETTE.bg, color, 7),
        borderLeft: `3px solid ${color}`,
        display: "grid",
        gap: 3,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            color,
            fontSize: 10,
            lineHeight: 1,
            fontFamily: PALETTE.heading,
          }}
        >
          {step}
        </span>
        <span
          style={{
            color,
            fontSize: 14,
            lineHeight: 1.04,
            fontFamily: PALETTE.heading,
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          color: PALETTE.text,
          fontSize: 11,
          lineHeight: 1.17,
          fontFamily: PALETTE.body,
        }}
      >
        {text}
      </div>
    </div>
  );
};

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
        width: "52%",
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
      Deepfakes greifen automatisierte Biometrie und menschliche Vertrauensentscheidungen zugleich an.
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.15fr 0.85fr",
        gap: 18,
        minHeight: 0,
      }}
    >
      <div
        style={{
          minHeight: 0,
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          gap: 10,
          padding: "10px 8px 8px 0",
          background:
            "linear-gradient(120deg, color-mix(in srgb, var(--ppt-accent6, var(--slide-accent)) 9%, transparent), transparent 64%)",
        }}
      >
        <div
          style={{
            color: PALETTE.risk,
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontFamily: PALETTE.heading,
          }}
        >
          Angriffsdruck
        </div>
        <div
          style={{
            minHeight: 0,
            display: "grid",
            alignContent: "start",
            gap: 8,
          }}
        >
          <div
            style={{
              color: PALETTE.risk,
              fontSize: 28,
              lineHeight: 0.96,
              fontFamily: PALETTE.heading,
              maxWidth: "84%",
            }}
          >
            KI greift genau die Momente an, in denen Identitaet geglaubt werden soll.
          </div>

          {[
            {
              title: "Automatisierte Pruefung",
              text: "Voice- und Face-Biometrics koennen synthetisch imitiert und gezielt unter Druck gesetzt werden.",
              bg: "color-mix(in srgb, var(--ppt-accent6, var(--slide-accent)) 86%, var(--slide-bg))",
            },
            {
              title: "Menschliche Entscheidung",
              text: "Rueckruf-, Freigabe- und Support-Situationen lassen sich glaubhaft imitieren und unter Zeitdruck manipulieren.",
              bg: "color-mix(in srgb, var(--ppt-accent4, var(--slide-primary)) 84%, var(--slide-bg))",
            },
            {
              title: "Eskalation ueber Rechte",
              text: "Je maechtiger Konto, Rolle oder Prozessschritt, desto groesser die Wirkung eines falschen Vertrauensmoments.",
              bg: "color-mix(in srgb, var(--slide-primary) 84%, var(--slide-bg))",
            },
          ].map((item, index) => (
            <div
              key={item.title}
              style={{
                width: index === 1 ? "92%" : index === 2 ? "88%" : "96%",
                marginLeft: index === 1 ? "3.5%" : index === 2 ? "7%" : 0,
                padding: "8px 10px",
                borderRadius: 6,
                background: item.bg,
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
                {item.title}
              </div>
              <div
                style={{
                  marginTop: 4,
                  color: mix(PALETTE.bg, "transparent", 92),
                  fontSize: 11,
                  lineHeight: 1.17,
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
            fontSize: 12,
            lineHeight: 1.14,
            fontFamily: PALETTE.heading,
          }}
        >
          Deepfake-Erkennung hilft, reicht aber nicht als Einzelkontrolle.
        </div>
      </div>

      <div
        style={{
          minHeight: 0,
          display: "grid",
          gridTemplateRows: "auto 1fr",
          gap: 10,
          alignContent: "start",
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
          Welche Antwort folgt
        </div>
        <div
          style={{
            minHeight: 0,
            display: "grid",
            alignContent: "start",
            gap: 7,
          }}
        >
          <div
            style={{
              color: PALETTE.primary,
              fontSize: 24,
              lineHeight: 0.96,
              fontFamily: PALETTE.heading,
              maxWidth: "92%",
              marginBottom: 4,
            }}
          >
            IAM muss von Zugangskontrolle zu Identitaetsverteidigung werden.
          </div>
          <DefenseStep
            step="01"
            title="Staerker verifizieren"
            text="Kontextbezogene MFA fuer riskante Aktionen statt nur fuer den ersten Login."
            tone="primary"
          />
          <DefenseStep
            step="02"
            title="Ausserhalb des Kanals pruefen"
            text="Rueckruf-, Freigabe- und Ausnahmewege muessen gegen Druck und Zeitnot gehaertet werden."
            tone="trust"
          />
          <DefenseStep
            step="03"
            title="Zusatzsignale nutzen"
            text="Geraet, Ort, Verhalten, Prozesskontext und Anomalien kompensieren, wenn Erkennung versagt."
            tone="signal"
          />
          <DefenseStep
            step="04"
            title="ITDR einziehen"
            text="Identity Detection and Response erweitert IAM von Rechtevergabe auf Sichtbarkeit, Priorisierung und Reaktion."
            tone="primary"
          />
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
      Merksatz: <span style={{ color: PALETTE.risk, fontFamily: PALETTE.heading }}>Nicht den Deepfake isoliert loesen.</span>{" "}
      Widerstandsfaehig wird IAM erst dann, wenn starke Identitaetspruefung, kanalunabhaengige
      Verifikation, Zusatzsignale und ITDR zusammenspielen.
    </div>
  </div>
);

const IamAiDeepfakesSlide: CodeSlide = {
  id: "diw-23-iam-ai-deepfakes",
  name: "23 · Warum IAM durch KI und Deepfakes wichtiger wird",
  description: "Zukunftsfolie zu Deepfakes, KI und gestärkten IAM-Kontrollen.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default IamAiDeepfakesSlide;
