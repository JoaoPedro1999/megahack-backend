import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';
import uuid from 'uuid/v4';

class Consultation extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeCreate', async (consultation) => {
      consultation.id = uuid();
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Professional, {
      foreignKey: 'professional_id',
      as: 'professional',
    });
  }
}

export default Consultation;
