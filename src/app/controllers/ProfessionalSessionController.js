import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import Professional from '../models/Professional';
import authConfig from '../../config/auth';

class ProfessionalSessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const professional = await Professional.findOne({ where: { email } });

    if (!professional) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await professional.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = professional;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new ProfessionalSessionController();
