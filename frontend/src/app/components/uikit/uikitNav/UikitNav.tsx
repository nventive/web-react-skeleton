import Typography from "@components/typography/Typography";
import "./uikit-nav.scss";
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
    <div className="uikit-nav">
      <Typography.Heading6>Components</Typography.Heading6>
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
