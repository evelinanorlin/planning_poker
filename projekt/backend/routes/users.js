const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const CryptoJS = require('crypto-js');

// HÄMTA SPECIFIK USER
router.post('/', async (req, res, next) => {
  const { id } = req.body;
  try {
    const user = await UserModel.findById({ _id: id });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err });
  }
});

// SKAPA USER
router.post('/add', async (req, res, next) => {
  console.log(req.body);

  try {
    const user = new UserModel(req.body);
    let encryptPassword = req.body.password;
    encryptPassword = CryptoJS.AES.encrypt(
      user.password,
      'salt key'
    ).toString();
    user.password = encryptPassword;
    await user.save();

    const sendUser = { name: user.name, id: user._id };

    res.status(201).json(sendUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err });
  }
});

// LOGGA IN USER
router.post('/login', async (req, res, next) => {
  const { name, password } = req.body;
  try {
    const user = await UserModel.findOne({ name });

    if (!user) {
      return res.status(400).json({ msg: 'No user found' });
    }

    const decryptPassword = CryptoJS.AES.decrypt(
      user.password,
      'salt key'
    ).toString(CryptoJS.enc.Utf8);

    if (decryptPassword !== password) {
      return res.status(400).json({ msg: 'Incorrect credentials' });
    }

    const sendUser = { name: user.name, id: user._id, admin: user.admin };

    res.status(200).json(sendUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err });
  }
});

module.exports = router;
