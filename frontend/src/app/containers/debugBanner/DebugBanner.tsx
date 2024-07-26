import { useState } from "react";
import classNames from "classnames";
import Button from "@components/button/Button";
import homeRoute from "@pages/home/home.route";
import uikitRoute from "@pages/uikit/uikit.route";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import "./debug-banner.scss";

const HIDE_BANNER_UNTIL_KEY = "hideBannerUntil";
const FOUR_HOURS = 4 * 60 * 60 * 1000;

export default function DebugBanner() {
  const [t] = useTranslation();
  const hideBannerUntil = localStorage.getItem(HIDE_BANNER_UNTIL_KEY);

  const [isBannerOpen, setIsBannerOpen] = useState(
    hideBannerUntil ? Number(hideBannerUntil) < Date.now() : true,
  );

  const pages = [
    {
      name: t(homeRoute.name),
      to: homeRoute.paths[t("locale__key")],
    },
    {
      name: t(uikitRoute.name),
      to: uikitRoute.paths[t("locale__key")],
    },
  ];

  const closeBanner = () => {
    setIsBannerOpen(false);
    localStorage.setItem(
      HIDE_BANNER_UNTIL_KEY,
      String(Date.now() + FOUR_HOURS),
    );
  };

  if (__ENV__ === "prod" || !isBannerOpen) {
    return null;
  }

  return (
    <div className={"debug-banner__container"}>
      <div
        className={classNames("debug-banner", {
          "debug-banner__local": __ENV__ === "local",
          "debug-banner__dev": __ENV__ === "dev",
          "debug-banner__qa": __ENV__ === "qa",
          "debug-banner__uat": __ENV__ === "uat",
          "debug-banner__staging": __ENV__ === "staging",
        })}
      >
        <div className="debug-banner__pages">
          {pages.map((page) => (
            <Link key={`debug-banner-${page.name}`} to={page.to}>
              <Button>{page.name}</Button>
            </Link>
          ))}
        </div>

        <Button variant="contained" size="small" onClick={closeBanner}>
          {t("global__hide")}
        </Button>
      </div>
    </div>
  );
}
