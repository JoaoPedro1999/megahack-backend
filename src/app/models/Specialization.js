import Sequelize, { Model } from 'sequelize';
import uuid from 'uuid/v4';

class Specialization extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeCreate', async (specialization) => {
      specialization.id = uuid();
    });

    return this;
  }
}

export default Specialization;
