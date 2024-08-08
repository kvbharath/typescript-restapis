import express from "express";

import { deleteUserById, getUserById, getUSers } from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUSers();
    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deleteUser = await deleteUserById(id);
    return res.json(deleteUser);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!username) {
      return res.status(400).send("Username is required");
    }
    const user = await getUserById(id);
    user.username = username;
    await user.save();
    return res.status(200).send("user Updated successfully").end();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
