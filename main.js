const CleAPI = import.meta.env.VITE_OPENROUTER_API_KEY

// import {CleAPI} from './config.js'


const supabaseUrl = 'https://wwwxidgbbrhzooohxqkv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3hpZGdiYnJoem9vb2h4cWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0OTc2NzYsImV4cCI6MjA5NjA3MzY3Nn0.F8OmKbAGoE8wqPIWPaa5wXbMaMNndfau0yz5JWAoeJ4'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

let tableauIdees=[]
let lesIdees = document.getElementById("idees")
let indexModification=-1

const buttonPoster= document.getElementById("poster")

// Fonction pour suggérer avec Ollama
async function suggererAvecOllama() {
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


//  Quand on tape dans le titre, Ollama suggère 
const inputTitre = document.getElementById('titre');
inputTitre.addEventListener('blur', async function() {
   if (document.getElementById('titre').value.length < 3 || indexModification!==-1) return;
 
    // Sauvegarder le texte d'attente
const texteOriginal = buttonPoster.innerHTML

buttonPoster.innerHTML = `
    <div class="spinner-grow" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>Analyse IA en cours...
`
buttonPoster.disabled = true

// Faire l'appel API (attendre la réponse)
await suggererAvecOllama()

// Remettre l'Attente
buttonPoster.innerHTML = texteOriginal
buttonPoster.disabled = false

});




async function recuperer(){
    const { data, error } = await supabase.from('idees').select('*')
    
    if (error) {
        console.error(error)
    } else {
        console.log(data)
        tableauIdees = data
        afficherIdees()
    }
}





function creerFormulaire() {
    const formulaire = document.getElementById("ideeForm");
    
    formulaire.addEventListener('submit', async function(e){
        e.preventDefault();
        let formulaireValide=true
        let erreurtitre=document.getElementById("erreur-titre")

        const titre = document.getElementById("titre");
        let titreValide=titre.value.trim()
        if (titreValide.length<3){
            console.log("Titre invalide")
            erreurtitre.textContent="Entrez un titre valide"
            erreurtitre.classList.add("text-red-600")
            titre.classList.add("border-2","border-red-600")
            formulaireValide=false
        }else{
            erreurtitre.textContent=""
            erreurtitre.classList.add("text-green-600")
            titre.classList.remove("border-2","border-red-600")
            formulaireValide=true

        }
        const description = document.getElementById("description");  
        let erreurdescription=document.getElementById("erreur-description")
        let descriptionValide=description.value.trim()
        if(descriptionValide.length<10){
            console.log("description non respectee")
            erreurdescription.textContent="Entrez une description valide"
            erreurdescription.classList.add("text-red-600")
            description.classList.add("border-2","border-red-600")
            formulaireValide=false
        }else{
            erreurdescription.textContent=""
            erreurdescription.classList.remove("text-red-600")
            description.classList.remove("border-2","border-red-600")
            formulaireValide=true

        }


        if (!formulaireValide){
            return
        }
       

        const categorie = document.getElementById("categorie");
        
        console.log(titre.value);
        console.log(categorie.value);
        console.log(description.value);
        
        const idee = {
            id: Date.now(),
            titre: titre.value,
            categorie: categorie.value,
            description: description.value
        };
        
        let error

        if (indexModification === -1) {
            const result = await supabase.from('idees').insert([
                { titre: titre.value, categorie: categorie.value, description: description.value }
            ])
            alert(`idee ${titre.value} enregistree avec succes`)

            error = result.error
        } else {
            const result = await supabase.from('idees').update({
                titre: titre.value,
                categorie: categorie.value,
                description: description.value
            }).eq('id', indexModification)
            error = result.error
            indexModification = -1
            alert( `idee ${titre.value} modifiee avec succes`)
        }

        if (!error) {
            await recuperer()
        }


        // const texteOriginalButton = buttonPoster.innerHTML
        // buttonPoster.innerHTML = texteOriginalButton
        // buttonPoster.disabled = false
        console.log(idee);
        console.log(tableauIdees);
        
        titre.value = "";
        categorie.value = "";
        description.value = "";
    });
}

// Appeler la fonction pour creer le formulaire
creerFormulaire();



function afficherIdees(){
   lesIdees.innerHTML="";
   for(let i=0; i< tableauIdees.length; i++){
        const maCarte=document.createElement("div")
        maCarte.className = "p-4 rounded-lg shadow-md mb-4"
        
        maCarte.innerHTML=`
        <p class=" mb-2 font-bold">${tableauIdees[i].titre}</p>
        <p class="text-sm text-red-600 mb-2">${tableauIdees[i].categorie}</p>
        <p class="text-gray-700 mb-4">${tableauIdees[i].description}</p>
        <button type="submit" class="bg-teal-700 hover:bg-teal-800 text-white px-3 py-1 rounded" onclick="modifierIdee(${tableauIdees[i].id})">Modifier</button>
        <button type="button" class="bg-red-900 hover:bg-red-950 text-white px-3 py-1 rounded" onclick="supprimerIdee(${tableauIdees[i].id})">Supprimer</button>`
        if(tableauIdees[i].categorie==="pedagogie"){
            maCarte.classList.add("bg-blue-100")
        }else if(tableauIdees[i].categorie==="evenement"){
            maCarte.classList.add("bg-green-100")
        }else if(tableauIdees[i].categorie==="vie-campus"){
            maCarte.classList.add("bg-purple-100")
        }else {
            maCarte.classList.add("bg-yellow-100")
        }
        lesIdees.appendChild(maCarte)

   }
}




async function supprimerIdee(idIdeeAsupprimer){
    const { error } = await supabase.from('idees').delete().eq('id', idIdeeAsupprimer)
    alert(`idee ${titre.value} supprime avec succes`)
    if (!error) {
        await recuperer()
    }
}

function modifierIdee(idAmodifier){
    let ideeAtrouver = tableauIdees.find(idee =>idee.id===idAmodifier)
    document.getElementById("titre").value=ideeAtrouver.titre;
    document.getElementById("categorie").value=ideeAtrouver.categorie;
    document.getElementById("description").value=ideeAtrouver.description;
    indexModification=idAmodifier
}


window.modifierIdee = modifierIdee
window.supprimerIdee = supprimerIdee




recuperer()
afficherIdees()