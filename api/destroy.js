// api/destroy.js - Mark agent for destruction
import { destroyList } from './beacon.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { agent_id } = req.body;
    
    if (!agent_id) {
      return res.status(400).json({ error: 'Missing agent_id' });
    }
    
    destroyList.add(agent_id);
    console.log(`[DESTROY] Marked ${agent_id} for destruction`);
    
    res.json({ 
      status: 'marked',
      message: `Agent ${agent_id} will self-destruct on next beacon`
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Destroy command failed' });
  }
}
