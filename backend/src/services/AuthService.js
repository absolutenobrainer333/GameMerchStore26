const bcrypt = require('bcryptjs')
const AuthRepository = require('../repositories/AuthRepository')
const TokenHandler = require('../utils/TokenHandler')

module.exports = {
	login: async (req, res) => {
		try {
			const { email, password } = req.body
			if (!email || !password) {
				return res.status(400).json({ error: 'Email and password are required' })
			}

			const user = await AuthRepository.getByEmail(email)
			if (!user || !(await bcrypt.compare(password, user.password))) {
				return res.status(400).json({ error: 'Invalid email or password' })
			}

			const token = TokenHandler.createToken(user)
			return res.status(200).json({ token })
		} catch (error) {
			return res.status(500).json({ error: 'Internal server error' })
		}
	},

	register: async (req, res) => {
		try {
			const { username, email, password } = req.body
			if (!username || !email || !password) {
				return res.status(400).json({ error: 'All fields are required' })
			}
			if (password.length < 6) {
				return res.status(400).json({ error: 'Password must be at least 6 characters' })
			}

			if (await AuthRepository.checkUserExisted({ username, email })) {
				return res.status(409).json({ error: 'Username or email already exists' })
			}

			const hashedPassword = await bcrypt.hash(password, 10)
			await AuthRepository.register({ username, email, password: hashedPassword })
			return res.status(201).json({ success: 'User successfully registered' })
		} catch (error) {
			return res.status(500).json({ error: 'Internal server error' })
		}
	},
}
