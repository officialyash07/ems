const { extractBearerToken, verifyAccessToken } = require('../utils/jwt');

const authenticate = (req, res, next) => {
	try {
		const token = extractBearerToken(req.headers.authorization);

		if (!token) {
			return res.status(401).json({ error: 'Authentication required' });
		}

		const decoded = verifyAccessToken(token);
		req.user = {
			id: decoded.id,
			email: decoded.email,
			role: decoded.role
		};

		return next();
	} catch (error) {
		return res.status(401).json({ error: 'Invalid or expired token' });
	}
};

module.exports = {
	authenticate
};
