const { Todo } = require('../../models');

//* Re-Useable Error response
const errorResponse = (err, res) => {
	console.log(err);
	res.status(500).send({ error: { message: 'Server Error' } });
};

//*-------------------------------------------- Get All User Todo --------------------------------------------*//
exports.getAllUserTodos = async (req, res) => {
	try {
		const { id } = req.user;
		const todos = await Todo.findAll({ where: { userId: id }, attributes: ['id', 'todo', 'status'] });

		if (todos.length < 1) {
			return res.status(204).send({
				status: 'failed',
				message: 'No Todo',
				data: {
					todos: [],
				},
			});
		}

		res.send({
			status: 'success',
			message: 'Get User Todos Success',
			data: { todos },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Add User Todo --------------------------------------------*//
exports.addUserTodo = async (req, res) => {
	try {
		const { body, user } = req;
		const userId = user.id;

		const todo = await Todo.create({ ...body, userId });

		res.status(201).send({
			status: 'success',
			message: 'Add Todo Success',
			data: {
				todo,
			},
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Update User Todo --------------------------------------------*//
exports.updateUserTodo = async (req, res) => {
	try {
		const { id } = req.params;
		const { body } = req;

		const isTodoExist = await Todo.findOne({
			where: { id },
		});

		if (!isTodoExist) {
			return res.status(400).send({
				status: 'failed',
				message: 'No Todo',
				data: {
					todo: [],
				},
			});
		} else {
			await Todo.update({ ...body }, { where: { id } });

			const newTodo = await Todo.findOne({
				where: { id },
				attributes: ['todo', 'status'],
			});

			res.send({
				status: 'success',
				message: 'Update Todo Success',
				data: {
					todo: newTodo,
				},
			});
		}
	} catch (err) {
		return errorResponse(err, res);
	}
};

//*-------------------------------------------- Delete User Todo --------------------------------------------*//
exports.deleteUserTodo = async (req, res) => {
	try {
		const { id } = req.params;

		const isTodoExist = await Todo.findOne({
			where: { id },
		});

		if (!isTodoExist) {
			return res.status(400).send({
				status: 'failed',
				message: 'No Todo',
				data: {
					todo: [],
				},
			});
		} else {
			await Todo.destroy({
				where: { id },
			});

			res.send({
				status: 'success',
				message: 'Delete Todo Success',
				data: {
					todo: null,
				},
			});
		}
	} catch (err) {
		return errorResponse(err, res);
	}
};
