const { User, Todo, Memo } = require('../../models');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { success, failed } = {
	success: 'success',
	failed: 'failed',
};

const errorResponse = (err, res) => {
	console.log(err);
	res.status(500).send({ error: { message: 'Server Error' } });
};

//* ------------------------------  REGISTER ----------------------------------- *//

exports.register = async (req, res) => {
	try {
		const { body } = req;
		const schema = Joi.object({
			name: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string().min(6).required(),
			pin: Joi.string().min(6).required(),
		});

		const { error } = schema.validate(body, { abortEarly: false });

		if (error) {
			return res.status(400).json({
				status: failed,
				message: 'Failed to register',
				errors: error.details.map((detail) => detail.message),
			});
		}

		const { email, password, pin } = body;

		const checkEmail = await User.findOne({
			where: {
				email,
			},
		});

		if (checkEmail) {
			return res.status(400).json({
				status: failed,
				message: 'This email has already registered',
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const hashedPin = await bcrypt.hash(pin, 10);

		const user = await User.create({
			...body,
			password: hashedPassword,
			pin: hashedPin,
			avatar: null,
		});

		await Todo.create({ todo: 'Drink some water', status: 0, userId: user.id });
		await Memo.create({
			title: 'I got you some memo!',
			memo: 'What you got for me?',
			status: 0,
			userId: user.id,
		});
		await Memo.create({
			title: 'Sshhhh!',
			memo: 'Keep this secret between us',
			status: 1,
			userId: user.id,
		});

		const payload = { id: user.id };
		const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
			expiresIn: '24h',
		});

		res.status(201).send({
			status: success,
			message: 'You have successfully registered',
			data: {
				id: user.id,
				name: user.name,
				email: user.email,
				avatar: user.avatar,
				token,
			},
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//* -------------------------------- LOGIN ----------------------------------- *//

exports.login = async (req, res) => {
	try {
		const { body } = req;
		const schema = Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().min(6).required(),
		});

		const { error } = schema.validate(body, { abortEarly: false });

		if (error) {
			return res.status(400).json({
				status: failed,
				message: 'Your email or password is invalid',
				errors: error.details.map((detail) => detail.message),
			});
		}

		const { email, password } = body;

		const user = await User.findOne({
			where: {
				email,
			},
		});

		if (!user) {
			return res.status(400).json({
				status: failed,
				message: 'Your email or password is invalid',
			});
		}

		const checkPassword = await bcrypt.compare(password, user.password);

		if (!checkPassword) {
			return res.status(400).json({
				status: failed,
				message: 'Your email or password is invalid',
			});
		}

		const payload = { id: user.id };

		let token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
			expiresIn: '24h',
		});

		res.send({
			status: success,
			message: 'You have successfully login',
			data: {
				id: user.id,
				name: user.name,
				email: user.email,
				avatar: user.avatar,
				token,
			},
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Check User Pin --------------------------------------------*//
exports.checkPin = async (req, res) => {
	try {
		const { id } = req.user;
		const { body } = req;
		const schema = Joi.object({
			pin: Joi.string().min(6).required(),
		});

		const { error } = schema.validate(body, { abortEarly: false });

		if (error) {
			return res.status(400).json({
				status: failed,
				message: 'Your pin is invalid',
				errors: error.details.map((detail) => detail.message),
			});
		}

		const { pin } = body;

		const user = await User.findOne({
			where: {
				id,
			},
		});

		if (!user) {
			return res.status(400).json({
				status: failed,
				message: 'Your pin is invalid',
			});
		}

		const checkPin = await bcrypt.compare(pin, user.pin);

		if (!checkPin) {
			return res.status(400).json({
				status: failed,
				message: 'Your pin is invalid',
			});
		}

		res.send({
			status: success,
			message: 'Authentication success',
			data: {
				isCorrect: true,
			},
		});
	} catch (err) {
		errorResponse(err, res);
	}
};
