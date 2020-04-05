import * as Yup from 'yup';
import Professional from '../models/Professional';
import User from '../models/User';

class ProfessionalController {
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

    const userExists = await Professional.findOne({
      where: { email: req.body.email },
    });

    const userIsPatient = await User.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    if (userIsPatient) {
      return res.status(400).json({ error: 'User already exists as patient.' });
    }

    const {
      id,
      specialization_id,
      register_cod,
      cpf,
      firstname,
      lastname,
      email,
    } = await Professional.create(req.body);

    return res.json({
      id,
      specialization_id,
      register_cod,
      cpf,
      firstname,
      lastname,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      firstname: Yup.string(),
      lastname: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, firstname, lastname, connected_id } = await user.update(
      req.body
    );

    return res.json({
      id,
      firstname,
      lastname,
      email,
      connected_id,
    });
  }
}

export default new ProfessionalController();
