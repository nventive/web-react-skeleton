import Typography from "@mui/material/Typography";
import { RefObject, useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { css } from "@mui/material-pigment-css";

interface IErrorBox {
  message: string;
}

const enter = css`
  opacity: 0;
`;

const enterActive = css(({ theme }) => ({
  opacity: 1,
  transition: `opacity ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeIn}`,
}));

const exit = css`
  opacity: 0;
`;

const exitActive = css(({ theme }) => ({
  opacity: 0,
  transition: `opacity ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeOut}`,
}));

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
            enter: enter,
            enterActive: enterActive,
            exit: exit,
            exitActive: exitActive,
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
