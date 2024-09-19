import { Switch as MuiSwitch, SwitchProps } from "@mui/material";
import { styled } from "@mui/material-pigment-css";

const StyledMuiSwitch = styled(MuiSwitch)(({ theme }) => ({
  transform: "scale(1.125)",
  padding: theme.spacing("xs"),

  "& .MuiSwitch-track": {
    borderRadius: theme.customProperties.borderRadius.md,

    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="%23fff" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&::after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="%23fff" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },

  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

export default function Switch({ ...props }: SwitchProps) {
  return <StyledMuiSwitch {...props} />;
}
