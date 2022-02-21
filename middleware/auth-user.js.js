"use strict";

const auth = require("basic-auth");
const { User } = require("../models");
const bcrypt = require("bcryptjs");

exports.authenticateUser = async (req, res, next) => {
  const credentials = auth(req);
  next();
};
