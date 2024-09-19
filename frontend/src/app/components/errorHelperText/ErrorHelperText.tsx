import Typography from "@mui/material/Typography";
import { RefObject, useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import classes from "./error-helper-text.module.css";

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
            enter: classes["enter"],
            enterActive: classes["enter-active"],
            exit: classes["exit"],
            exitActive: classes["exit-active"],
          }}
          timeout={350}
          nodeRef={nodeRef}
        >
          <div
            ref={nodeRef}
            sx={(theme) => ({
              marginTop: theme.spacing(0),
              marginLeft: theme.spacing(1),
              color: theme.palette.error.main,
            })}
          >
            <Typography variant={"caption"}>{activeMessage}</Typography>
          </div>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
}
