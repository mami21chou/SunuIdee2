const CleAPI = import.meta.env.VITE_OPENROUTER_API_KEY


// Fonction pour suggérer avec Ollama
export async function suggestionOpenrouter() {
    const titre = document.getElementById('titre').value;
    if (titre.length < 3) return;
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',

            headers: {
            'Authorization': `Bearer ${CleAPI}`,
                'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'poolside/laguna-m.1:free',
                messages: [
                    {
                        role: 'user',
                        content: `Choisis une catégorie pour: "${titre}". Réponds par: pedagogie, evenement, vie-campus, ou autre`,
                    },
                ],
               
            })
        });
        
        const data = await response.json();
        let categorie = data.choices[0].message.content.toLowerCase();
        
        // Nettoie la réponse
        if (categorie.includes('pedagogie')) categorie = 'pedagogie';
        else if (categorie.includes('evenement')) categorie = 'evenement';
        else if (categorie.includes('vie-campus')) categorie = 'vie-campus';
        else categorie = 'amelioration-technique';
        document.getElementById('categorie').value = categorie;

        return categorie
        
        
        
    } catch (error) {
        console.log('Ollama indisponible');
        return "autre"
    }
}