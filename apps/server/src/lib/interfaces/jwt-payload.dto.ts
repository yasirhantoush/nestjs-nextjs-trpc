export interface JWTPayload {
  userId: string;
  isAdmin: boolean;
  canAddFamily: boolean;
  canTransfer: boolean;
  roles: string[];
}