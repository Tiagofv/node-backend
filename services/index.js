const UsersModel = require('../database/models/users')
module.exports = getUserDetails = async (data) => {
	const user = await UsersModel.find({email: data.email})
	return user
}