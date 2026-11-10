# TP4 — Réponses

**Yassmine Feki :**

> Répondez sous chaque question. Si vous avez utilisé `scripts/rattrapage-npm.sh`, indiquez-le ici :

## Partie 1 — Les dépôts npm

**Q1.** `npm-proxy` met en cache les paquets provenant de npmjs.org ; `npm-hosted` héberge les paquets publiés par l'équipe ; `npm-group` regroupe ces dépôts derrière une adresse de lecture unique. Les clients npm (y compris celui du build Docker) utilisent `npm-group`.

**Q2.** Nexus recherche les paquets dans l'ordre des membres : placer `npm-hosted` avant `npm-proxy` donne priorité à notre paquet interne. Si le même nom existe aussi sur npmjs.org, notre version hébergée est trouvée en premier ; inverser l'ordre pourrait faire lire la version publique à la place.

**Q3.** `deployer` applique le moindre privilège : il peut publier dans le dépôt prévu sans utiliser le compte administrateur, dont la compromission serait bien plus grave. La lecture anonyme permet aux builds et aux utilisateurs de télécharger les dépendances sans partager d'identifiants, tandis que la publication reste authentifiée.

## Partie 2 — Consommer via le group

**Q4.** Après le `npm ci`, `npm-proxy` contient les métadonnées et les archives des dépendances publiques téléchargées par Nexus (par exemple `next`, `react` et `vitest`). Le lockfile n'a pas changé parce que les mêmes versions et intégrités sont toujours installées ; changer le registre utilisé pour les obtenir ne nécessite pas de modifier ces résolutions.

**Q5.** Si Nexus a déjà mis en cache les métadonnées et les archives nécessaires, le `npm ci` peut les servir depuis `npm-proxy` malgré une panne de npmjs.org. Cela dépend toutefois du contenu encore disponible dans le cache ; un paquet jamais récupéré par Nexus ne peut pas être téléchargé et l'installation échoue tant que npmjs.org reste indisponible.

**Q6.** `frontend/.npmrc` est commité parce qu'il ne contient que l'adresse publique du registre `npm-group`, nécessaire pour que tous les environnements utilisent la même configuration. Le build Docker peut lire anonymement les dépendances depuis ce group ; il n'a donc besoin d'aucun identifiant ni secret.

## Partie 3 — Publier un paquet interne

**Q7.** `files` limite le contenu de l'archive publiée à `dist`, sans embarquer les sources/tests inutiles. `publishConfig` fixe le registre de publication sur `npm-hosted` ; sans lui, npm utiliserait le registre configuré par défaut (`npm-group`), qui sert à lire et n'est pas la cible prévue pour publier.

**Q8.**  Nexus refuse car la politique *Disable redeploy* interdit de remplacer une version déjà publiée. Cela garantit que `0.1.0` désigne toujours le même contenu : remplacer le paquet pourrait contredire l'intégrité enregistrée dans le lockfile et rendre les installations non reproductibles ou les faire échouer.

**Q9.** `0.2.0` marque l'ajout d'une fonctionnalité avec une évolution mineure avant la première version stable. `0.1.1` serait une correction sans nouvelle fonctionnalité ; `1.0.0` annoncerait une API stable et un engagement de compatibilité qui n'est pas encore l'objectif de cette étape.

**Q10.** Pour une version majeure `0`, `^0.2.0` accepte les versions `>=0.2.0` et `<0.3.0` (donc les correctifs 0.2.x, comme `0.2.1`, mais pas `0.3.0`). Après publication de `0.2.1`, un `npm install` peut mettre le lockfile à jour vers `0.2.1`. Il conservera ensuite cette version verrouillée au `npm ci` ; `npm ci` ne résout pas de nouveau la plage et n'installera pas `0.3.0`.

**Q11.** La valeur de `NPM_AUTH` est dans le fichier local `.env`, ignoré par Git, puis transmise au conteneur `npm` par l'environnement Compose. Les fichiers `.npmrc` ne contiennent que la référence `${NPM_AUTH}`, pas sa valeur. Si un jeton est commité, il faut le révoquer/renouveler immédiatement, retirer le secret de l'historique Git (une simple suppression dans un nouveau commit ne suffit pas) et mettre à jour les utilisateurs concernés.

## Partie 4 — L'image Docker

**Q12.** `localhost:8082` est le registre Nexus joignable sur la machine locale, `cours-frontend` est le nom du dépôt/de l'image, et `1.0.0` est le tag de version. On pousse sur 8082, le port du dépôt Docker *hosted* ; on tire sur 8083, le port du *group*, qui permet de lire à la fois les images hébergées et celles mises en cache depuis Docker Hub.

**Q13.** Digest du push : **d59a1ddbca5578505eaa0871e2a9592dfb70c414a1820858f4e2bdac14424bd9**. Digest du pull : **d59a1ddbca5578505eaa0871e2a9592dfb70c414a1820858f4e2bdac14424bd9**. Ils doivent être identiques : un digest SHA-256 identifie le contenu exact et immuable de l'image, tandis qu'un tag est un nom modifiable qui peut pointer vers une autre image plus tard.

**Q14.** `latest` est un tag mutable et ne garantit ni quelle version sera tirée, ni que deux déploiements utiliseront le même contenu. Un tag versionné (et, pour une identité stricte, un digest) rend le déploiement reproductible et vérifiable.

**Q15.** Docker traite `localhost` comme un registre local de développement et autorise ici l'accès HTTP sans TLS. Pour un Nexus partagé, il faudrait l'exposer via un nom de domaine et HTTPS avec un certificat TLS valide (ou une autorité de certification explicitement approuvée par les clients), ainsi qu'une authentification et des accès correctement configurés.

## Partie 5 — Synthèse

**Q16.** On construit une seule fois l'image Docker du front, on la publie dans le dépôt `docker-hosted` de Nexus sous un tag versionné, puis `docker-compose.yml` la tire depuis `localhost:8083/cours-frontend:1.0.0` via le group au lieu de la reconstruire. Un serveur d'intégration continue devrait au minimum exécuter les tests automatisés et construire/publier l'image versionnée dans Nexus (il pourrait aussi tester et publier le paquet npm interne).
