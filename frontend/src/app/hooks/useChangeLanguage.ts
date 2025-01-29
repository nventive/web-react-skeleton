import i18n from "@shared/i18n";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const replaceLanguage = (location: string, language: string) => {
  const locationChange = location.split("/");
  locationChange.splice(1, 1, language);
  return locationChange.join("/");
};

export const useChangeLanguage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onChangeLanguage = useCallback(() => {
    const { search } = location;
    const newLocation = replaceLanguage(
      location.pathname,
      t("locale__switch_key"),
    );
    navigate(newLocation + search, { replace: true });
    void i18n.changeLanguage(t("locale__switch_key"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { onChangeLanguage };
};
