import {supabase} from './api/supabase.js'
import { validerFormulaire } from './utils/validationFormulaire.js'
import { suggestionOpenrouter } from './api/openrouter'

let tableauIdees=[]
let lesIdees = document.getElementById("idees")
let indexModification=-1

const buttonPoster= document.getElementById("poster")




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
await suggestionOpenrouter() 

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
        const titre = document.getElementById("titre");
        const description = document.getElementById("description"); 
        const categorie = document.getElementById("categorie");
        if (!validerFormulaire()) return;

        
        
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
            alert(`idee  enregistree avec succes`)

            error = result.error
        } else {
            const result = await supabase.from('idees').update({
                titre: titre.value,
                categorie: categorie.value,
                description: description.value
            }).eq('id', indexModification)
            error = result.error
            indexModification = -1
            alert( `idee modifiee avec succes`)
        }

        if (!error) {
            await recuperer()
        }


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
        <button type="button" class="bg-teal-700 hover:bg-teal-800 text-white px-3 py-1 rounded" onclick="modifierIdee(${tableauIdees[i].id})">Modifier</button>
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
    alert(`idee supprime avec succes`)
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