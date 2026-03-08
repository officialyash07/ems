const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const { signAccessToken } = require('../../utils/jwt');
const { validateRegisterInput, validateLoginInput } = require('./auth.validation');
const TimeLog = require('../../models/TimeLog');
const { getISTTime } = require('../../utils/time');

const toPublicUser = (user) => ({
	id: user.id,
	email: user.email,
	name: user.name,
	role: user.role || 'intern',
	createdAt: user.createdAt,
	updatedAt: user.updatedAt
});

const buildAuthResponse = (user) => {
	const safeUser = toPublicUser(user);
	const token = signAccessToken({
		id: safeUser.id,
		email: safeUser.email,
		role: safeUser.role
	});

	return { token, user: safeUser };
};

const register = async (payload) => {
	const { email, password, name, role } = validateRegisterInput(payload);

	const existingUser = await User.findOne({ email });
	if (existingUser) throw new Error('Email is already registered');

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await User.create({
		email,
		name,
		role,
		password: hashedPassword
	});

	return buildAuthResponse(user);
};

const login = async (payload, ipAddress, userAgent) => {
	const { email, password } = validateLoginInput(payload);

	const user = await User.findOne({ email });
	if (!user || !user.password) throw new Error('Invalid email or password');

	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) throw new Error('Invalid email or password');

	// Record login time
	try {
		await TimeLog.create({
			userId: user._id,
			loginTime: getISTTime(),
			ipAddress,
			userAgent,
			isActive: true
		});
	} catch (error) {
		console.error('[auth-service] Failed to record login time:', error.message);
		// Don't fail the login if time tracking fails
	}

	return buildAuthResponse(user);
};

const getMe = async (userId) => {
	const user = await User.findById(userId);
	if (!user) throw new Error('User not found');
	return toPublicUser(user);
};

module.exports = {
	register,
	login,
	getMe
};
