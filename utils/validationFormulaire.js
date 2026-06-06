export function validerFormulaire(){
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
       return true
}