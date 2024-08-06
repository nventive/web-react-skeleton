import ErrorHelperText from "@components/errorHelperText/ErrorHelperText";
import Typography from "@components/typography/Typography";
import { useTranslation } from "react-i18next";
import { ValidationError } from "yup";

interface IFormHelper {
  formErrors: ValidationError[];
  fieldNames: string[] | string;
  helperText?: string;
}

export default function FieldHelperText({
  formErrors,
  fieldNames,
  helperText,
}: IFormHelper) {
  const { t } = useTranslation();

  const normalizedFieldNames = Array.isArray(fieldNames)
    ? fieldNames
    : [fieldNames];

  const fieldErrors = formErrors.filter(
    (formError) =>
      formError.path && normalizedFieldNames.includes(formError.path),
  );

  return fieldErrors.length > 0 ? (
    fieldErrors.map((error, index) => (
      <ErrorHelperText
        key={index}
        message={t(error.message, {
          ...error.params,
          field: t(error.params?.label as string),
          max: error.params?.max,
          min: error.params?.min,
        })}
      />
    ))
  ) : helperText ? (
    <Typography.Caption className="mt-xxs ml-md">
      {helperText}
    </Typography.Caption>
  ) : undefined;
}
