import { EN, FR } from "@shared/constants";
import i18next from "@shared/i18n";
import { redirect, useNavigate } from "react-router";

// the redirect url could have a language param different from the current language
const getRedirectUrl = () => {
  const url = new URL(window.location.href);
  const urlSearchParams = new URLSearchParams(url.search);
  const redirectUrl = urlSearchParams.get("redirect");

  if (redirectUrl) {
    const currentLanguage = i18next.language;
    const regex = new RegExp(`^/${EN}|${FR}`);
    return redirectUrl.replace(regex, `/${currentLanguage}`);
  } else {
    return `/${i18next.language}/dashboard`;
  }
};

// To be used inside loaders
export const handleRedirect = () => {
  const redirectUrl = getRedirectUrl();
  return redirect(redirectUrl);
};

// To be used inside components
export const useHandleRedirect = () => {
  const navigate = useNavigate();
  return () => {
    return navigate(getRedirectUrl(), { replace: true });
  };
};
