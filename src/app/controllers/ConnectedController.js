import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      firstname: Yup.string().required(),
      lastname: Yup.string().required(),
      cpf: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, firstname, lastname, password, cpf, email } = req.body;

    await User.create({
      id,
      firstname,
      lastname,
      password,
      cpf,
      email,
      connected_id: req.userId,
    });

    return res.json({
      id,
      firstname,
      lastname,
      cpf,
      email,
    });
  }
}

export default new UserController();
