import { object, string } from "yup";

const loginFormSchema = object({
  password: string()
    .label("login__password")
    .min(8, "validations__min_characters"),
  username: string().label("login__username").required("validations__required"),
});

export default loginFormSchema;
