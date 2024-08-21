import "./debug-banner.scss";
import Button from "@components/button/Button";
import classNames from "classnames";
import { useState } from "react";

const HIDE_BANNER_UNTIL_KEY = "hideBannerUntil";
const FOUR_HOURS = 4 * 60 * 60 * 1000;

export default function DebugBanner() {
  const hideBannerUntil = localStorage.getItem(HIDE_BANNER_UNTIL_KEY);

  const [isBannerOpen, setIsBannerOpen] = useState(
    hideBannerUntil ? Number(hideBannerUntil) < Date.now() : true,
  );

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
        <Button variant="contained" size="small" onClick={closeBanner}>
          Hide
        </Button>
      </div>
    </div>
  );
}
