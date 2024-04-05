const db = require('../models/index');
const User = db.Users;
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'
  exports.register = async (req, res) => {
    console.log(req.body)  
    const { username, password: plainTextPassword, firstName, lastName, address } = req.body
    
        if (!username || typeof username !== 'string') {
            return res.json({ status: 'error', error: 'Invalid username' })
        }
    
        if (!plainTextPassword || typeof plainTextPassword !== 'string') {
            return res.json({ status: 'error', error: 'Invalid password' })
        }
    
        if (plainTextPassword.length < 5) {
            return res.json({
                status: 'error',
                error: 'Password too small. Should be atleast 6 characters'
            })
        }
    
        const password = await bcrypt.hash(plainTextPassword, 10)
    
        try {
            const response = await User.create({
                username,
                password,
                firstName,
                lastName,
                address

            })
            console.log('User created successfully: ', response)
        } catch (error) {
            if (error.code === 11000) {
                // duplicate key
                return res.json({ status: 'error', error: 'Username already in use' })
            }
            throw error
        }
        res.json({ status: 'ok' })
  }
  exports.login = async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username }).lean()
    if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}
    if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token, 
        username:user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
     })
	}
    res.json({ status: 'error', error: 'Invalid username/password' })
  }