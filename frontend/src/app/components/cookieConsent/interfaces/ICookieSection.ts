import ICookieInfo from "@containers/cookieConsent/interfaces/ICookieInfo";

export default interface ICookieSection {
  id: string;
  title: string;
  description: string[];
  required?: boolean;
  cookies?: ICookieInfo[];
}
