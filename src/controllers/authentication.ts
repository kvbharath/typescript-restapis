import express from "express";
import { getUserByEmail, createUser } from "../db/users";
import { authentication, random } from "../helpers/index";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400);
    }
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    // console.log(user);

    if (!user) {
      return res.status(400);
    }
    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      return res.status(403).send("Invalid password");
    }
    const salt = random();

    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();
    res.cookie("RESTAPIS-NODE", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    console.log(req.body);

    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400);
    }
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400);
    }
    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};
