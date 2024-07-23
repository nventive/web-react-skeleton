import { ReactNode } from "react";
import { Typography } from "@mui/material";

import "./uikit-block.scss";

interface IUikitBlock {
  title: string;
  codeBlock: string;
  children: ReactNode;
}

export default function UikitBlock({
  title,
  codeBlock,
  children,
}: IUikitBlock) {
  return (
    <div className="uikit-block">
      <Typography variant="h5">{title}</Typography>
      <div>{children}</div>
      <pre>
        <code className="lang-tsx">{codeBlock}</code>
      </pre>
    </div>
  );
}
