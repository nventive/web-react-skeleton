import classnames from "classnames";
import { ReactNode } from "react";
import "./typography.scss";

interface ITypography {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

function Heading1({ children, className, as: Component = "h1" }: ITypography) {
  return (
    <Component className={classnames("typography__heading1", className)}>
      {children}
    </Component>
  );
}

function Heading2({ children, className, as: Component = "h2" }: ITypography) {
  return (
    <Component className={classnames("typography__heading2", className)}>
      {children}
    </Component>
  );
}

function Heading3({ children, className, as: Component = "h3" }: ITypography) {
  return (
    <Component className={classnames("typography__heading3", className)}>
      {children}
    </Component>
  );
}

function Heading4({ children, className, as: Component = "h4" }: ITypography) {
  return (
    <Component className={classnames("typography__heading4", className)}>
      {children}
    </Component>
  );
}

function Heading5({ children, className, as: Component = "h5" }: ITypography) {
  return (
    <Component className={classnames("typography__heading5", className)}>
      {children}
    </Component>
  );
}

function Heading6({ children, className, as: Component = "h6" }: ITypography) {
  return (
    <Component className={classnames("typography__heading6", className)}>
      {children}
    </Component>
  );
}

function Caption({ children, className, as: Component = "p" }: ITypography) {
  return (
    <Component className={classnames("typography__caption", className)}>
      {children}
    </Component>
  );
}

function Overline({ children, className, as: Component = "p" }: ITypography) {
  return (
    <Component className={classnames("typography__overline", className)}>
      {children}
    </Component>
  );
}

function Subtitle1({ children, className, as: Component = "p" }: ITypography) {
  return (
    <Component className={classnames("typography__subtitle1", className)}>
      {children}
    </Component>
  );
}

function Subtitle2({ children, className, as: Component = "p" }: ITypography) {
  return (
    <Component className={classnames("typography__subtitle2", className)}>
      {children}
    </Component>
  );
}

function Body1({ children, className, as: Component = "p" }: ITypography) {
  return (
    <Component className={classnames("typography__body1", className)}>
      {children}
    </Component>
  );
}

function Body2({ children, className, as: Component = "p" }: ITypography) {
  return (
    <Component className={classnames("typography__body2", className)}>
      {children}
    </Component>
  );
}

function ButtonSmall({
  children,
  className,
  as: Component = "span",
}: ITypography) {
  return (
    <Component className={classnames("typography__button-small", className)}>
      {children}
    </Component>
  );
}

function ButtonMedium({
  children,
  className,
  as: Component = "span",
}: ITypography) {
  return (
    <Component className={classnames("typography__button-medium", className)}>
      {children}
    </Component>
  );
}

function ButtonLarge({
  children,
  className,
  as: Component = "span",
}: ITypography) {
  return (
    <Component className={classnames("typography__button-large", className)}>
      {children}
    </Component>
  );
}

const Typography = {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Caption,
  Overline,
  Subtitle1,
  Subtitle2,
  Body1,
  Body2,
  ButtonSmall,
  ButtonMedium,
  ButtonLarge,
};

export default Typography;
