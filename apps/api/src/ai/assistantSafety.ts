export const dietExerciseRedirectContent = `That's an important question — and one I need to answer carefully on ZeroOne.

I can't give personalised advice on burning calories, weight loss, calorie targets, deficits, or exercise intensity here. What is safe depends on your specific conditions — including diabetes, obesity, eating disorders, chronic fatigue, and other factors — and generic guidance can cause real harm.

For condition-aware nutrition support on ZeroOne, open Diet Advice under Learn & News (/learn-news/diet-advice). For calorie targets, weight goals, or exercise clearance tailored to you, please work with your doctor or a registered dietitian who knows your full health picture.

If you'd like help finding recovery activities or squad accountability on the platform — without prescribing how hard to push — I can walk you through that.`;

const dietExerciseAdvicePatterns = [
  /\bburn(?:ing)?\s+calories?\b/i,
  /\bcalorie\s+deficit\b/i,
  /\bhow\s+many\s+calories\b/i,
  /\bcalories?\s+should\s+i\s+(?:eat|consume)\b/i,
  /\blose\s+(?:\d+\s*)?(?:pounds?|lbs?|kg|weight)\b/i,
  /\bweight\s+loss\b/i,
  /\blosing\s+weight\b/i,
  /\bfat\s+loss\b/i,
  /\bexercise\s+intensity\b/i,
  /\bHIIT\b/i,
  /\bhigh[\s-]intensity\s+(?:interval\s+)?training\b/i,
  /\b(?:give|create|make)\s+(?:me\s+)?(?:a\s+)?(?:calorie|diet|meal)\s+plan\b/i,
  /\bdeficit\s+(?:number|plan|of)\b/i,
  /\bmacros?\s+(?:for|to)\s+(?:lose|cut)\b/i,
];

export function detectDietExerciseAdviceRequest(text: string): boolean {
  const normalized = text.trim();
  if (!normalized) {
    return false;
  }

  return dietExerciseAdvicePatterns.some((pattern) => pattern.test(normalized));
}

export function formatDietExerciseRedirectResponse(): string {
  return dietExerciseRedirectContent;
}
