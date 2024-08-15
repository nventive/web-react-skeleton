import Accordion from "@components/accordion/Accordion";
import AccordionSummary from "@components/accordionSummary/AccordionSummary";
import Button from "@components/button/Button";
import Dialog from "@components/dialog/Dialog";
import IconButton from "@components/iconButton/IconButton";
import Link from "@components/link/Link";
import Switch from "@components/switch/Switch";
import Table from "@components/table/Table";
import TableRow from "@components/tableRow/TableRow";
import Typography from "@components/typography/Typography";
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
            <Typography.Heading5 as="h1">
              {t("cookie_modal__title")}
            </Typography.Heading5>
            <IconButton aria-label={t("global__close")} onClick={closeModal}>
              <CloseIcon />
            </IconButton>
          </div>
          <Typography.Body1>
            {t("cookie_modal__description_1")}
          </Typography.Body1>
          <Typography.Body1>
            {t("cookie_modal__description_2")}
          </Typography.Body1>
          <Link
            className="mr-a"
            href={t("cookie_consent_link")}
            underline="always"
            external
          >
            <Typography.Body2>
              {t("cookie_consent__learn_more")}
            </Typography.Body2>
          </Link>
        </div>
        <div className="flex-column gap-lg">
          <Typography.Body2>
            {t("cookie_modal__description_3")}
          </Typography.Body2>

          <div>
            {cookieTypes.map((cookieType, index) => (
              <Accordion
                key={index}
                expanded={expandedSection === index}
                onChange={handleExpand(index)}
              >
                <AccordionSummary>
                  <Typography.Heading6 className="mr-a" as="h2">
                    {t(cookieType.title)}
                  </Typography.Heading6>
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
                  <Typography.Body2 key={index} className="mx-md mb-md">
                    {t(description)}
                  </Typography.Body2>
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
