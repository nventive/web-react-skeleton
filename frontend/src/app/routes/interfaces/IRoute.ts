import { LazyExoticComponent } from "react";

export type IPaths = {
  [key: string]: string;
  en: string;
  fr: string;
};

export interface IRoute {
  name: string;
  component: LazyExoticComponent<() => JSX.Element>;
  paths: IPaths;
  getPath?: (locale: string, id: string) => string;
}
