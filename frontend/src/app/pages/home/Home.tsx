import logo from "@assets/images/logo.png";
import reactLogo from "@assets/react.svg";
import Button from "@components/button/Button";
import Typography from "@mui/material/Typography";
import { useUserStore } from "@stores/userStore";
import { useTranslation } from "react-i18next";
import viteLogo from "/vite.svg";
import styles from "./home.module.css";

function Home() {
  const { t } = useTranslation();
  const { user } = useUserStore();

  return (
    <div className={styles["home"]}>
      <Button href="https://nventive.com" target="_blank" rel="noreferrer">
        <img src={logo} width={219} height={63} alt="Nventive logo" />
      </Button>

      <div>
        <Button href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} alt="Vite logo" />
        </Button>

        <Button href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} alt="React logo" />
        </Button>
      </div>

      <Typography variant="h4">{`${t("home__welcome")} ${user?.firstName} ${user?.lastName}`}</Typography>

      <Typography variant="h6">VERSION: {__VERSION_NUMBER__}</Typography>
      <Typography variant="h6">API_URL: {__API_URL__}</Typography>
    </div>
  );
}

export default Home;
