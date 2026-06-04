export default async function handler(req, res) {
    // Autoriser les requêtes POST uniquement
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { titre } = req.body;

    if (!titre || titre.length < 3) {
        return res.status(400).json({ error: 'Titre trop court' });
    }

    const OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_API_KEY;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'poolside/laguna-m.1:free',
                messages: [
                    {
                        role: 'user',
                        content: `Choisis une catégorie pour: "${titre}". Réponds par: pedagogie, evenement, vie-campus, ou amelioration-technique`
                    }
                ]
            })
        });

        const data = await response.json();
        let categorie = data.choices[0].message.content.toLowerCase();

        // Nettoyage de la réponse
        if (categorie.includes('pedagogie')) categorie = 'pedagogie';
        else if (categorie.includes('evenement')) categorie = 'evenement';
        else if (categorie.includes('vie-campus')) categorie = 'vie-campus';
        else categorie = 'amelioration-technique';

        res.status(200).json({ categorie });

    } catch (error) {
        console.error('Erreur API:', error);
        res.status(500).json({ error: 'Erreur serveur', categorie: 'amelioration-technique' });
    }
}