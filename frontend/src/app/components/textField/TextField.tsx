import {
  TextField as MuiTextField,
  TextFieldProps,
  styled,
} from "@mui/material";
import style from "@styles/style.module.scss";
import { ChangeEvent } from "react";

interface ITextField extends Omit<TextFieldProps, "onChange"> {
  onChange: (value: string) => void;
}

const StyledMuiTextField = styled(MuiTextField)({
  borderRadius: style["border-radius-sm"],
});

export default function TextField({ onChange, value, ...props }: ITextField) {
  return (
    <StyledMuiTextField
      {...props}
      value={value === undefined ? "" : value}
      variant="outlined"
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onChange(event.target.value)
      }
    />
  );
}
