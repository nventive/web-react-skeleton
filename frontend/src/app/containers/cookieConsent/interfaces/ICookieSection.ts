import ICookieInfo from "@containers/cookieConsent/interfaces/ICookieInfo";

export default interface ICookieSection {
  id: string;
  title: string;
  description: Array<string>;
  required?: boolean;
  cookies?: Array<ICookieInfo>;
}
