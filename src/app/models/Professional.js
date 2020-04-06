import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import uuid from 'uuid/v4';

class Professional extends Model {
  static init(sequelize) {
    super.init(
      {
        register_cod: Sequelize.STRING,
        cpf: Sequelize.STRING,
        firstname: Sequelize.STRING,
        lastname: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeCreate', async (professional) => {
      professional.id = uuid();
    });

    this.addHook('beforeSave', async (professional) => {
      if (professional.password) {
        professional.password_hash = await bcrypt.hash(
          professional.password,
          8
        );
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  static associate(models) {
    this.belongsTo(models.Specialization, {
      foreignKey: 'specialization_id',
      as: 'specialization',
    });
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }
}

export default Professional;
