import * as React from "react";
import type { CodeSlide } from "../types";
import {
  DenseEditorialCard,
  DenseStatementStrip,
  EditorialLeadBand,
  LayerStack,
  PALETTE,
  PaletteRibbon,
  StandardTitle,
  mix,
  SectionLead,
  SurfacePanel,
} from "./_shared";

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

const EvidenceLine: React.FC<{
  title: string;
  text: string;
  tone: "risk" | "signal" | "trust" | "primary";
}> = ({ title, text, tone }) => {
  const color =
    tone === "risk"
      ? PALETTE.risk
      : tone === "signal"
        ? PALETTE.signal
        : tone === "trust"
          ? PALETTE.trust
          : PALETTE.primary;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "74px 1fr",
        gap: 10,
        alignItems: "start",
        padding: "6px 0",
        borderBottom: `1px solid ${mix(color, "transparent", 18)}`,
      }}
    >
      <div
        style={{
          color,
          fontSize: 9,
          lineHeight: 1.1,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          fontFamily: PALETTE.heading,
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: PALETTE.text,
          fontSize: 11,
          lineHeight: 1.16,
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
      padding: "1.1%",
      borderRadius: 18,
      background: `linear-gradient(180deg, ${mix(PALETTE.bg, PALETTE.secondary, 93)}, ${mix(
        PALETTE.primary,
        PALETTE.bg,
        5,
      )})`,
      border: `1px solid ${mix(PALETTE.primary, "transparent", 18)}`,
    }}
  >
    <EditorialLeadBand tone="deep" style={{ fontSize: 14, lineHeight: 1.18, padding: "12px 16px" }}>
      Deepfakes greifen zwei Pruefwelten zugleich an: automatisierte Biometrie und menschliche
      Vertrauensentscheidungen. Dadurch wird IAM von einem Login-Thema zu einem mehrschichtigen
      Identitaets-, Freigabe- und Reaktionsthema.
    </EditorialLeadBand>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "0.92fr 1.08fr",
        gap: 10,
        minHeight: 0,
      }}
    >
      <SurfacePanel tone="risk" className="grid h-full min-h-0 grid-rows-[auto_1fr] gap-2 p-2.5">
        <SectionLead
          eyebrow="Angriffsdruck"
          title="Wie Deepfakes die Identitaetskette unterlaufen"
          text="Nicht nur Menschen im Call, sondern auch Voice- und Face-Biometrics geraten unter Druck."
          tone="risk"
        />
        <div style={{ minHeight: 0, display: "grid", gridTemplateRows: "1fr auto", gap: 8 }}>
          <div style={{ minHeight: 0, overflow: "hidden" }}>
            <LayerStack
              layers={[
                {
                  key: "spoof",
                  title: "1. Identitaet wird imitiert",
                  text: "Stimme, Gesicht oder Persona werden synthetisch nachgebaut und in einen glaubhaften Kontext gesetzt.",
                  tone: "risk",
                },
                {
                  key: "workflow",
                  title: "2. Prozess wird unterlaufen",
                  text: "Biometrische oder menschliche Pruefungen werden in Eile, Routine oder Ausnahmeprozessen umgangen.",
                  tone: "signal",
                },
                {
                  key: "approval",
                  title: "3. Kritische Handlung wird freigegeben",
                  text: "Rueckruf, Reset oder Freigabe kippen auf Basis falscher Identitaet und falschen Vertrauens.",
                  tone: "trust",
                },
                {
                  key: "impact",
                  title: "4. Schaden eskaliert ueber Rechte",
                  text: "Je maechtiger Konto, Rolle oder Prozessschritt, desto groesser die Wirkung des Angriffs.",
                  tone: "primary",
                },
              ]}
            />
          </div>
          <DenseEditorialCard
            tone="deep"
            density="tight"
            style={{
              display: "grid",
              gap: 4,
              background:
                "linear-gradient(145deg, color-mix(in srgb, var(--slide-text) 88%, var(--slide-bg)), color-mix(in srgb, var(--slide-primary) 70%, var(--slide-text)))",
              color: "var(--slide-bg)",
            }}
          >
            <div
              style={{
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: mix(PALETTE.bg, "transparent", 72),
                fontFamily: PALETTE.heading,
              }}
            >
              Doppeldruck
            </div>
            <div
              style={{
                fontSize: 12,
                lineHeight: 1.2,
                color: mix(PALETTE.bg, "transparent", 92),
                fontFamily: PALETTE.body,
              }}
            >
              Deepfakes treffen Maschine und Mensch zugleich. Genau deshalb reichen Einzelkontrollen
              nicht mehr.
            </div>
          </DenseEditorialCard>
        </div>
      </SurfacePanel>

      <SurfacePanel tone="primary" className="grid h-full min-h-0 grid-rows-[auto_auto_1fr] gap-2 p-2.5">
        <SectionLead
          eyebrow="IAM-Antwort"
          title="Welche Kontrollschichten jetzt tragen muessen"
          text="Deepfake-Erkennung hilft, reicht aber nicht. Entscheidend sind Kontrollschichten rund um Identitaet, Freigabe und Reaktion."
          tone="primary"
        />
        <DenseEditorialCard
          tone="signal"
          density="tight"
          style={{
            display: "grid",
            gap: 5,
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--ppt-accent4, var(--slide-primary)) 14%, var(--slide-bg)), color-mix(in srgb, var(--slide-secondary) 80%, var(--slide-bg)))",
          }}
        >
          <div
            style={{
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: PALETTE.signal,
              fontFamily: PALETTE.heading,
            }}
          >
            Kernthese
          </div>
          <div
            style={{
              color: PALETTE.text,
              fontSize: 16,
              lineHeight: 1.08,
              fontFamily: PALETTE.heading,
            }}
          >
            Wenn Deepfakes billiger werden, muessen Kontrollen staerker auf Kontext, Prozess und
            Reaktion setzen.
          </div>
        </DenseEditorialCard>
        <DenseEditorialCard tone="trust" density="tight" style={{ display: "grid", gap: 2 }}>
          <EvidenceLine
            title="MFA"
            text="Starke, kontextbezogene MFA fuer riskante Aktionen statt nur fuer den ersten Login."
            tone="primary"
          />
          <EvidenceLine
            title="Prozess"
            text="Verifikation ausserhalb des angegriffenen Kanals: Rueckruf-, Freigabe- und Ausnahmewege muessen gegen Druck und Zeitnot gehaertet werden."
            tone="trust"
          />
          <EvidenceLine
            title="Signals"
            text="Zusatzsignale wie Geraet, Ort, Verhaltensmuster, Prozesskontext und Anomalien kompensieren, wenn Erkennung versagt."
            tone="signal"
          />
          <EvidenceLine
            title="ITDR"
            text="Identity Detection and Response erweitert IAM von Rechtevergabe auf Sichtbarkeit, Erkennung, Priorisierung und Reaktion."
            tone="primary"
          />
        </DenseEditorialCard>
      </SurfacePanel>
    </div>

    <DenseStatementStrip tone="risk" style={{ fontSize: 12, lineHeight: 1.06, padding: "6px 10px" }}>
      Nicht den Deepfake isoliert loesen wollen. Widerstandsfaehig wird IAM erst dann, wenn starke
      Identitaetspruefung, kanalunabhaengige Verifikation, Zusatzsignale und ITDR zusammenspielen.
    </DenseStatementStrip>
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
