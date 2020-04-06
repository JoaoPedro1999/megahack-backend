import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Professional from '../models/Professional';
import Consultation from '../models/Consultation';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const checkUserProfessional = await Professional.findOne({
      where: { id: req.userId },
    });

    if (!checkUserProfessional) {
      return res.status(401).json({ error: 'User is not a professional' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const consultation = await Consultation.findAll({
      where: {
        professional_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });

    return res.json(consultation);
  }
}

export default new ScheduleController();
