const jwt = require('jsonwebtoken');

const DEFAULT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const getJwtSecret = () => {
	const secret = process.env.JWT_SECRET;

	if (secret) return secret;

	if (process.env.NODE_ENV === 'production') {
		throw new Error('JWT_SECRET is required in production');
	}

	return 'dev-jwt-secret-change-me';
};

const signAccessToken = (payload, options = {}) => {
	return jwt.sign(payload, getJwtSecret(), {
		expiresIn: DEFAULT_EXPIRES_IN,
		...options
	});
};

const verifyAccessToken = (token) => {
	return jwt.verify(token, getJwtSecret());
};

const extractBearerToken = (authorizationHeader = '') => {
	const [scheme, token] = authorizationHeader.split(' ');
	if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
	return token;
};

module.exports = {
	signAccessToken,
	verifyAccessToken,
	extractBearerToken
};
