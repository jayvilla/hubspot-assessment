// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const Handler =  async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method?.toUpperCase() === 'POST') {
    try {
      let response = await fetch(
        `${process.env.HUBSPOT_API_URL}/result?userKey=${process.env.API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req?.body),
        }
      );
      response = await response.json();
      console.log('response', response);
      res.status(200).json(response);
    } catch (e) {
      console.error(e);
      return null;
    }
  }
};

export default Handler;
