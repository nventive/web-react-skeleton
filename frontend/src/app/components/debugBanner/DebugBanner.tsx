import Button from "@components/button/Button";
import { Box } from "@mui/material";
import i18next from "@shared/i18n";
import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import classes from "./debug-banner.module.css";

const HIDE_BANNER_UNTIL_KEY = "hideBannerUntil";
const FOUR_HOURS = 4 * 60 * 60 * 1000;
const env = import.meta.env.VITE_ENV;

export default function DebugBanner() {
  const [t] = useTranslation();

  const hideBannerUntil = localStorage.getItem(HIDE_BANNER_UNTIL_KEY);
  const [isBannerOpen, setIsBannerOpen] = useState(
    hideBannerUntil ? Number(hideBannerUntil) < Date.now() : true,
  );

  const pages = [
    {
      name: t("home__page_title"),
      to: `/${i18next.language}/home`,
    },
    {
      name: t("dashboard__page_title"),
      to: `/${i18next.language}/dashboard`,
    },
  ];

  const closeBanner = () => {
    setIsBannerOpen(false);
    localStorage.setItem(
      HIDE_BANNER_UNTIL_KEY,
      String(Date.now() + FOUR_HOURS),
    );
  };

  if (env === "prod" || !isBannerOpen) {
    return null;
  }

  return (
    <div className={classes["container"]}>
      <Box
        component="div"
        sx={(theme) => ({
          zIndex: theme.zIndex.debugBanner,
        })}
        className={clsx(classes["content"], {
          [classes["local"]]: env === "local",
          [classes["dev"]]: env === "dev",
          [classes["qa"]]: env === "qa",
          [classes["uat"]]: env === "uat",
          [classes["staging"]]: env === "staging",
        })}
      >
        <div>
          {pages.map((page, i) => (
            <Link key={`debug-banner-${i}`} to={page.to}>
              <Button component="div">{page.name}</Button>
            </Link>
          ))}
        </div>

        <Button size="small" onClick={closeBanner}>
          {t("global__hide")}
        </Button>
      </Box>
    </div>
  );
}
