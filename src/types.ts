export interface AuthState {
  loading: boolean;
  error: Error | null;
  user: User | null;
  passwordChangeRequired: boolean;
  passwordUpdated: boolean;
}

export interface User {
  name: string;
  photoUrl: string;
  isDisabled: boolean;
  lastLoggedIn: string;
  lastPasswordChanged: string;
  email: string;
  noOfDaysLeftToChangePassword: number;
  id: string;
  token: string;
  expiresIn: string;
  passwordChangeRequired: boolean;
}

export interface Error {
  message: string;
  statusCode: number;
  requestStatus: "Fail";
}
