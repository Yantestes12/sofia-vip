export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.NEXUSPAG_API_KEY;

  if (!API_KEY) {
    console.error('[API] NEXUSPAG_API_KEY não configurada nas variáveis de ambiente do Vercel');
    return res.status(500).json({ error: 'Configuração de pagamento ausente.' });
  }

  try {
    const response = await fetch('https://nexuspag.com/api/pix/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error: any) {
    console.error('[API] Erro ao criar PIX:', error);
    return res.status(500).json({ error: error.message || 'Erro interno do servidor' });
  }
}
