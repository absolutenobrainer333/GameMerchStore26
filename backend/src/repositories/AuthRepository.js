const { Op } = require('sequelize')
const { DbContext } = require('../dbcontext/sequelize')

module.exports = {
	getByEmail: async (email) =>
		await DbContext.User.findOne({ where: { email } }),

	checkUserExisted: async (user) =>
		(await DbContext.User.findOne({
			where: {
				[Op.or]: [{ username: user.username }, { email: user.email }],
			},
		})) !== null,

	register: async (user) => await DbContext.User.create({ ...user }),
}
