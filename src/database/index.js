import Sequelize from 'sequelize';
import User from '../app/models/User';
import File from '../app/models/File';
import Specialization from '../app/models/Specialization';
import Professional from '../app/models/Professional';
import Consultation from '../app/models/Consultation';

import databaseConfig from '../config/database';

const models = [User, File, Specialization, Professional, Consultation];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map((model) => model.init(this.connection));
    models.map(
      (model) => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
