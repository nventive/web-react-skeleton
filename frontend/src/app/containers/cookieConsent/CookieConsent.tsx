import cookieTypes from "@containers/cookieConsent/cookieConsent.config";
import {
  COOKIE_CONSENT_DURATION,
  getCookieConsentPreferences,
  setCookiePreferencesInStorage,
} from "@containers/cookieConsent/cookieConsentHelper";
import ICookiePreferences from "@containers/cookieConsent/interfaces/ICookiePreferences";
import { useCallback, useEffect, useState } from "react";
import CookieBanner from "./cookieBanner/CookieBanner";
import CookieModal from "./cookieModal/CookieModal";

const ALL_COOKIE_TYPES = cookieTypes.map((cookieType) => cookieType.id);

export default function CookieConsent() {
  const [cookieModalOpen, setCookieModalOpen] = useState<boolean>(false);
  const [cookieBannerOpen, setCookieBannerOpen] = useState<boolean>(false);
  const [cookiePreferences, setCookiePreferences] =
    useState<Array<string>>(ALL_COOKIE_TYPES);

  const handleAccept = useCallback((preferences: Array<string>) => {
    setCookieBannerOpen(false);
    setCookieModalOpen(false);
    const cookieConsentPreferences: ICookiePreferences = {
      consentDate: new Date().getTime(),
      preferences,
    };
    setCookiePreferencesInStorage(cookieConsentPreferences);
  }, []);

  useEffect(() => {
    const currentTimestamp = new Date().getTime();
    const cookieConsentPreferences = getCookieConsentPreferences();

    if (
      !cookieConsentPreferences ||
      cookieConsentPreferences.consentDate <
        currentTimestamp - COOKIE_CONSENT_DURATION
    )
      setTimeout(() => setCookieBannerOpen(true), 4000);
  }, []);

  return (
    <>
      <CookieModal
        closeModal={() => {
          setCookieModalOpen(false);
          setCookieBannerOpen(true);
        }}
        handleAcceptAll={() => handleAccept(ALL_COOKIE_TYPES)}
        handleAcceptSelection={() => handleAccept(cookiePreferences)}
        open={cookieModalOpen}
        cookieTypes={cookieTypes}
        cookiePreferences={cookiePreferences}
        setCookiePreferences={setCookiePreferences}
      />
      <CookieBanner
        showBanner={cookieBannerOpen}
        openModal={() => {
          setCookieModalOpen(true);
          setCookieBannerOpen(false);
        }}
        handleAcceptAll={() => handleAccept(ALL_COOKIE_TYPES)}
        handleAcceptNecessary={() => handleAccept(["necessary"])}
      />
    </>
  );
}
