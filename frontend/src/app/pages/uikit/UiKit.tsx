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

export default function UiKit() {
  const [t] = useTranslation();

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Layout.Container>
      <Typography variant="h1">UiKit</Typography>
      {/* To add: FieldHelperText Loading Spinner */}

      <Typography variant="h5">FieldHelperText.tsx</Typography>
      <div className="mb-md">
        <TextField label={t("login__username")} />
        <FieldHelperText
          fieldNames="username"
          helperText="Name must be minimum 1 character"
        />
      </div>
      <pre>
        <code className="lang-tsx">
          {`<FieldHelperText
      fieldNames="username"
      helperText="Name must be minimum 1 character"
  />`}
        </code>
      </pre>
    </Layout.Container>
  );
}
