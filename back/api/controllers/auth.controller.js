'use strict';

const UserModel = require('../models/user.model');

// TODO: validateCredentialsReg & validateUniqueEmail
exports.register = async (req, res, next) => {
  try {
    // Create user
    const user = await UserModel.create(req.body);

    const { _id, email } = user;

    return await res.status(201).json({ id: _id, email });
  } catch (error) {
    next(error);
  }
};

// TODO: validateCredentialsLog
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check for User
    const user = await UserModel.findOne({ email });

    if (!user) {
      //TODO: ErrorHandler
      throw new Error();
    }

    // Check is password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      //TODO: ErrorHandler
      throw new Error();
    }

    // Create token
    const token = await user.createToken();

    return await res.status(200).json({ id: user._id, email, token });
  } catch (error) {
    next(error);
  }
};

//TODO: autorize
exports.logout = async (req, res, next) => {
  //TODO: get user id of authorize
  const id = '6054785c6f09b56588ca7fa2';

  try {
    await UserModel.clearingToken(id);

    return res.status(204).send();
  } catch (error) {}
};