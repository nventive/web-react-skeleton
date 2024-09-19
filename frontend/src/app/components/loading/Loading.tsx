import Spinner from "@components/spinner/Spinner";
import { RefObject, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import classes from "./loading.module.css";

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
            enterActive: classes["enter-active"],
            exit: classes["exit"],
            exitActive: classes["exit-active"],
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
