import { Request, Response } from "express";
import sharp from "sharp";

import User from "../models/user";
import { sendWelcomeEmail, sendFarewellEmail } from "../email/account";

type validUpdatesProps = "name" | "email" | "password" | "age";

export default {
  async store(req: Request, res: Response) {
    const user = new User(req.body);
    try {
      await user.save();

      const { email, name } = user;

      sendWelcomeEmail({ email, name });

      const token = await user.generateAuthToken();

      res.status(201).send({ user, token });
    } catch (error) {
      res.status(400).send();
    }
  },

  async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findByCredentials(email, password);

      const token = await user.generateAuthToken();

      res.send({ user: user, token });
    } catch (error) {
      console.log(error);
      res.status(401).send(error);
    }
  },

  async logOut(req: Request, res: Response) {
    try {
      req.user.tokens.map(
        (token: any) => token.token !== req.headers["authorization"]
      );

      await req.user.save();

      res.send();
    } catch (e) {
      res.status(500).send();
    }
  },

  async logOutAll(req: Request, res: Response) {
    try {
      req.user.tokens = [];
      await req.user.save();

      res.send();
    } catch (e) {
      res.status(500).send();
    }
  },

  async update(req: Request, res: Response) {
    const updates = Object.keys(req.body);
    const validUpdates = ["name", "age", "email", "password"];
    const isInvalid = updates.some((key) => !validUpdates.includes(key));

    if (isInvalid) return res.status(400).send({ error: "Invalid updates!" });

    try {
      // const user: PropsUpdateUser | null = await User.findById(_id);
      const user: any = req.user;

      updates.forEach((key) => {
        user[key as validUpdatesProps] = req.body[key];
      });

      await user.save();

      // findByIdAndUpdate bypasses mongoose middlewares, executing directly on mongodb api,
      // thus we can have a possibly password change and not being able to hash it
      // const user = await User.findByIdAndUpdate(_id, req.body, {
      //   new: true,
      //   runValidators: true,
      // });

      res.send(user);
    } catch (error) {
      res.status(400).send();
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { email, name } = req.user;

      await req.user.remove();

      sendFarewellEmail({ email, name });

      res.send(req.user);
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  },

  async me(req: Request, res: Response) {
    res.send(req.user);
  },

  async storeimage(req: Request, res: Response) {
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 250,
        height: 250,
      })
      .png()
      .toBuffer();
    req.user.avatar = buffer;

    await req.user.save();

    res.send();
  },

  async deleteImage(req: Request, res: Response) {
    req.user.avatar = undefined;
    await req.user.save();

    res.status(200).send();
  },

  async getImage(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await User.findById(id);

      if (!user || !user.avatar) throw new Error();

      res.set("Content-Type", "image/jpg");
      res.send(user.avatar);
    } catch (e) {
      res.status(404).send();
    }
  },
};
