import Button from "@components/button/Button";
import homeRoute from "@pages/home/home.route";
import uikitRoute from "@pages/uikit/uikit.route";
import classNames from "classnames";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import classes from "./debug-banner.module.css";

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
      to: `${homeRoute.paths[t("locale__key")]}`,
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
    <div
      className={classes["container"]}
      sx={(theme) => ({
        zIndex: theme.zIndex.debugBanner,
      })}
    >
      <div
        className={classNames(classes["content"], {
          [classes["local"]]: __ENV__ === "local",
          [classes["dev"]]: __ENV__ === "dev",
          [classes["qa"]]: __ENV__ === "qa",
          [classes["uat"]]: __ENV__ === "uat",
          [classes["staging"]]: __ENV__ === "staging",
        })}
      >
        <div>
          {pages.map((page, i) => (
            <Link key={`debug-banner-${i}`} to={page.to}>
              <Button>{page.name}</Button>
            </Link>
          ))}
        </div>

        <Button onClick={closeBanner}>{t("global__hide")}</Button>
      </div>
    </div>
  );
}
