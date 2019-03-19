const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const signs = require('../db/signs');

const router = express.Router();
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

const createDigest = (req, res, next) => {
  const { password } = req.body;
  if (password) {
    User.hashPassword(password)
      .then(digest => {
        req.body.digest = digest;
        return next();
      });
  } else {
    return next();
  }
};

const validateFieldSizes = (req, res, next) => {
  const sizedFields = {
    username: { min: 1 },
    password: { min: 10, max: 72 }
  };

  const objToTest = {};
  Object.keys(sizedFields).forEach(field => {
    if (field in req.body) {
      objToTest[field] = sizedFields[field];
    }
  });

  const tooSmallField = Object.keys(objToTest).find(
    field => 'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );

  const tooLargeField = Object.keys(objToTest).find(
    field => 'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    const num = tooSmallField ? sizedFields[tooSmallField].min : sizedFields[tooLargeField].max;
    const err = new Error('');
    err.status = 422;
    err.reason = 'ValidationError';
    err.message = `Must be at ${tooSmallField ? 'least' : 'most'} ${num} characters long`;
    err.location = tooSmallField || tooLargeField;
    return next(err);
  } else {
    return next();
  }
};

const validateRequiredFields = (req, res, next) => {
  const requiredFields = ['password', 'username'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error('Missing field');
    err.status = 422;
    err.reason = 'ValidationError';
    err.location = missingField;
    return next(err);
  } else {
    return next();
  }
};

const validateStringFields = (req, res, next) => {
  const stringFields = ['name', 'password', 'username'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    const err = new Error('Incorrect field type: expected string');
    err.status = 422;
    err.reason = 'ValidationError';
    err.location = nonStringField;
    return next(err);
  } else {
    return next();
  }
};

const validateTrimmedFields = (req, res, next) => {
  const explicitlyTrimmedFields = ['username', 'password'];
  const fieldsToTest = explicitlyTrimmedFields.filter(field => field in req.body);
  const nonTrimmedField = fieldsToTest.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    const err = new Error('Cannot start or end with whitespace');
    err.status = 422;
    err.reason = 'ValidationError';
    err.location = nonTrimmedField;
    return next(err);
  } else {
    return next();
  }
};

router.post('/',
  validateRequiredFields,
  // validateStringFields must go before the others to ensure they get a string
  validateStringFields,
  validateFieldSizes,
  validateTrimmedFields,
  createDigest,
  (req, res, next) => {
    let { digest, name = '', username } = req.body;
    name = name.trim();

    return User
      .create({
        name,
        password: digest,
        username,
        signs: signs,
      })
      .then(user => res.status(201).json(user))
      .catch(err => {
        if (err.code === 11000) {
          err = new Error('Username already taken');
          err.status = 422;
          err.reason = 'ValidationError';
          err.location = 'username';
        }
        next(err);
      });
  });

router.get('/question', jwtAuth, (req, res, next) => {
  const userId = req.user.id;
  return User.findById(userId)
    .then(user => {
      res.json({ sign: `${req.protocol}://${req.get('host')}/signs/${user.signs[0].sign}` });
    })
    .catch(err => next(err));
});

router.post('/guess', jwtAuth, (req, res, next) => {
  const userId = req.user.id;
  const { guess } = req.body;
  let answer, correct;

  if (!guess) {
    const err = new Error('Missing `guess` in request body');
    err.status = 400;
    return next(err);
  }

  return User.findById(userId)
    .then(user => {
      answer = user.signs[0].answer;
      correct = guess === answer ? true : false;
      const signs = [...user.signs.slice(1), ...user.signs.slice(0, 1)];
      return User.updateOne({ _id: userId }, { signs });
    })
    .then(() => res.json({ answer, correct }))
    .catch(err => next(err));
});

module.exports = router;