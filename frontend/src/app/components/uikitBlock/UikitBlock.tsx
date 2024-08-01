import { ReactNode } from "react";
import { Typography } from "@mui/material";
import { Highlight, themes } from "prism-react-renderer";
import "./uikit-block.scss";

interface IUikitBlock {
  title: string;
  codeBlock?: string;
  children: ReactNode;
}

export default function UikitBlock({
  title,
  codeBlock,
  children,
}: IUikitBlock) {
  return (
    <div className="uikit-block">
      <Typography variant="h4">{title}</Typography>
      {children}
      {codeBlock && (
        <Highlight theme={themes.vsDark} code={codeBlock} language="tsx">
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre style={style} className="uikit-block__pre">
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      )}
    </div>
  );
}
