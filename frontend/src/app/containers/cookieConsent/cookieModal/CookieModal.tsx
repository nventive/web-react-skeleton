import Accordion from "@components/accordion/Accordion";
import AccordionSummary from "@components/accordionSummary/AccordionSummary";
import Button from "@components/button/Button";
import Dialog from "@components/dialog/Dialog";
import IconButton from "@components/iconButton/IconButton";
import Link from "@components/link/Link";
import Switch from "@components/switch/Switch";
import Table from "@components/table/Table";
import TableRow from "@components/tableRow/TableRow";
import Typography from "@mui/material/Typography";
import ICookieSection from "@containers/cookieConsent/interfaces/ICookieSection";
import CloseIcon from "@icons/CloseIcon";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

interface ICookieModal {
  open: boolean;
  handleAcceptAll: () => void;
  handleAcceptSelection: () => void;
  closeModal: () => void;
  cookieTypes: ICookieSection[];
  cookiePreferences: string[];
  setCookiePreferences: Dispatch<SetStateAction<string[]>>;
}

export default function CookieModal({
  open,
  handleAcceptAll,
  handleAcceptSelection,
  closeModal,
  cookieTypes,
  cookiePreferences,
  setCookiePreferences,
}: ICookieModal) {
  const { t } = useTranslation();
  const [expandedSection, setExpandedSection] = useState<number | undefined>(
    undefined,
  );

  const handleExpand = useCallback(
    (section: number) => (_: SyntheticEvent, newExpanded: boolean) => {
      setExpandedSection(newExpanded ? section : undefined);
    },
    [],
  );

  const handleCookieTypeClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>, id: string) => {
      event.stopPropagation();
      setCookiePreferences((prevState) =>
        prevState.includes(id)
          ? prevState.filter((cookieTypeId) => cookieTypeId !== id)
          : [...prevState, id],
      );
    },
    [setCookiePreferences],
  );

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="xs">
      <div className="m-lg">
        <div className="flex-column gap-md mb-md">
          <div className="flex align-center justify-between">
            <Typography variant="h5">{t("cookie_modal__title")}</Typography>
            <IconButton aria-label={t("global__close")} onClick={closeModal}>
              <CloseIcon />
            </IconButton>
          </div>
          <Typography variant="body1">
            {t("cookie_modal__description_1")}
          </Typography>
          <Typography variant="body1">
            {t("cookie_modal__description_2")}
          </Typography>
          <Link
            className="mr-a"
            href={t("cookie_consent_link")}
            underline="always"
            external
          >
            <Typography variant="body2">
              {t("cookie_consent__learn_more")}
            </Typography>
          </Link>
        </div>
        <div className="flex-column gap-lg">
          <Typography variant="body2">
            {t("cookie_modal__description_3")}
          </Typography>

          <div>
            {cookieTypes.map((cookieType, index) => (
              <Accordion
                key={index}
                expanded={expandedSection === index}
                onChange={handleExpand(index)}
              >
                <AccordionSummary>
                  <Typography variant="h6" className="mr-a">
                    {t(cookieType.title)}
                  </Typography>
                  <Switch
                    checked={
                      cookieType.required ||
                      cookiePreferences.includes(cookieType.id)
                    }
                    onClick={(event) =>
                      handleCookieTypeClick(event, cookieType.id)
                    }
                    disabled={cookieType.required}
                  />
                </AccordionSummary>
                {cookieType.description.map((description, index) => (
                  <Typography
                    variant="body2"
                    key={index}
                    className="mx-md mb-md"
                  >
                    {t(description)}
                  </Typography>
                ))}
                {cookieType.cookies && (
                  <div className="m-md">
                    <Table
                      columnTitles={[
                        t("cookie_modal__cookie_name"),
                        t("cookie_modal__cookie_description"),
                        t("cookie_modal__cookie_duration"),
                      ]}
                    >
                      {cookieType.cookies.map((cookie, index) => (
                        <TableRow
                          key={index}
                          columns={[
                            cookie.name,
                            cookie.description,
                            cookie.duration,
                          ]}
                        />
                      ))}
                    </Table>
                  </div>
                )}
              </Accordion>
            ))}
          </div>

          <div className="flex-column justify-center gap-sm">
            <Button variant="contained" onClick={handleAcceptSelection}>
              {t("cookie_modal__allow_selection")}
            </Button>
            <Button variant="contained" onClick={handleAcceptAll}>
              {t("cookie_modal__allow_all")}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
