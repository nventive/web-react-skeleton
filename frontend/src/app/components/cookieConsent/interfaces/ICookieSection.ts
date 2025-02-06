import type ICookieInfo from "./ICookieInfo";

export default interface ICookieSection {
  id: string;
  title: string;
  description: string[];
  required?: boolean;
  cookies?: ICookieInfo[];
}
