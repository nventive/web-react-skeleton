import Spinner from "@components/spinner/Spinner";
import { RefObject, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import classes from "./loading.module.css";
import { css } from "@mui/material-pigment-css";

const enterActive = css(({ theme }) => ({
  opacity: 1,
  transition: `opacity ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeIn}`,
}));

const exitActive = css(({ theme }) => ({
  opacity: 0,
  transition: `opacity ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeOut}`,
}));

interface ILoading {
  isLoading?: boolean;
}

export default function Loading({ isLoading = true }: ILoading) {
  const nodeRef: RefObject<HTMLDivElement> = useRef(null);

  return (
    <TransitionGroup>
      {isLoading && (
        <CSSTransition
          classNames={{
            enter: classes["enter"],
            enterActive: enterActive,
            exit: classes["exit"],
            exitActive: exitActive,
          }}
          timeout={500}
          nodeRef={nodeRef}
        >
          <div
            ref={nodeRef}
            className={classes["loading"]}
            sx={(theme) => ({
              backgroundColor: theme.palette.common.white,
              zIndex: theme.zIndex.loading,
            })}
          >
            <div className={classes["spinner"]}>
              <Spinner />
            </div>
          </div>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
}
