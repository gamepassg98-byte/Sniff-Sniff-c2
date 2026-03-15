// api/audio.js - Audio upload endpoint
const audioStorage = new Map();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { agent_id, audio, timestamp } = req.body;
      
      if (!audioStorage.has(agent_id)) {
        audioStorage.set(agent_id, []);
      }
      
      audioStorage.get(agent_id).push({
        data: audio,
        timestamp: timestamp || new Date().toISOString(),
        size: audio.length
      });
      
      console.log(`[AUDIO] ${agent_id} - ${audio.length} bytes`);
      
      res.json({ 
        status: 'received',
        chunks: audioStorage.get(agent_id).length
      });
      
    } catch (error) {
      res.status(500).json({ error: 'Audio upload failed' });
    }
  }
  
  else if (req.method === 'GET') {
    try {
      const { agent_id } = req.query;
      
      if (!agent_id) {
        // Return all
        const all = {};
        audioStorage.forEach((value, key) => {
          all[key] = value.length;
        });
        return res.json(all);
      }
      
      const chunks = audioStorage.get(agent_id) || [];
      res.json({
        agent_id,
        chunks: chunks.length,
        audio: chunks
      });
      
    } catch (error) {
      res.status(500).json({ error: 'Audio retrieval failed' });
    }
  }
}

export { audioStorage };
