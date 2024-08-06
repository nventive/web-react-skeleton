import Button from "@components/button/Button";
import FieldHelperText from "@components/fieldHelperText/FieldHelperText";
import TextField from "@components/textField/TextField";
import loginFormSchema from "@forms/auth/loginForm/loginForm.schema";
import homeRoute from "@pages/home/home.route";
import { postLogin } from "@services/auth/authService";
import ILogin from "@services/auth/interfaces/ILogin";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@shared/constants";
import { useUserStore } from "@stores/userStore";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ValidationError } from "yup";

interface ILoginForm {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function LoginForm({ setIsLoading }: ILoginForm) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [loginForm, setLoginForm] = useState<ILogin>({
    password: "",
    username: "",
  });
  const [loginFormValidated, setLoginFormValidated] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<ValidationError[]>([]);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        setLoginFormValidated(true);
        loginFormSchema.validateSync(loginForm, {
          abortEarly: false,
        });
        setFormErrors([]);
        setIsLoading(true);
        postLogin(loginForm)
          .then(({ data }) => {
            if (data.token && data.refreshToken) {
              localStorage.setItem(ACCESS_TOKEN, data.token);
              localStorage.setItem(REFRESH_TOKEN, data.refreshToken);
            }
            setUser(data);
            navigate(homeRoute.paths[t("locale__key")]);
          })
          .catch((error) => {
            if (error.response?.data?.message === "Invalid credentials") {
              toast.error(t("errors__invalid_credentials"), {
                toastId: "invalid-credentials",
              });
            } else {
              toast.error(t("errors__generic"), {
                toastId: "generic",
              });
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      } catch (error) {
        if (error instanceof ValidationError) {
          setFormErrors(error.inner);
        }
      }
    },
    [loginForm, navigate, setIsLoading, setUser, t],
  );

  const onValidate = useCallback(() => {
    try {
      if (loginFormValidated) {
        loginFormSchema.validateSync(loginForm, {
          abortEarly: false,
        });
        setFormErrors([]);
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        setFormErrors(error.inner);
      }
    }
  }, [loginForm, loginFormValidated]);

  return (
    <form className="flex-column" onSubmit={onSubmit}>
      <div className="mb-md">
        <TextField
          autoFocus
          fullWidth
          onBlur={onValidate}
          autoComplete="username"
          value={loginForm.username}
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
      <div className="mb-md">
        <TextField
          fullWidth
          onBlur={onValidate}
          autoComplete="current-password"
          value={loginForm.password}
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
      <Button className="mb-md" variant="contained" size="large" type="submit">
        {t("login__sign_in")}
      </Button>
    </form>
  );
}
