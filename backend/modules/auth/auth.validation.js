const ROLE_SET = new Set(['intern', 'team_lead', 'team_lead_intern', 'manager', 'manager_intern', 'admin', 'cto', 'cfo', 'coo', 'ceo']);

const normalizeRole = (role = '') => String(role).trim().toLowerCase();

const validateEmail = (email = '') => {
	const trimmed = String(email).trim().toLowerCase();
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(trimmed)) throw new Error('Valid email is required');
	return trimmed;
};

const validatePassword = (password = '') => {
	if (typeof password !== 'string' || password.length < 6) {
		throw new Error('Password must be at least 6 characters long');
	}
	return password;
};

const validateRole = (role) => {
	if (!role) return 'intern';
	const normalized = normalizeRole(role);
	if (!ROLE_SET.has(normalized)) {
		throw new Error(`Invalid role. Allowed roles: ${Array.from(ROLE_SET).join(', ')}`);
	}
	return normalized;
};

const validateRegisterInput = ({ email, password, name, role }) => {
	const validatedEmail = validateEmail(email);
	const validatedPassword = validatePassword(password);
	const validatedRole = validateRole(role);

	return {
		email: validatedEmail,
		password: validatedPassword,
		name: name ? String(name).trim() : null,
		role: validatedRole
	};
};

const validateLoginInput = ({ email, password }) => {
	return {
		email: validateEmail(email),
		password: validatePassword(password)
	};
};

module.exports = {
	validateRegisterInput,
	validateLoginInput,
	validateRole,
	normalizeRole,
	ROLE_SET
};
