// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import connect from '../../utils/database';
import { ObjectID } from 'mongodb';

interface ErrorResponseType {
  error: string;
}

interface SuccessResponseType {
  date:string;
  teacher_name:string;
  teacher_id:string;
  student_id:string;
  student_name:string;
  course:string;
  location:string;
  appointment_link:string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    // verificação se o usuário está logado
    if(!session) {
        res.status(400).json({ error: 'Please login first!' });
        return;
    }
    
    const {
        date,
        teacher_name,
        teacher_id,
        student_id,
        student_name,
        course,
        location,
        appointment_link,
    }: {
        date: string,
        teacher_name: string,
        teacher_id: string,
        student_id: string,
        student_name: string,
        course: string,
        location: string,
        appointment_link: string,
    } = req.body;

    if (
      !date ||
      !teacher_name ||
      !teacher_id ||
      !student_id ||
      !student_name ||
      !course ||
      !location
    ) {
      res.status(400).json({ error: 'Missing parameter on request body!' });
      return;
    }
    const { db } = await connect();

    const teacherExists = await db
      .collection('users')
      .findOne({ _id: new ObjectID(teacher_id) });

    if (!teacherExists) {
      res
        .status(400)
        .json({
          error: `teacher ${teacher_name} with id ${teacher_id} does not exist`,
        });
      return;
    }

    const studentExists = await db
      .collection('users')
      .findOne({ _id: new ObjectID(student_id) });

    if (!studentExists) {
      res
        .status(400)
        .json({
          error: `student ${student_name} with id ${student_id} does not exist`,
        });
      return;
    }

    const appointment = {
      date,
      teacher_name,
      teacher_id,
      student_id,
      student_name,
      course,
      location,
      appointment_link: appointment_link || '',
    };

    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectID(teacher_id) },
        { $push: { appointments: appointment }, $inc: { coins: 1 } }
      );

    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectID(student_id) },
        { $push: { appointments: appointment }, $inc: { coins: -1 } }
      );

    res.status(200).json(appointment);
  } else {
    res.status(400).json({ error: 'erro ao processar a requisição' });
  }
};
