import { Box, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { type RefObject, useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import classes from "./errorHelperText.module.css";

interface IErrorBox {
  message: string;
}

export default function ErrorHelperText({ message }: IErrorBox) {
  const theme = useTheme();
  const [activeMessage, setActiveMessage] = useState<string | undefined>(
    undefined,
  );

  const nodeRef: RefObject<HTMLDivElement | null> = useRef(null);

  useEffect(() => setActiveMessage(message), [message]);

  return (
    <TransitionGroup
      component="div"
      style={
        {
          "--transition-duration": `${theme.transitions.duration.short}ms`,
          "--transition-easing-in": theme.transitions.easing.easeIn,
          "--transition-easing-out": theme.transitions.easing.easeOut,
        } as React.CSSProperties
      }
    >
      {activeMessage && (
        <CSSTransition
          classNames={{
            enter: classes["entet"],
            enterActive: classes["enter-active"],
            exit: classes["exit"],
            exitActive: classes["exitActive"],
          }}
          timeout={350}
          nodeRef={nodeRef}
        >
          <Box
            component="div"
            ref={nodeRef}
            sx={(theme) => ({
              marginTop: theme.spacing(0),
              marginLeft: theme.spacing(1),
              color: theme.palette.error.main,
            })}
          >
            <Typography variant={"caption"}>{activeMessage}</Typography>
          </Box>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
}
