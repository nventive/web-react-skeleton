import Button from "@components/button/Button";
import FieldHelperText from "@components/fieldHelperText/FieldHelperText";
import TextField from "@components/textField/TextField";
import loginFormSchema from "@forms/auth/loginForm/loginForm.schema";
import type ILogin from "@services/auth/interfaces/ILogin";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOnSubmit } from "src/routes/public-routes/login/useOnSubmit";
import { ValidationError } from "yup";
import classes from "./loginForm.module.css";

export interface ILoginFormProps {
  onSuccessfulLogin: () => void;
}

export default function LoginForm(props: ILoginFormProps) {
  const { t } = useTranslation();
  const [loginForm, setLoginForm] = useState<ILogin>({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<ValidationError[]>([]);

  const { isLoading, onSubmit } = useOnSubmit(
    loginForm,
    props.onSuccessfulLogin,
  );

  const onValidate = useCallback(() => {
    try {
      loginFormSchema.validateSync(loginForm, {
        abortEarly: false,
      });
      setFormErrors([]);
    } catch (error) {
      if (error instanceof ValidationError) {
        setFormErrors(error.inner);
      }
    }
  }, [loginForm]);

  return (
    <form className={classes["container"]} onSubmit={onSubmit}>
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
    </form>
  );
}
