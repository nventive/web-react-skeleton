import classNames from "classnames";
import "./debug-banner.scss";

export default function DebugBanner() {
  return __ENV__ !== "prod" ? (
    <div className={"debug-banner__container"}>
      <div
        className={classNames("debug-banner", {
          "debug-banner__local": __ENV__ === "local",
          "debug-banner__dev": __ENV__ === "dev",
          "debug-banner__qa": __ENV__ === "qa",
          "debug-banner__uat": __ENV__ === "uat",
          "debug-banner__staging": __ENV__ === "staging",
        })}
      />
    </div>
  ) : undefined;
}
