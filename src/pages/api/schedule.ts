import { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';
import rateLimit from 'lambda-rate-limit';

const limiter = rateLimit({
  interval: 1000, // 1 second
  uniqueTokenPerInterval: 500, // 500 unique clients per second
});

interface AuthedRequest extends NextApiRequest {
  uid?: string;
}

const firestore = getFirestore();

const handler = async (req: AuthedRequest, res: NextApiResponse) => {
  await limiter(req, res);

  if (req.method === 'POST') {
    try {
      const { date, clientId, jobDetails } = req.body;

      if (!req.uid) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!date || !clientId || !jobDetails) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const newSchedule = {
        date,
        clientId,
        jobDetails,
        createdAt: admin.firestore.Timestamp.now(),
        userId: req.uid,
      };

      const scheduleRef = await firestore.collection('schedules').add(newSchedule);
      return res.status(201).json({ id: scheduleRef.id, ...newSchedule });
    } catch (err) {
      return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;