const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  moderate: 1.55,
  active: 1.725,
};

/**
 * Mifflin–St Jeor TDEE estimate (kcal/day). Returns null if inputs are invalid.
 */
export function estimateTdee({ weight, height, age, gender, activityLevel }) {
  const w = Number(weight);
  const h = Number(height);
  const a = Number(age);
  if (!Number.isFinite(w) || !Number.isFinite(h) || !Number.isFinite(a) || w <= 0 || h <= 0 || a <= 0) {
    return null;
  }
  const isMale = gender === 'male';
  const bmr = 10 * w + 6.25 * h - 5 * a + (isMale ? 5 : -161);
  const mult = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.375;
  return Math.round(bmr * mult);
}

export function computeBmi(weightKg, heightCm) {
  const w = Number(weightKg);
  const h = Number(heightCm);
  if (!Number.isFinite(w) || !Number.isFinite(h) || h <= 0) return null;
  const m = h / 100;
  if (m <= 0) return null;
  return Number((w / (m * m)).toFixed(1));
}
