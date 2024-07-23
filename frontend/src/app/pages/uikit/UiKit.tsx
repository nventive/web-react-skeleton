import { useEffect } from "react";
import { TextField, Typography } from "@mui/material";
import Layout from "@components/layout/Layout";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism.css";
import { useTranslation } from "react-i18next";
import FieldHelperText from "@components/fieldHelperText/FieldHelperText";
import Loading from "@components/loading/Loading";
import UikitBlock from "@components/uikitBlock/UikitBlock";

export default function UiKit() {
  const [t] = useTranslation();
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Layout.Container>
      <Typography variant="h1">UiKit</Typography>
      {/* To add: FieldHelperText Loading Spinner */}

      <UikitBlock
        title="FieldHelperText.tsx"
        codeBlock={`<FieldHelperText
      fieldNames="username"
      helperText="Name must be minimum 1 character"
  />`}
      >
        <TextField label={t("login__username")} />
        <FieldHelperText
          fieldNames="username"
          helperText="Name must be minimum 1 character"
        />
      </UikitBlock>

      <UikitBlock
        title="Loading.tsx"
        codeBlock="<Loading isLoading={condition} /> // Add fullscreen in component to make overlay everything"
      >
        <Loading />
      </UikitBlock>
    </Layout.Container>
  );
}
