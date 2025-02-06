import { route as dashboardRoute } from "@routes/authenticated-routes/dashboard/route";
import i18next from "@shared/i18n";
import { redirect, useNavigate } from "react-router";
import { findRoute } from "src/routes";

// the redirect url could have a language param different from the current language
const getRedirectUrl = () => {
  const url = new URL(window.location.href);
  const urlSearchParams = new URLSearchParams(url.search);
  const redirectUrl = urlSearchParams.get("redirect");

  if (redirectUrl) {
    const localizedRoute = findRoute(redirectUrl, i18next.language);
    urlSearchParams.delete("redirect");
    return `${localizedRoute}?${urlSearchParams.toString()}`;
  } else {
    return dashboardRoute.paths[i18next.language];
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
