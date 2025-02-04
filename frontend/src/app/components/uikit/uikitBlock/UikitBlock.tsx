import Button from "@components/button/Button";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Highlight, themes } from "prism-react-renderer";
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

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
    toast.success(t("uikit__clipboard_copy"));
  };

  return (
    <Box
      component="div"
      id={id}
      // this className is used to generate the nav items on the UiKit page
      className="uikit-block"
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(1),
        marginBottom: theme.spacing(8),
      })}
    >
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        {title}
      </Typography>
      {children}
      {codeBlock && (
        <Highlight theme={themes.vsDark} code={codeBlock} language="tsx">
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <Box
              component="pre"
              style={style}
              sx={(theme) => ({
                borderRadius: theme.customProperties.borderRadius.sm,
                padding: theme.spacing(2),
                position: "relative",
              })}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}

              <Box
                component="div"
                sx={(theme) => ({
                  top: theme.spacing(1),
                  right: theme.spacing(1),
                  position: "absolute",
                })}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onClickCopyBtn(codeBlock)}
                >
                  Copy
                </Button>
              </Box>
            </Box>
          )}
        </Highlight>
      )}
    </Box>
  );
}
