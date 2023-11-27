import { JwtPayload } from 'jsonwebtoken';

export interface DecodedUser extends JwtPayload {
  username: string;
}
