import Spinner from "@components/spinner/Spinner";
import { RefObject, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import classNames from "classnames";

import "./loading.scss";

interface ILoading {
  isLoading?: boolean;
  fullscreen?: boolean;
}

export default function Loading({
  isLoading = true,
  fullscreen = false,
}: ILoading) {
  const nodeRef: RefObject<HTMLDivElement> = useRef(null);

  return (
    <TransitionGroup>
      {isLoading && (
        <CSSTransition
          classNames={{
            enter: "loading__enter",
            enterActive: "loading__enter-active",
            exit: "loading__exit",
            exitActive: "loading__exit-active",
          }}
          timeout={500}
          nodeRef={nodeRef}
        >
          <div
            ref={nodeRef}
            className={classNames("loading", {
              loading__fullscreen: fullscreen,
            })}
          >
            <div className="loading__spinner">
              <Spinner />
            </div>
          </div>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
}
