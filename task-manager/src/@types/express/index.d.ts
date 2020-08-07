import { iUser } from "../../models/user";

declare global {
  namespace Express {
    interface Request {
      user: iUser;
    }
  }
}
