import Link from "@components/link/Link";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

export interface INavItem {
  text: string;
  id: string;
}

interface IUikitNav {
  items: INavItem[];
}

function UikitNav({ items }: IUikitNav) {
  return (
    <Box
      component="div"
      sx={(theme) => ({
        display: "none",

        [theme.breakpoints.up("xs")]: {
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing(1),
          height: "100%",
          marginTop: theme.spacing(2),
          position: "sticky",
          top: theme.spacing(2),
        },
      })}
    >
      <Typography variant="h6">Components</Typography>
      <Box
        component="ul"
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          gap: theme.customProperties.spacing.xs,
        })}
      >
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`#${item.id}`}>{item.text}</Link>
          </li>
        ))}
      </Box>
    </Box>
  );
}

export default UikitNav;
