const { validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const secretKey = "secret_secret";

const getUserById = async (req, res, next) => {
  const uid = req.params.uid;
  try {
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }
    return res.status(200).send({ message: "User Found!", success: true, user });
  } catch (error) {
    return res.status(500).send({ message: error.message, success: false });
  }
};

const newUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new Error("Invalid Data"));
  }
  const { name, email, password, role, department_id } = req.body;

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(500).json({ message: "User already exists with this email", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department_id
    });

    res.status(201).send({ message: "Register Success", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `${error.message}`, success: false });
  }
};

const loginUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new Error("Invalid Data"));
  }

  const { email, password } = req.body;
  try {
    const existingUser = await User.findByEmail(email);
    if (!existingUser) {
      return res.status(404).send({ message: "User not found with this email.", success: false });
    }

    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      return res.status(404).send({ message: "Invalid Password", success: false });
    }

    const token = jwt.sign(
      { email: existingUser.email, userId: existingUser.id, role: existingUser.role },
      secretKey,
      { expiresIn: "1h" }
    );

    // Don't send password back
    delete existingUser.password;

    return res.status(200).send({
      message: "Login Successfull",
      success: true,
      user: existingUser,
      token: token,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, success: false });
  }
};

const displayUser = async (req, res, next) => {
  try {
    const users = await User.findAll();
    return res.status(200).send({ user: users, success: true });
  } catch (error) {
    return res.status(500).send({ message: "Error fetching users", success: false });
  }
};

const editEmployee = async (req, res, next) => {
  const { name, email, role, department_id } = req.body;
  const uid = req.params.uid;

  try {
    const success = await User.update(uid, { name, email, role, department_id });
    if (!success) {
      return res.status(404).json({ message: "Could not find the user", success: false });
    }
    return res.status(200).send({ message: "User detail updated successfully!", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Could not update the user details", success: false });
  }
};

module.exports = {
  newUser,
  loginUser,
  displayUser,
  editEmployee,
  getUserById,
};
