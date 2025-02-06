import Button from "@components/button/Button";
import FieldHelperText from "@components/fieldHelperText/FieldHelperText";
import TextField from "@components/textField/TextField";
import { useFormValidation } from "@routes/public-routes/login/loginForm/useFormValidation";
import type ILogin from "@services/auth/interfaces/ILogin";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type FetcherWithComponents } from "react-router";
import classes from "./loginForm.module.css";

type LoginFormProps = {
  submit: (form: ILogin) => void;
  fetcher: FetcherWithComponents<unknown>;
};

export default function LoginForm({ submit, fetcher }: LoginFormProps) {
  const { t } = useTranslation();
  const [loginForm, setLoginForm] = useState<ILogin>({
    username: "",
    password: "",
  });

  const { onSubmit, onValidate, formErrors } = useFormValidation(loginForm);
  const isLoading = fetcher.state !== "idle";

  return (
    <fetcher.Form className={classes["container"]} onSubmit={onSubmit(submit)}>
      <div>
        <TextField
          autoFocus
          fullWidth
          onBlur={onValidate}
          autoComplete="username"
          value={loginForm.username}
          disabled={isLoading}
          onChange={(value) =>
            setLoginForm((prevState) => ({
              ...prevState,
              username: value,
            }))
          }
          label={t("login__username")}
        />
        <FieldHelperText fieldNames="username" formErrors={formErrors} />
      </div>

      <div>
        <TextField
          fullWidth
          onBlur={onValidate}
          autoComplete="current-password"
          value={loginForm.password}
          disabled={isLoading}
          type="password"
          onChange={(value) =>
            setLoginForm((prevState) => ({
              ...prevState,
              password: value,
            }))
          }
          label={t("login__password")}
        />
        <FieldHelperText fieldNames="password" formErrors={formErrors} />
      </div>

      <Button
        variant="contained"
        size="large"
        type="submit"
        loading={isLoading}
        sx={(theme) => ({
          marginBottom: theme.customProperties.spacing.md,
        })}
      >
        {t("login__sign_in")}
      </Button>
    </fetcher.Form>
  );
}
