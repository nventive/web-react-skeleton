export default interface IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token?: string;
  refreshToken?: string;
}
