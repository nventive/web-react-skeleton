import ICookiePreferences from "@containers/cookieConsent/interfaces/ICookiePreferences";

export const COOKIE_PREFERENCES = "COOKIE_PREFERENCES";
export const COOKIE_CONSENT_DURATION = 1000 * 60 * 60 * 24 * 365;

export const getCookieConsentPreferences = () => {
  const preferences = localStorage.getItem(COOKIE_PREFERENCES);
  return preferences ? (JSON.parse(preferences) as ICookiePreferences) : null;
};

export const setCookiePreferencesInStorage = (
  preferences: ICookiePreferences,
) => {
  localStorage.setItem(COOKIE_PREFERENCES, JSON.stringify(preferences));
};

export const hasConsent = (consentId: string) => {
  const cookieConsentPreferences = getCookieConsentPreferences();
  return !!cookieConsentPreferences?.preferences.includes(consentId);
};
