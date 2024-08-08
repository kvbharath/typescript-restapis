import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;
    if (!currentUserId) {
      return res.status(403).send("Id Not Found");
    }
    if (currentUserId.toString() !== id) {
      return res.status(403).send("Unauthorized");
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send("Internal Server Error");
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["RESTAPIS-NODE"];
    if (!sessionToken) {
      return res.status(401).send("Unauthorized");
    }
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(401).send("Unauthorized");
    }
    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};
