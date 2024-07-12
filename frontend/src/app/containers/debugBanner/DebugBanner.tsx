import { useState } from "react";
import classNames from "classnames";
import "./debug-banner.scss";
import Button from "@components/button/Button";

const IS_BANNER_OPEN = "isBannerOpen";

export default function DebugBanner() {
  const localStorageValue = localStorage.getItem(IS_BANNER_OPEN);
  const [isBannerOpen, setIsBannerOpen] = useState(
    localStorageValue === "true" || localStorageValue === null,
  );

  const closeBanner = () => {
    setIsBannerOpen(false);
    localStorage.setItem(IS_BANNER_OPEN, "false");
  };

  return __ENV__ !== "prod" && isBannerOpen ? (
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
  ) : undefined;
}
