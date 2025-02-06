import { Box, CircularProgress, useTheme } from "@mui/material";
import { type RefObject, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import classes from "./loading.module.css";

interface ILoading {
  isLoading?: boolean;
}

export default function Loading({ isLoading = true }: ILoading) {
  const theme = useTheme();
  const nodeRef: RefObject<HTMLDivElement | null> = useRef(null);

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
      {isLoading && (
        <CSSTransition
          classNames={{
            enter: classes["entet"],
            enterActive: classes["enter-active"],
            exit: classes["exit"],
            exitActive: classes["exitActive"],
          }}
          timeout={500}
          nodeRef={nodeRef}
        >
          <Box
            ref={nodeRef}
            className={classes["loading"]}
            sx={(theme) => ({
              backgroundColor: theme.palette.common.white,
              zIndex: theme.zIndex.loading,
            })}
          >
            <div className={classes["spinner"]}>
              <CircularProgress size="3rem" />
            </div>
          </Box>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
}
