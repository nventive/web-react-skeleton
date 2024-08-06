import classnames from "classnames";
import { ReactNode } from "react";
import "./layout.scss";

interface ILayout {
  children: ReactNode;
  className?: string;
}

function Container({ children, className }: ILayout) {
  return (
    <main className={classnames("layout__container", className)}>
      <div className="layout__container-content">{children}</div>
    </main>
  );
}

function Auth({ children, className }: ILayout) {
  return (
    <main className={classnames("layout__auth", className)}>
      <div className="layout__auth-content">{children}</div>
    </main>
  );
}

const Layout = {
  Auth,
  Container,
};

export default Layout;
