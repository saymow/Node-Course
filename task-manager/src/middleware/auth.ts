import { Request, Response, NextFunction, request } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) throw new Error();
    let parts = authorization.split(" ");
    if (parts.length !== 2) throw new Error();
    const [schema, token] = parts;
    if (schema !== "Bearer") throw new Error();

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) throw new Error();

    req.user = user;

    next();
  } catch (error) {
    res.status(401).send();
  }
};

export default auth;
