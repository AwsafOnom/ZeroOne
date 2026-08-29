export interface SupportResource {
  label: string;
  detail: string;
  href?: string;
  phone?: string;
}

export interface CrisisSupportContent {
  headline: string;
  message: string;
  resources: SupportResource[];
}

/** Used by journal and assistant crisis detection responses. */
export const crisisSupportContent: CrisisSupportContent = {
  headline: "You deserve immediate support",
  message:
    "What you wrote suggests you may be in serious distress. ZeroOne cannot provide crisis care. Please reach out to someone who can help you right now.",
  resources: [
    {
      label: "Emergency services",
      detail: "If you are in immediate danger, contact your local emergency number now.",
    },
    {
      label: "988 Suicide & Crisis Lifeline (US)",
      detail: "Call or text 988, or chat at 988lifeline.org.",
      phone: "988",
      href: "https://988lifeline.org/",
    },
    {
      label: "Crisis Text Line (US)",
      detail: "Text HOME to 741741 to connect with a trained crisis counselor.",
    },
    {
      label: "International Association for Suicide Prevention",
      detail: "Find local helplines at https://www.iasp.info/resources/Crisis_Centres/",
      href: "https://www.iasp.info/resources/Crisis_Centres/",
    },
  ],
};

/**
 * Bangladesh crisis and emotional support lines (verified from provider sites, 2026).
 * Kaan Pete Roi: kaanpeteroi.org — 09612-119911, 3:00 PM–3:00 AM daily.
 * Vent (Mindspace): mindspacebd.com/services/vent — 09678-678778, 6:00 PM–6:00 AM daily.
 * National emergency: 999 — Bangladesh Police National Emergency Service (police, fire, ambulance).
 */
export const bangladeshSupportResources: SupportResource[] = [
  {
    label: "National emergency (Bangladesh)",
    detail: "Call 999 for police, fire, or ambulance. Toll-free, 24 hours.",
    phone: "999",
  },
  {
    label: "Kaan Pete Roi",
    detail: "Emotional support and suicide prevention helpline. 09612-119911, 3:00 PM–3:00 AM daily.",
    phone: "09612119911",
    href: "https://kaanpeteroi.org/",
  },
  {
    label: "Vent by Mindspace",
    detail: "Psychological crisis hotline. 09678-678778, 6:00 PM–6:00 AM daily.",
    phone: "09678678778",
    href: "https://www.mindspacebd.com/services/vent",
  },
];

export const internationalSupportResource: SupportResource = {
  label: "International Association for Suicide Prevention",
  detail: "Find crisis helplines by country at iasp.info/resources/Crisis_Centres/",
  href: "https://www.iasp.info/resources/Crisis_Centres/",
};

export const zeroOneCareDisclaimer =
  "ZeroOne is a recovery platform. It is not emergency care, clinical treatment, or a substitute for a doctor or mental health professional.";

export const healingChainPeerSupport = {
  label: "Healing Chain",
  detail: "Peer mentorship on ZeroOne — someone further along in recovery who can listen and check in.",
  path: "/healing-chain",
};

export function formatCrisisSupportResponse(): string {
  const lines = [
    crisisSupportContent.headline,
    "",
    crisisSupportContent.message,
    "",
    ...crisisSupportContent.resources.map((resource) => `${resource.label}: ${resource.detail}`),
  ];
  return lines.join("\n");
}
