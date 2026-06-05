```markdown
# Sunu-Idées - Boîte à idées collaborative

## Description

Sunu-Idées est une application web collaborative intelligente permettant aux utilisateurs de partager, modifier et supprimer des idees anonymement. Les idees sont automatiquement categorisees par une intelligence artificielle via OpenRouter et stockees dans le cloud via Supabase.

## Fonctionnalites

- Creation d'une idee avec titre, categorie et description
- Categorisation automatique par IA (OpenRouter)
- Affichage des idees sur un mur collaboratif
- Modification d'une idee existante
- Suppression d'une idee
- Validation des donnees du formulaire
- Interface responsive avec Tailwind CSS
- Persistance des donnees dans le cloud (Supabase)

## Categories disponibles

- Pedagogie
- Evenement
- Vie de campus
- Amelioration technique

## Technologies utilisees

- HTML5
- Tailwind CSS
- bootstrap
- JavaScript (ES6+)
- Supabase (Base de donnees cloud)
- OpenRouter (API IA)
- Vercel (Deploiement et serverless functions)

## Architecture

L'application suit une architecture securisee :

1. Le fichier `main.js` cote client gere l'interface utilisateur
2. Les appels a l'IA passent par une serverless function (`api/categorie.js`) qui cache la cle API
3. Les donnees sont stockees dans Supabase pour un acces partage par toute la communaute

## Installation locale

1. Cloner le depot
2. Creer un fichier `.env` avec la cle API OpenRouter
3. Ouvrir `index.html` dans un navigateur

## Deployment

L'application est deployee sur Vercel. Les variables d'environnement suivantes doivent etre configurees :

- `VITE_OPENROUTER_API_KEY` :La cle API OpenRouter

## Structure du projet
sunu-idees/
├── api/
│   └── categorie.js       # Serverless function pour l'IA
├── index.html              # Structure HTML
├── main.js                 # Logique JavaScript
└── README.md               # Documentation

## Auteure

SAMBE Adji Aissatou Wade
```




## Projet realise dans le cadre de la formation Simplon

Lien de demonstration :https://sunu-idee2-muctpaokm-adjiii-s-projects.vercel.app/
```

