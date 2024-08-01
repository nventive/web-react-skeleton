import { Grid, TextField, Typography } from "@mui/material";
import Layout from "@components/layout/Layout";
import { useTranslation } from "react-i18next";
import FieldHelperText from "@components/fieldHelperText/FieldHelperText";
import Loading from "@components/loading/Loading";
import UikitBlock from "@components/uikitBlock/UikitBlock";
import { ValidationError } from "yup";
import Link from "@components/link/Link";
import Spinner from "@components/spinner/Spinner";
import { useState } from "react";
import Button from "@components/button/Button";
import UikitColor from "@components/uikitColor/UikitColor";

export default function UiKit() {
  const [t] = useTranslation();
  const [showLoading, setShowLoading] = useState(false);

  const onClickShowLoading = () => {
    setShowLoading(true);

    setTimeout(() => {
      setShowLoading(false);
    }, 3000);
  };

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
      <Typography variant="body1">
        This is where you can display all your custom components/containers.
      </Typography>
      <Typography variant="body1" className="flex gap-xxs">
        For all the Styled MUI components, please refer to
        <Link href="https://mui.com/material-ui/all-components/">
          MUI documentation
        </Link>
      </Typography>

      <div className="flex-column mt-lg gap-md">
        <UikitBlock title="Typographies">
          <Typography variant="h1">H1. Heading</Typography>
          <Typography variant="h2">H2. Heading</Typography>
          <Typography variant="h3">H3. Heading</Typography>
          <Typography variant="h4">H4. Heading</Typography>
          <Typography variant="h5">H5. Heading</Typography>
          <Typography variant="h6">H6. Heading</Typography>
          <Typography variant="subtitle1">
            subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Quos blanditiis tenetur
          </Typography>
          <Typography variant="subtitle2">
            subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Quos blanditiis tenetur
          </Typography>
          <Typography variant="body1">
            body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore
            consectetur, neque doloribus, cupiditate numquam dignissimos laborum
            fugiat deleniti? Eum quasi quidem quibusdam.
          </Typography>
          <Typography variant="body2">
            body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore
            consectetur, neque doloribus, cupiditate numquam dignissimos laborum
            fugiat deleniti? Eum quasi quidem quibusdam.
          </Typography>
          <Typography variant="button">button text</Typography>
          <Typography variant="caption">caption text</Typography>
          <Typography variant="overline">overline text</Typography>
        </UikitBlock>

        <UikitBlock title="Colors">
          <Grid container>
            <UikitColor color="secondary" />
            <UikitColor color="info" />
            <UikitColor color="success" />
            <UikitColor color="warning" />
            <UikitColor color="error" />
          </Grid>
        </UikitBlock>

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

        <UikitBlock title="Spinner.tsx" codeBlock="<Spinner />">
          <Spinner />
        </UikitBlock>

        <UikitBlock title="Loading.tsx" codeBlock="<Loading />">
          <Button onClick={onClickShowLoading}>Show Loading</Button>
          {showLoading && <Loading />}
        </UikitBlock>
      </div>
    </Layout.Container>
  );
}
