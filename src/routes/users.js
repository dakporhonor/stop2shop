const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {
  check,
  validationResult
} = require('express-validator');
const User = require('../models/user');
const auth = require('../middleware/auth')


// Create User
router.post('/register', [
  check("name", "Name is required")
  .not()
  .isEmpty(),
  check("email", "Email is requied").isEmail(),
  check(
    "password",
    "Password with 6 or more characters is required"
  ).isLength({
    min: 6
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  try {
    const {
      email,
      password,
      name
    } = req.body
    let user = await User.findOne({
      email
    })
    if (user) {
      return res.status(401).json({
        msg: 'User email already registered'
      })
    }

    user = new User({
      name,
      email,
      password
    })
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    await user.save()

    const payload = {
      user: {
        id: user.id
      }
    }

    const token = await jwt.sign(payload, config.get('JWT_SECRET'), {
      expiresIn: 3600
    })

    res.json({
      token
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})
// Login User
router.post('/login', [
  check("email", "Please Enter a valid email").isEmail(),
  check("password", "Please Enter a password").exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  try {
    const {
      email,
      password
    } = req.body
    const user = await User.findOne({
      email
    })
    if (!user) {
      return res.status(400).json({
        msg: 'Invalid email or password'
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({
        msg: 'Invalid email or password'
      })
    }

    const payload = {
      user: {
        id: user.id
      }
    }

    const token = await jwt.sign(payload, config.get('JWT_SECRET'), {
      expiresIn: 3600
    })
    res.status(200).json({
      token
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }

})
// Get Logged In User 

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({
        msg: 'User not found'
      })
    }
    res.status(200).json(user)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})


module.exports = router