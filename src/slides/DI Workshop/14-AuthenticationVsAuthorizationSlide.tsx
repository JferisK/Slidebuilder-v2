import * as React from "react";
import type { CodeSlide } from "../types";
import { ComparisonColumns, StandardTitle } from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle eyebrow="Vergleich" title="Authentifizierung vs. Autorisierung" />
);

const BodySlot: React.FC = () => (
  <ComparisonColumns
    left={{
      title: "Authentifizierung",
      question: "Wer bist du wirklich?",
      focus: "Identitätsnachweis",
    }}
    right={{
      title: "Autorisierung",
      question: "Was darfst du?",
      focus: "erlaubte Aktionen und Ressourcen",
    }}
    takeaway="Eingeloggt bedeutet nicht automatisch berechtigt."
  />
);

const AuthenticationVsAuthorizationSlide: CodeSlide = {
  id: "diw-14-auth-vs-authorization",
  name: "14 · Vergleichs-Slide: Authentifizierung vs. Autorisierung",
  description: "Vergleichsfolie zur Abgrenzung von Authentifizierung und Autorisierung.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default AuthenticationVsAuthorizationSlide;
