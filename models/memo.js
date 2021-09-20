'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Memo extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Memo.belongsTo(models.User, { foreignKey: 'userId' });
		}
	}
	Memo.init(
		{
			title: DataTypes.STRING,
			memo: DataTypes.STRING,
			status: DataTypes.BOOLEAN,
			userId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'Memo',
		}
	);
	return Memo;
};
