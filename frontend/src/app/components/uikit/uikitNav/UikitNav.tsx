import Typography from "@mui/material/Typography";
import Link from "@components/link/Link";

export interface INavItem {
  text: string;
  id: string;
}

interface IUikitNav {
  items: INavItem[];
}

function UikitNav({ items }: IUikitNav) {
  return (
    <div
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
      <ul className="flex-column gap-xs">
        {items.map((item) => (
          <li key={item.id}>
            <Link href={`#${item.id}`}>{item.text}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UikitNav;
