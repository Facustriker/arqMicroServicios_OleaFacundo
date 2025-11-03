export interface TokenPayload {
  tokenID: string;
  userID: string;
}

export interface UserData {
  id: string;
  name: string;
  login: string;
  permissions: string[];
  enabled: boolean;
}