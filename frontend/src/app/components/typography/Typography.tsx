import classnames from "classnames";
import { ReactNode } from "react";
import "./typography.scss";

interface ITypography {
  children: ReactNode;
  className?: string;
}

function Heading1({ children, className }: ITypography) {
  return (
    <h1 className={classnames("typography__heading1", className)}>
      {children}
    </h1>
  );
}

function Heading2({ children, className }: ITypography) {
  return (
    <h2 className={classnames("typography__heading2", className)}>
      {children}
    </h2>
  );
}

function Heading3({ children, className }: ITypography) {
  return (
    <h3 className={classnames("typography__heading3", className)}>
      {children}
    </h3>
  );
}

function Heading4({ children, className }: ITypography) {
  return (
    <h4 className={classnames("typography__heading4", className)}>
      {children}
    </h4>
  );
}

function Heading5({ children, className }: ITypography) {
  return (
    <h5 className={classnames("typography__heading5", className)}>
      {children}
    </h5>
  );
}

function Heading6({ children, className }: ITypography) {
  return (
    <h6 className={classnames("typography__heading6", className)}>
      {children}
    </h6>
  );
}

function Subtitle1({ children, className }: ITypography) {
  return (
    <p className={classnames("typography__subtitle1", className)}>{children}</p>
  );
}

function Subtitle2({ children, className }: ITypography) {
  return (
    <p className={classnames("typography__subtitle2", className)}>{children}</p>
  );
}

function Body1({ children, className }: ITypography) {
  return (
    <p className={classnames("typography__body1", className)}>{children}</p>
  );
}

function Body2({ children, className }: ITypography) {
  return (
    <p className={classnames("typography__body2", className)}>{children}</p>
  );
}

function Caption({ children, className }: ITypography) {
  return (
    <p className={classnames("typography__caption", className)}>{children}</p>
  );
}

function Overline({ children, className }: ITypography) {
  return (
    <h5 className={classnames("typography__overline", className)}>
      {children}
    </h5>
  );
}

function ButtonSmall({ children, className }: ITypography) {
  return (
    <span className={classnames("typography__button-small", className)}>
      {children}
    </span>
  );
}

function ButtonMedium({ children, className }: ITypography) {
  return (
    <span className={classnames("typography__button-medium", className)}>
      {children}
    </span>
  );
}

function ButtonLarge({ children, className }: ITypography) {
  return (
    <span className={classnames("typography__button-large", className)}>
      {children}
    </span>
  );
}

const Typography = {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Subtitle1,
  Subtitle2,
  Body1,
  Body2,
  Caption,
  Overline,
  ButtonSmall,
  ButtonMedium,
  ButtonLarge,
};

export default Typography;
