import logo from "@assets/images/logo.png";
import reactLogo from "@assets/react.svg";
import Button from "@components/button/Button";
import Layout from "@components/layout/Layout";
import Typography from "@mui/material/Typography";
import AddRounded from "@icons/AddRounded";
import LogoutRounded from "@icons/LogoutRounded";
import loginRoute from "@pages/login/login.route";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@shared/constants";
import { useUserStore } from "@stores/userStore";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import viteLogo from "/vite.svg";

function Home() {
  const { t } = useTranslation();
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  const onLogout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setUser(undefined);
    navigate(loginRoute.paths[t("locale__key")]);
  }, [navigate, setUser, t]);

  return (
    <Layout.Container>
      <div className="flex-column align-center">
        <Button
          className="p-md"
          href="https://nventive.com"
          target="_blank"
          rel="noreferrer"
        >
          <img src={logo} width={219} height={63} alt="Nventive logo" />
        </Button>
        <div className="flex mb-lg">
          <Button
            className="mx-md"
            href="https://vitejs.dev"
            target="_blank"
            rel="noreferrer"
          >
            <img className="m-md" src={viteLogo} alt="Vite logo" />
          </Button>
          <Button
            className="mx-md"
            href="https://react.dev"
            target="_blank"
            rel="noreferrer"
          >
            <img className="m-md" src={reactLogo} alt="React logo" />
          </Button>
        </div>

        <Typography
          variant="h4"
          className="mb-xl"
        >{`${t("home__welcome")} ${user?.firstName} ${user?.lastName}`}</Typography>

        <Typography variant="h6" className="mb-xs">
          VERSION: {__VERSION_NUMBER__}
        </Typography>
        <Typography variant="h6" className="mb-xl">
          API_URL: {__API_URL__}
        </Typography>

        <div className="mb-xs">
          <Button
            variant="contained"
            onClick={() => setCount((count) => count + 1)}
          >
            <AddRounded className="mr-xs" />
            <Typography variant="button">
              {`${t("home__count")}: ${count}`}
            </Typography>
          </Button>
        </div>
        <div>
          <Button variant="contained" onClick={onLogout}>
            <LogoutRounded className="mr-xs" />
            <Typography variant="button">{t("home__logout")}</Typography>
          </Button>
        </div>
      </div>
    </Layout.Container>
  );
}

export default Home;
