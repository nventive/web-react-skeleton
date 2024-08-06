import Button from "@components/button/Button";
import Link from "@components/link/Link";
import Slide from "@components/slide/Slide";
import Typography from "@components/typography/Typography";
import CookieIcon from "@icons/CookieIcon";
import { useTranslation } from "react-i18next";
import "./cookie-banner.scss";

interface ICookieBanner {
  handleAcceptAll: () => void;
  handleAcceptNecessary: () => void;
  showBanner: boolean;
  openModal: () => void;
}

export default function CookieBanner({
  handleAcceptAll,
  handleAcceptNecessary,
  showBanner,
  openModal,
}: ICookieBanner) {
  const [t] = useTranslation();

  return (
    <Slide in={showBanner}>
      <div className="cookie-banner">
        <div className="cookie-banner__container">
          <div className="cookie-banner__description">
            <div className="mr-sm">
              <CookieIcon />
            </div>
            <div className="flex-column">
              <Typography.Body2 className="mb-xxs">
                {t("cookie_banner__description")}
              </Typography.Body2>
              <div className="mr-a">
                <Link
                  href={t("cookie_consent_link")}
                  underline="always"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Typography.Body2>
                    {t("cookie_consent__learn_more")}
                  </Typography.Body2>
                </Link>
              </div>
            </div>
          </div>
          <div className="cookie-banner__actions">
            <div className="cookie-banner__actions-link">
              <Link onClick={() => openModal()}>
                <Typography.Body2>
                  {t("cookie_banner__manage")}
                </Typography.Body2>
              </Link>
            </div>
            <div className="cookie-banner__actions-buttons">
              <Button
                variant="contained"
                onClick={() => handleAcceptNecessary()}
              >
                {t("cookie_banner__accept_necessary")}
              </Button>
              <Button variant="contained" onClick={() => handleAcceptAll()}>
                {t("cookie_banner__accept_all")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
}
