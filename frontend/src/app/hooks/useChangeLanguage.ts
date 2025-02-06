import i18n from "@shared/i18n";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { findRoute } from "src/routes";

export const useChangeLanguage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onChangeLanguage = useCallback(() => {
    const { search } = location;
    const newLocation = findRoute(location.pathname, t("locale__switch_key"));
    navigate(newLocation + search, { replace: true });
    void i18n.changeLanguage(t("locale__switch_key"));
  }, [navigate, t]);

  return { onChangeLanguage };
};
