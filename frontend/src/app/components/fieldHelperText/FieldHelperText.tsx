import ErrorHelperText from "@components/errorHelperText/ErrorHelperText";
import Typography from "@components/typography/Typography";
import { useTranslation } from "react-i18next";
import { ValidationError } from "yup";

interface IFormHelper {
  fieldNames: string[] | string;
  formErrors?: ValidationError[];
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

  const fieldErrors = formErrors?.filter(
    (formError) =>
      formError.path && normalizedFieldNames.includes(formError.path),
  );

  if (fieldErrors && fieldErrors.length > 0) {
    return fieldErrors.map((error, index) => (
      <ErrorHelperText
        key={index}
        message={t(error.message, {
          ...error.params,
          max: error.params?.max,
          min: error.params?.min,
          field: t(error.params?.label as string),
        })}
      />
    ));
  }

  if (!helperText) {
    return null;
  }

  return (
    <Typography.Caption className="mt-xxs ml-md">
      {helperText}
    </Typography.Caption>
  );
}
