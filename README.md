# Ontologie OWL pour la gestion du personnel

Ce dépôt contient une ontologie OWL/RDF et une application web fullstack Next.js permettant de présenter et d'exploiter un modèle sémantique de gestion du personnel.

## Fichiers principaux

- `ontologie_gestion_personnel.owl` : ontologie OWL en RDF/XML, compatible avec Protégé et les moteurs de raisonnement OWL.
- `app/page.tsx` : interface professionnelle de démonstration générée côté serveur avec Next.js.
- `app/api/ontology/route.ts` : API JSON exposant le contenu structuré de l'ontologie.
- `app/api/ontology/file/route.ts` : route de téléchargement du fichier OWL.
- `app/lib/ontology.ts` : lecture et transformation du fichier OWL pour l'application.

## Périmètre fonctionnel

L'ontologie couvre les concepts suivants :

- personnes, employés et managers ;
- départements et postes ;
- contrats de travail ;
- compétences et formations ;
- absences et évaluations ;
- relations hiérarchiques et contraintes de base.

## Principales classes

| Classe | Description |
| --- | --- |
| `Personne` | Représente une personne physique. |
| `Employe` | Représente un membre du personnel. |
| `Manager` | Employé ayant des responsabilités de supervision. |
| `Departement` | Unité organisationnelle. |
| `Poste` | Fonction ou rôle occupé par un employé. |
| `Contrat` | Type ou instance de contrat de travail. |
| `Competence` | Savoir-faire détenu par un employé. |
| `Formation` | Action de formation suivie par un employé. |
| `Absence` | Période d'absence ou de congé. |
| `Evaluation` | Évaluation de performance. |

## Principales propriétés

- `travailleDans` relie un employé à un département.
- `occupePoste` relie un employé à son poste.
- `aContrat` relie un employé à son contrat.
- `supervise` et `estSupervisePar` décrivent la hiérarchie managériale.
- `possedeCompetence` relie un employé à ses compétences.
- `suitFormation`, `aAbsence` et `aEvaluation` décrivent le suivi RH.

## Contraintes modélisées

- chaque `Employe` doit avoir exactement un `matricule` ;
- chaque `Employe` doit travailler dans au moins un `Departement` ;
- chaque `Employe` doit occuper au moins un `Poste` ;
- `supervise` est déclarée transitive pour représenter les chaînes hiérarchiques.

## Exemple inclus

L'ontologie inclut un exemple d'employé (`EmployeExemple`) rattaché au département RH, au poste de responsable RH et à la compétence recrutement.

## Utilisation de l'ontologie seule

Ouvrir `ontologie_gestion_personnel.owl` dans Protégé, Apache Jena, RDF4J ou tout outil compatible RDF/XML afin de visualiser les classes, les propriétés, les contraintes et les individus.

## Application web fullstack Next.js

L'application Next.js lit l'ontologie côté serveur, transforme le RDF/XML en données structurées, expose une API JSON, puis affiche une interface professionnelle pour l'exposé.

### Installation

```bash
npm install
```

### Lancer en développement

```bash
npm run dev
```

Puis ouvrir :

```text
http://localhost:3000
```

### Routes disponibles

- `/` : tableau de bord visuel de l'ontologie.
- `/ontologie` : page de visualisation détaillée avec documentation et extrait OWL.
- `/api/ontology` : données JSON extraites de l'ontologie OWL.
- `/api/ontology/file` : téléchargement du fichier OWL.

### Build de production

```bash
npm run build
npm run start
```

## Déploiement sur Vercel et conflits Git

Si Vercel affiche encore une erreur contenant `return [...xml.matchAll(expression)]`, cela signifie que Vercel ne construit pas la dernière version du projet. La version actuelle n'utilise plus `matchAll` dans `app/lib/ontology.ts`.

### Vérifier la branche déployée

Dans Vercel, vérifier que le projet utilise bien :

- **Git Repository** : `MasirikaConstantin/ontologie` ;
- **Production Branch** : `main` ;
- **Framework Preset** : Next.js.

### Résoudre les conflits avant de pousser

Depuis votre machine locale :

```bash
git checkout main
git pull origin main
```

Si Git signale des conflits :

1. ouvrir les fichiers indiqués par Git ;
2. supprimer les marqueurs `<<<<<<<`, `=======`, `>>>>>>>` ;
3. garder la version qui contient `RegExp.exec` dans `app/lib/ontology.ts` ;
4. garder `flex-start` et `flex-end` dans `app/globals.css` ;
5. terminer avec :

```bash
git add .
git commit -m "Resolve deployment conflicts"
git push origin main
```

### Redéployer sur Vercel

Après le push, ouvrir Vercel puis lancer :

- **Deployments** ;
- choisir le dernier commit ;
- cliquer sur **Redeploy** ;
- décocher l'utilisation du cache si l'option est proposée.

Le commit affiché dans les logs Vercel doit être le dernier commit de la branche `main`. Si Vercel affiche un ancien commit, le problème vient de la branche GitHub connectée ou d'un push non effectué.
