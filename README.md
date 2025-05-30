
# 🚇 Horaires de Métro

Une application Next.js pour consulter les horaires de métro en temps réel pour les stations en Île-de-France.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé [Node.js](https://nodejs.org/) sur votre machine.

## 🛠 Installation

1. Clonez ce dépôt sur votre machine locale :

   ```bash
   git clone git@github.com:romontei/IDFM_Timetables.git
   ```

2. Accédez au répertoire du projet :

   ```bash
   cd IDFM_Timetables
   ```

3. Installez les dépendances nécessaires :

   ```bash
   npm install
   ```

## 🔑 Configuration

Pour utiliser cette application, vous devez obtenir une clé API depuis le site [PRIM d'IDFM](https://prim.iledefrance-mobilites.fr/).

1. **Obtenez votre clé API** :
   - Allez sur le site [PRIM d'IDFM](https://prim.iledefrance-mobilites.fr/).
   - Inscrivez-vous ou connectez-vous à votre compte.
   - Générez une nouvelle clé API.

2. **Configurez votre fichier `.env`** :
   - Créez un fichier `.env.local` à la racine de votre projet.
   - Ajoutez votre clé API dans le fichier `.env.local` comme suit :

     ```plaintext
     NEXT_PUBLIC_API_KEY=votre_clé_api_ici
     ```

   - Assurez-vous que le fichier `.env.local` est ajouté à votre `.gitignore` pour éviter de le pousser sur un dépôt Git.

## 🚀 Utilisation

1. **Démarrez l'application** :

   ```bash
   npm run dev
   ```

2. **Accédez à l'application** :
   - Ouvrez votre navigateur et allez à l'adresse [http://localhost:3000](http://localhost:3000).

3. **Recherchez une station** :
   - Utilisez le champ de recherche pour entrer le code `StopArea` de la station que vous souhaitez consulter.
   - Par exemple, pour la station "Châtelet", vous pourriez utiliser le code `STIF:StopArea:SP:474151:`.

## 🛡️ Remarques

- Assurez-vous de ne pas partager votre clé API publiquement.
- Cette application est conçue pour être utilisée en développement local. Pour un déploiement en production, assurez-vous de suivre les bonnes pratiques de sécurité et de configuration.

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
