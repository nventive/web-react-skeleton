import Button from "@components/button/Button";
import FieldHelperText from "@components/fieldHelperText/FieldHelperText";
import Layout from "@components/layout/Layout";
import Link from "@components/link/Link";
import Loading from "@components/loading/Loading";
import Spinner from "@components/spinner/Spinner";
import Typography from "@mui/material/Typography";
import UikitBlock from "@components/uikit/uikitBlock/UikitBlock";
import UikitColor from "@components/uikit/uikitColor/UikitColor";
import UikitNav, { INavItem } from "@components/uikit/uikitNav/UikitNav";
import Grid from "@mui/material/Grid2";
import { TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ValidationError } from "yup";

export default function UiKit() {
  const [t] = useTranslation();
  const [showLoading, setShowLoading] = useState(false);
  const [navItems, setNavItems] = useState<INavItem[]>([]);

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

  const onClickShowLoading = useCallback(() => {
    setShowLoading(true);

    setTimeout(() => {
      setShowLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    setNavItems(
      Array.from(document.querySelectorAll(".uikit-block")).map(
        (item, index) => {
          return {
            text: item.children[0].textContent || `Header ${index + 1}`,
            id: item.id,
          };
        },
      ),
    );
  }, []);

  return (
    <Layout.Container className="mb-lg">
      <div className="flex gap-lg position-relative">
        <UikitNav items={navItems} />
        <div className="flex-column">
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
            <UikitBlock id="typographies" title="Typographies">
              <Typography variant="h1">H1. Heading</Typography>
              <Typography variant="h2">H2. Heading</Typography>
              <Typography variant="h3">H3. Heading</Typography>
              <Typography variant="h4">H4. Heading</Typography>
              <Typography variant="h5">H5. Heading</Typography>
              <Typography variant="h6">H6. Heading</Typography>
              <Typography variant="subtitle1">
                subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing
                elit. Quos blanditiis tenetur
              </Typography>
              <Typography variant="subtitle2">
                subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing
                elit. Quos blanditiis tenetur
              </Typography>
              <Typography variant="body1">
                body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quos blanditiis tenetur unde suscipit, quam beatae rerum
                inventore consectetur, neque doloribus, cupiditate numquam
                dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
              </Typography>
              <Typography variant="body2">
                body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quos blanditiis tenetur unde suscipit, quam beatae rerum
                inventore consectetur, neque doloribus, cupiditate numquam
                dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
              </Typography>
              <Typography variant="button">button text</Typography>
              <Typography variant="caption">caption text</Typography>
              <Typography variant="overline">overline text</Typography>
            </UikitBlock>

            <UikitBlock id="colors" title="Colors">
              <Grid container>
                <UikitColor color="primary" />
                <UikitColor color="secondary" />
                <UikitColor color="info" />
                <UikitColor color="success" />
                <UikitColor color="warning" />
                <UikitColor color="error" />
              </Grid>
            </UikitBlock>

            <UikitBlock
              id="fieldhelpertext"
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
              id="fieldhelpertext-error"
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
              id="spinner"
              title="Spinner.tsx"
              codeBlock="<Spinner />"
            >
              {/* styling inline like this to prevent the spinner from changing the height of the page while spinning, do not style inline in projects */}
              <div style={{ height: "64px" }}>
                <Spinner />
              </div>
            </UikitBlock>

            <UikitBlock
              id="loading"
              title="Loading.tsx"
              codeBlock="<Loading />"
            >
              <Button onClick={onClickShowLoading}>Show Loading</Button>
              {showLoading && <Loading />}
            </UikitBlock>
          </div>
        </div>
      </div>
    </Layout.Container>
  );
}
