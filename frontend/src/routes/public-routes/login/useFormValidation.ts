import type ILogin from "@services/auth/interfaces/ILogin";
import { t } from "i18next";
import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { ValidationError } from "yup";
import loginFormSchema from "./loginForm/loginForm.schema";

export const useFormValidation = (loginForm: ILogin) => {
  const [formErrors, setFormErrors] = useState<ValidationError[]>([]);

  const onSubmit = (submit: (form: ILogin) => void) => {
    return async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const errors = validateForm(loginForm);
      if (errors === null) return;
      if (errors.length > 0) return;

      submit(loginForm);
    };
  };

  const onValidate = () => {
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
  };

  const validateForm = (loginForm: ILogin) => {
    try {
      loginFormSchema.validateSync(loginForm, {
        abortEarly: false,
      });
      return [];
    } catch (error) {
      if (error instanceof ValidationError) {
        return error.inner;
      } else {
        toast.error(t("errors__generic"), {
          toastId: "generic",
        });
        return null;
      }
    }
  };

  return {
    onSubmit,
    onValidate,
    formErrors,
  };
};
