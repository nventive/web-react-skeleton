import { ReactNode } from "react";
import { Typography } from "@mui/material";

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
    <div className="flex-column gap-xs">
      <Typography variant="h5">{title}</Typography>
      {children}
      <pre>
        <code className="lang-tsx">{codeBlock}</code>
      </pre>
    </div>
  );
}
