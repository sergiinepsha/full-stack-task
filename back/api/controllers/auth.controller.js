'use strict';

const UserModel = require('../models/user.model');

const ErrorResponse = require('../utils/errorResponse');

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

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check for User
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    // Check is password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    // Create token
    const token = await user.createToken();

    return await res.status(200).json({ id: user._id, email, token });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  const { id } = req.user;

  try {
    await UserModel.clearingToken(id);

    return res.status(204).send();
  } catch (error) {}
};

exports.authorize = async (req, res, next) => {
  try {
    const authorizationHeader = req.get('Authorization');
    const token = authorizationHeader.replace('Bearer ', '');

    const user = await UserModel.getUserByIdFromToken(token);

    if (!user || user.token !== token) {
      throw new ErrorResponse('Invalid token', 401);
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
