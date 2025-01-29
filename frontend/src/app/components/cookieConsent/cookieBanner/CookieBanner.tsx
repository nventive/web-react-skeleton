import Button from "@components/button/Button";
import Link from "@components/link/Link";
import Slide from "@components/slide/Slide";
import CookieIcon from "@icons/CookieIcon";
import { Box, styled } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import classes from "./cookie-banner.module.css";

interface ICookieBanner {
  handleAcceptAll: () => void;
  handleAcceptNecessary: () => void;
  showBanner: boolean;
  openModal: () => void;
}

const StyledContainer = styled("div")(({ theme }) => ({
  gap: theme.spacing(4),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.grey[300]}`,
  boxShadow: `0 0 10px -6px ${theme.palette.grey[300]}`,

  [theme.breakpoints.down("xs")]: {
    width: "90%",
  },

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    gap: theme.spacing(2),
    padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  },
}));

const StyledButtons = styled("div")(({ theme }) => ({
  display: "flex",
  whiteSpace: "nowrap",
  gap: theme.spacing(2),

  [theme.breakpoints.down("xs")]: {
    width: "100%",
    flexDirection: "column",
    gap: "theme.spacing(2)",
  },
  "> *": {
    flex: 1,
  },
}));

export default function CookieBanner({
  handleAcceptAll,
  handleAcceptNecessary,
  showBanner,
  openModal,
}: ICookieBanner) {
  const [t] = useTranslation();

  return (
    <Slide in={showBanner}>
      <Box
        className={classes["cookie-banner"]}
        sx={(theme) => ({
          bottom: theme.spacing(2),
        })}
      >
        <StyledContainer className={classes["container"]}>
          <Box
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              gap: theme.spacing(2),
            })}
          >
            <div>
              <CookieIcon />
            </div>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="body2"
                sx={{ marginBottom: "var(--mui-customProperties-spacing-xxs)" }}
              >
                {t("cookie_banner__description")}
              </Typography>
              <Box sx={{ marginRight: "auto" }}>
                <Link to={t("cookie_consent_link")} underline="always" external>
                  <Typography variant="body2">
                    {t("cookie_consent__learn_more")}
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Box>

          <Box
            className={classes["actions"]}
            sx={(theme) => ({
              gap: theme.spacing(2),

              [theme.breakpoints.down("lg")]: {
                flexDirection: "column",
              },
            })}
          >
            <Box
              className={classes["link"]}
              sx={(theme) => ({
                marginTop: theme.spacing(1),

                [theme.breakpoints.up("lg")]: {
                  marginTop: 0,
                  marginRight: theme.spacing(2),
                },
              })}
            >
              <Button onClick={() => openModal()}>
                <Typography variant="body2">
                  {t("cookie_banner__manage")}
                </Typography>
              </Button>
            </Box>

            <StyledButtons>
              <Button
                variant="contained"
                onClick={() => handleAcceptNecessary()}
              >
                {t("cookie_banner__accept_necessary")}
              </Button>
              <Button variant="contained" onClick={() => handleAcceptAll()}>
                {t("cookie_banner__accept_all")}
              </Button>
            </StyledButtons>
          </Box>
        </StyledContainer>
      </Box>
    </Slide>
  );
}
