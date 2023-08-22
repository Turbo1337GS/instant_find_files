import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { searchTerm } = req.body;
  if (!searchTerm) {
    return res.status(400).json({ error: "Brak searchTerm." });
  }

  const pythonServerResponse = await axios.get(`http://127.0.0.1:4783/search?q=${searchTerm}`);
  const results = pythonServerResponse.data;

  res.status(200).json(results);
};

export default handler;
