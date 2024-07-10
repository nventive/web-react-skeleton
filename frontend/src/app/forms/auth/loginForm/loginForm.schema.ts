import { object, string } from "yup";

const loginFormSchema = object({
  username: string().label("login__username").required("validations__required"),
  password: string()
    .label("login__password")
    .min(8, "validations__min_characters"),
});

export default loginFormSchema;
