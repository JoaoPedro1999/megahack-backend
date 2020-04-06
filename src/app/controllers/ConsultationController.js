import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Specialization from '../models/Specialization';
import Consultation from '../models/Consultation';
import Professional from '../models/Professional';
import Notification from '../schemas/Notification';

class ConsultationController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const consultation = await Consultation.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Professional,
          as: 'professional',
          attributes: ['id', 'firstname', 'lastname'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
            {
              model: Specialization,
              as: 'specialization',
              attributes: ['id', 'description'],
            },
          ],
        },
      ],
    });

    return res.json(consultation);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      professional_id: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { professional_id, date } = req.body;

    const checkIsProfessional = await Professional.findOne({
      where: { id: professional_id },
    });

    if (!checkIsProfessional) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with professional' });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const checkAvailability = await Consultation.findOne({
      where: {
        professional_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Consultation date is not available' });
    }

    const connectorUser = await User.findOne({
      where: {
        id: req.userId,
      },
      include: [
        {
          model: User,
          as: 'UserConnected',
          attributes: ['id', 'firstname', 'lastname'],
        },
      ],
    });

    const consultation = await Consultation.create({
      user_id: req.userId,
      professional_id,
      date: hourStart,
    });

    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    const user = await User.findByPk(req.userId);

    await Notification.create({
      content: `Novo agendamento de ${user.firstname} ${user.lastname} para ${formattedDate}`,
      user: professional_id,
    });

    if (connectorUser.dataValues.connected_id) {
      await Notification.create({
        content: `${user.firstname} agendou uma consulta com ${checkIsProfessional.dataValues.firstname} ${checkIsProfessional.dataValues.lastname} para o dia ${formattedDate}`,
        user: connectorUser.dataValues.connected_id,
      });
    }

    await Notification.create({
      content: `Sua consulta com ${checkIsProfessional.dataValues.firstname} ${checkIsProfessional.dataValues.lastname} para o ${formattedDate}, foi confirmado!`,
      user: req.userId,
    });

    return res.json(consultation);
  }

  async delete(req, res) {
    const consultation = await Consultation.findByPk(req.params.id, {
      include: [
        {
          model: Professional,
          as: 'professional',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (consultation.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }

    const dateWithSub = subHours(consultation.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel consultation 2 hours in advance.',
      });
    }

    consultation.canceled_at = new Date();

    await consultation.save();

    return res.json(consultation);
  }
}

export default new ConsultationController();
