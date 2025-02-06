import {
  TextField as MuiTextField,
  styled,
  type TextFieldProps,
} from "@mui/material";
import { type ChangeEvent } from "react";

interface ITextField extends Omit<TextFieldProps, "onChange"> {
  onChange: (value: string) => void;
}

const StyledMuiTextField = styled(MuiTextField)(({ theme }) => ({
  borderRadius: theme.customProperties.borderRadius.md,
}));

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
