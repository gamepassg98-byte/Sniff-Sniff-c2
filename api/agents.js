// api/agents.js - Get all active agents
import { agents } from './beacon.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const now = Date.now();
    const agentsList = Array.from(agents.values()).map(agent => {
      const lastSeen = new Date(agent.last_seen).getTime();
      const secondsAgo = Math.floor((now - lastSeen) / 1000);
      
      return {
        ...agent,
        online: secondsAgo < 120, // 2 minutes timeout
        seconds_ago: secondsAgo
      };
    });
    
    res.json({
      total: agentsList.length,
      online: agentsList.filter(a => a.online).length,
      agents: agentsList
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to get agents' });
  }
}
