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
import { ValidationError } from "yup";

export default function UiKit() {
  const [t] = useTranslation();
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  // this is for mocking, yup will format the error correctly for you
  const formErrors: ValidationError[] = [
    {
      value: "",
      path: "username",
      type: "required",
      params: {
        value: "",
        originalValue: "",
        label: "login__username",
        path: "username",
        spec: {
          strip: false,
          strict: false,
          abortEarly: true,
          recursive: true,
          disableStackTrace: false,
          nullable: false,
          optional: false,
          coerce: true,
          label: "login__username",
        },
        disableStackTrace: false,
      },
      errors: ["validations__required"],
      inner: [],
      name: "ValidationError",
      message: "validations__required",
      [Symbol.toStringTag]: "",
    },
  ];

  return (
    <Layout.Container className="mb-lg">
      <Typography variant="h1">UiKit</Typography>
      {/* To add: FieldHelperText Loading Spinner */}

      <div className="flex-column gap-md">
        <UikitBlock
          title="FieldHelperText.tsx"
          codeBlock={`<TextField label="Username" />
<FieldHelperText
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
          title="FieldHelperText.tsx - with errors"
          codeBlock={`<TextField label="Username" />
<FieldHelperText
  fieldNames="username"
  formErrors={formErrors}
  helperText="Name must be minimum 1 character"
/>`}
        >
          <TextField label={t("login__username")} />
          <FieldHelperText
            fieldNames="username"
            formErrors={formErrors}
            helperText="Name must be minimum 1 character"
          />
        </UikitBlock>

        <UikitBlock
          title="Loading.tsx"
          codeBlock="<Loading isLoading={condition} /> // Add fullscreen in component to make overlay everything"
        >
          <Loading />
        </UikitBlock>
      </div>
    </Layout.Container>
  );
}
