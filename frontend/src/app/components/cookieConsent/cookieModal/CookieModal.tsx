import Accordion from "@components/accordion/Accordion";
import AccordionSummary from "@components/accordionSummary/AccordionSummary";
import Button from "@components/button/Button";
import Dialog from "@components/dialog/Dialog";
import IconButton from "@components/iconButton/IconButton";
import Link from "@components/link/Link";
import Switch from "@components/switch/Switch";
import Table from "@components/table/Table";
import TableRow from "@components/tableRow/TableRow";
import CloseIcon from "@icons/CloseIcon";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import {
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
  type SyntheticEvent,
  useCallback,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import type ICookieSection from "../interfaces/ICookieSection";

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
    <Dialog open={open} onClose={closeModal} maxWidth="md">
      <Box sx={(theme) => ({ margin: theme.customProperties.spacing.lg })}>
        <Box
          sx={(theme) => ({
            display: "flex",
            flexDirection: "column",
            gap: theme.customProperties.spacing.md,
            marginBottom: theme.customProperties.spacing.md,
          })}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5">{t("cookie_modal__title")}</Typography>
            <IconButton aria-label={t("global__close")} onClick={closeModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body1">
            {t("cookie_modal__description_1")}
          </Typography>
          <Typography variant="body1">
            {t("cookie_modal__description_2")}
          </Typography>
          <Link
            sx={(theme) => ({ marginRight: theme.customProperties.spacing.a })}
            href={t("cookie_consent_link")}
            underline="always"
            external
          >
            <Typography variant="body2">
              {t("cookie_consent__learn_more")}
            </Typography>
          </Link>
        </Box>
        <Box
          sx={(theme) => ({
            display: "flex",
            flexDirection: "column",
            gap: theme.customProperties.spacing.lg,
          })}
        >
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
                  <Typography
                    variant="h6"
                    sx={(theme) => ({
                      marginRight: theme.customProperties.spacing.a,
                    })}
                  >
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
                    sx={(theme) => ({
                      marginX: theme.customProperties.spacing.md,
                      marginBottom: theme.customProperties.spacing.md,
                    })}
                  >
                    {t(description)}
                  </Typography>
                ))}
                {cookieType.cookies && (
                  <Box
                    sx={(theme) => ({
                      margin: theme.customProperties.spacing.md,
                    })}
                  >
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
                  </Box>
                )}
              </Accordion>
            ))}
          </div>

          <Box
            sx={(theme) => ({
              display: "flex",
              flexDirection: "column",
              gap: theme.customProperties.spacing.sm,
              justifyContent: "center",
            })}
          >
            <Button variant="contained" onClick={handleAcceptSelection}>
              {t("cookie_modal__allow_selection")}
            </Button>
            <Button variant="contained" onClick={handleAcceptAll}>
              {t("cookie_modal__allow_all")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
