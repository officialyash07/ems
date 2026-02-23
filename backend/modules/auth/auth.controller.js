const authService = require('./auth.service');

exports.register = async (req, res) => {
	try {
		const result = await authService.register(req.body);
		return res.status(201).json(result);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

exports.login = async (req, res) => {
	try {
		const result = await authService.login(req.body);
		return res.status(200).json(result);
	} catch (error) {
		return res.status(401).json({ error: error.message });
	}
};

exports.me = async (req, res) => {
	try {
		const user = await authService.getMe(req.user.id);
		return res.status(200).json(user);
	} catch (error) {
		return res.status(404).json({ error: error.message });
	}
};
