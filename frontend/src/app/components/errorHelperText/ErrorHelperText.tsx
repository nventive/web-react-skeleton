import "./error-helper-text.scss";
import Typography from "@components/typography/Typography";
import { RefObject, useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

interface IErrorBox {
  message: string;
}

export default function ErrorHelperText({ message }: IErrorBox) {
  const [activeMessage, setActiveMessage] = useState<string | undefined>(
    undefined,
  );

  const nodeRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => setActiveMessage(message), [message]);

  return (
    <TransitionGroup>
      {activeMessage && (
        <CSSTransition
          classNames={{
            enter: "error-helper-text__enter",
            enterActive: "error-helper-text__enter-active",
            exit: "error-helper-text__exit",
            exitActive: "error-helper-text__exit-active",
          }}
          timeout={350}
          nodeRef={nodeRef}
        >
          <div ref={nodeRef} className="error-helper-text__container">
            <Typography.Caption>{activeMessage}</Typography.Caption>
          </div>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
}
