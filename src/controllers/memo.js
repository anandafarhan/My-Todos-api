const { Memo } = require('../../models');

//* Re-Useable Error response
const errorResponse = (err, res) => {
	console.log(err);
	res.status(500).send({ error: { message: 'Server Error' } });
};

//*-------------------------------------------- Get All User Memo --------------------------------------------*//
exports.getAllUserMemos = async (req, res) => {
	try {
		const { id } = req.user;
		const memos = await Memo.findAll({
			where: { userId: id, status: false },
			attributes: ['id', 'title', 'memo', 'status'],
		});

		if (memos.length < 1) {
			return res.status(204).send({
				status: 'failed',
				message: 'No Memos',
				data: {
					memos: [],
				},
			});
		}

		res.send({
			status: 'success',
			message: 'Get User Memos Success',
			data: { memos },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Get All Vault User Memo --------------------------------------------*//
exports.getAllUserVMemos = async (req, res) => {
	try {
		const { id } = req.user;
		const memos = await Memo.findAll({
			where: { userId: id, status: true },
			attributes: ['id', 'title', 'memo', 'status'],
		});

		if (memos.length < 1) {
			return res.status(204).send({
				status: 'failed',
				message: 'No Memos',
				data: {
					memos: [],
				},
			});
		}

		res.send({
			status: 'success',
			message: 'Get User Memos Success',
			data: { memos },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Add User Memo --------------------------------------------*//
exports.addUserMemo = async (req, res) => {
	try {
		const { body, user } = req;
		const userId = user.id;

		const memo = await Memo.create({ ...body, userId });

		res.status(201).send({
			status: 'success',
			message: 'Add Memo Success',
			data: {
				memo,
			},
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Update User Memo --------------------------------------------*//
exports.updateUserMemo = async (req, res) => {
	try {
		const { id } = req.params;
		const { body } = req;

		const isMemoExist = await Memo.findOne({
			where: { id },
		});

		if (!isMemoExist) {
			return res.status(400).send({
				status: 'failed',
				message: 'No Memo',
				data: {
					memo: [],
				},
			});
		} else {
			await Memo.update({ ...body }, { where: { id } });

			const newMemo = await Memo.findOne({
				where: { id },
				attributes: ['id', 'title', 'memo', 'status'],
			});

			res.send({
				status: 'success',
				message: 'Update Memo Success',
				data: {
					todo: newMemo,
				},
			});
		}
	} catch (err) {
		return errorResponse(err, res);
	}
};

//*-------------------------------------------- Delete User Todo --------------------------------------------*//
exports.deleteUserMemo = async (req, res) => {
	try {
		const { id } = req.params;

		const isMemoExist = await Memo.findOne({
			where: { id },
		});

		if (!isMemoExist) {
			return res.status(400).send({
				status: 'failed',
				message: 'No Memo',
				data: {
					memo: [],
				},
			});
		} else {
			await Memo.destroy({
				where: { id },
			});

			res.send({
				status: 'success',
				message: 'Delete Memo Success',
				data: {
					memo: null,
				},
			});
		}
	} catch (err) {
		return errorResponse(err, res);
	}
};
