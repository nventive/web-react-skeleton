import { ReactNode } from "react";
import { Highlight, themes } from "prism-react-renderer";
import "./uikit-block.scss";
import Typography from "@components/typography/Typography";
import Button from "@components/button/Button";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface IUikitBlock {
  id: string;
  title: string;
  codeBlock?: string;
  children: ReactNode;
}

export default function UikitBlock({
  id,
  title,
  codeBlock,
  children,
}: IUikitBlock) {
  const { t } = useTranslation();

  const onClickCopyBtn = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast.success(t("global__clipboard_copy"));
  };

  return (
    <div className="uikit-block" id={id}>
      <Typography.Heading4>{title}</Typography.Heading4>
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

              <div className="uikit-block__copy-btn">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onClickCopyBtn(codeBlock)}
                >
                  Copy
                </Button>
              </div>
            </pre>
          )}
        </Highlight>
      )}
    </div>
  );
}
