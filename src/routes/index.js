const express = require('express');
const router = express.Router();

const { auth } = require('../middlewares/auth');
const { register, login, checkPin } = require('../controllers/auth');
const {
	getAllUserTodos,
	addUserTodo,
	updateUserTodo,
	deleteUserTodo,
} = require('../controllers/todo');
const {
	getAllUserMemos,
	addUserMemo,
	updateUserMemo,
	deleteUserMemo,
	getAllUserVMemos,
} = require('../controllers/memo');

//* --------------------------  AUTH  ---------------------------- *//
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/checkPin', auth, checkPin);

//* --------------------------  TODO  ---------------------------- *//
router.get('/todos', auth, getAllUserTodos);
router.post('/todo', auth, addUserTodo);
router.patch('/todo/:id', auth, updateUserTodo);
router.delete('/todo/:id', auth, deleteUserTodo);

//* --------------------------  MEMO  ---------------------------- *//
router.get('/memos', auth, getAllUserMemos);
router.get('/Vmemos', auth, getAllUserVMemos);
router.post('/memo', auth, addUserMemo);
router.patch('/memo/:id', auth, updateUserMemo);
router.delete('/memo/:id', auth, deleteUserMemo);

module.exports = router;
