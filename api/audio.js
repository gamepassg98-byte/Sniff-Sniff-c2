// api/audio.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { agent_id, audio } = req.body;
    // Store audio (demo: just ACK)
    console.log(`Audio from ${agent_id}: ${audio.length} bytes`);
    res.json({ status: 'received' });
  } catch (error) {
    res.status(500).json({ error: 'Audio processing failed' });
  }
}
