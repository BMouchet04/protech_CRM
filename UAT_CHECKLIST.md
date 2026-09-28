# LUKE CRM — recette générale 5E (données fictives uniquement)

État au 26 septembre 2026. Le Site reste privé et seul le propriétaire est autorisé. Ne saisir aucune donnée ProTechMC réelle. Les statuts ci-dessous distinguent une vérification réellement exécutée d'une revue de code ou d'un test impossible à mener dans cette session.

| Domaine | Scénario | Statut | Résultat / raison |
| --- | --- | --- | --- |
| Qualité | TypeScript | PASS | `npx tsc --noEmit` sans erreur. |
| Qualité | Lint | PASS | `npm run lint` sans erreur significative. |
| Qualité | Build production | PASS | `npm run build` réussi. |
| Qualité | Contrôle de diff | PASS | `git diff --check` sans erreur. |
| Navigation | Création rapide sur bureau | PASS | Correction 5E : bouton global **Créer** ajouté dans l'en-tête desktop ; il ouvre notamment Scan carte et Note vocale. Il est absent pour un rôle sans permission de création. |
| Responsive | 375 px — modules et fiches | BLOCKED | Aperçu local démarré mais contrôle visuel indisponible dans cette session. À tester dans un navigateur réel. |
| Responsive | 430 px — modules et fiches | BLOCKED | Même blocage. |
| Responsive | 768 px — modules et fiches | BLOCKED | Même blocage. |
| Responsive | 1024 px — modules et fiches | BLOCKED | Même blocage. |
| Responsive | 1440 px — modules et fiches | BLOCKED | Même blocage. |
| Lisibilité | Texte noir dense / tailles confortables | PASS | Revue des styles : texte métier `#151515`, libellés utilisables à 14 px ou plus pour les contrôles courants ; à confirmer visuellement aux cinq largeurs. |
| Modules | Mon travail, Prospects, Comptes, Contacts, Opportunités, Pipeline, Activités, Administration | NOT TESTED | Interface non parcourue visuellement pendant la recette 5E. |
| Fiches | Prospect, Compte, Contact, Opportunity, prospect particulier | NOT TESTED | À exécuter avec données fictives et rechargement. |
| Capture | Création rapide, scan carte, note vocale | NOT TESTED | À tester dans un navigateur avec import photo et permissions de microphone. |
| Identités | SUPERADMIN | PASS | Propriétaire actuel associé au rôle SUPERADMIN ; bootstrap et permissions lus côté serveur. |
| Identités | DIRECTION, SALES_MANAGER, COMMERCIAL, READ_ONLY | BLOCKED | Le Site owner-private ne possède aucune identité ChatGPT de test associée. Aucun test croisé ne peut être simulé honnêtement. |
| Droits serveur | Routes privées, session, contrôle de permission | PASS | Revue des routes : chaque API appelle `actor()` puis contrôle l'action et le scope ; absence de permission = refus. |
| READ_ONLY | POST / DELETE / conversion / statut / note / tâche directe | BLOCKED | Le rôle ne reçoit que `*.read` dans le seed et les mutations exigent `*.create|update|delete|convert`, mais un appel HTTP sous identité READ_ONLY reste à exécuter. |
| Visibilité | Scopes OWN / TEAM / ALL, objets liés, accès direct | BLOCKED | Contrôles implémentés dans `rows`, `linkedVisible` et `validateRelations`, mais nécessitent des identités réelles distinctes. |
| Commercial | Mes opportunités, Mon travail, tâches, relances, risques | PASS | Revue de code : ces vues reçoivent `actorInfo.id`, et filtrent sur cet identifiant ; aucun `u1` fixe n'est utilisé pour ces listes. |
| Administration | Utilisateurs, équipes, rôles, taux, seuils, audit | NOT TESTED | Écran à parcourir avec SUPERADMIN ; routes serveur vérifiées statiquement. |
| Persistance | Contact B2B / B2C / Account / Prospect / Opportunity / Task / Activity : créer → reload → modifier → reload → logout/login | NOT TESTED | Aucun parcours de persistance complet exécuté durant 5E ; tests manuels requis avant données réelles. |
| B2C | Particulier → intérêt → tâche → opportunity Services → gagnée → Client actif sans doublon | NOT TESTED | Parcours implémenté et précédemment vérifié localement ; à répéter en recette 5E. |
| B2B | Prospect → Account → Contact → Opportunity avec historique conservé | NOT TESTED | À exécuter en interface et après rechargement. |
| Déduplication | Account similaire, email, téléphone, nom + Account, particulier existant | NOT TESTED | Requêtes et absence de fusion automatique revues ; cas fonctionnels non exécutés. |
| Mon travail | Today, Overdue, Follow-up, At Risk, Complete, Postpone, Next Action, historique de report | NOT TESTED | À exécuter sous une identité commerciale réelle. |
| Opportunities | Pipelines Services, Produits France, Export, Network ; stage, amount, probability, weighted, won/lost | NOT TESTED | À exécuter et vérifier dans l'audit. |
| Devises | EUR, USD, GBP, AED séparées et taux EUR explicite | NOT TESTED | Logique de snapshot revue ; test utilisateur et données de taux à exécuter. |
| Activités | Journal majoritairement lecture ; création depuis contexte ; permissions | PASS | La page Activités ne contient pas de formulaire de création ; la route impose date et fiche liée. Revue visuelle encore requise. |
| Scan carte | Image exploitable / médiocre, OCR disponible ou non, manuel, Account, doublon, annulation | NOT TESTED | Nécessite import de fichiers et navigateur compatible. Aucun champ n'est inventé par le code de repli. |
| Note vocale | Micro disponible/indisponible, texte, contexte, date relative, ambiguïté, annulation | NOT TESTED | Nécessite permission microphone et navigateur compatible. Les propositions ne sont écrites qu'après validation. |
| Fail-safe | OCR / micro / transcription indisponibles | PASS | Revue de code : saisie manuelle carte et note texte restent disponibles ; CRM fondamental ne dépend pas de ces services. |
| Audit | Owner, Stage, Amount, Won, Lost, conversion, report, rôle, carte, voix | NOT TESTED | Écriture d'audit revue dans les services ; vérifier les lignes sous identités réelles. |
| Performance | Mon travail, timeline Account, Activités, Opportunities, recherche | NOT TESTED | Aucune mesure de navigateur/réseau effectuée durant 5E. |
| Sécurité | Secrets frontend / variables / accès liés | PASS | Revue statique : aucun secret applicatif dans le client ni dans le dépôt ; liens contrôlés côté serveur. |

## Précondition à lever

Avant toute migration de données, associer explicitement des identités ChatGPT de test autorisées au Site privé pour DIRECTION, SALES_MANAGER, COMMERCIAL et READ_ONLY, puis exécuter les scénarios `BLOCKED` et `NOT TESTED` ci-dessus dans deux sessions distinctes au minimum. La réception ne doit pas être transformée en réussite par revue de code seule.
# Recette 5F — notes vocales contextuelles (2026-09-26)

| Scénario | Statut | Preuve / raison |
|---|---|---|
| Démarrage global sans contexte | PASS (statique) | Écran de choix obligatoire ; bouton de démarrage désactivé sans fiche sélectionnée. |
| Démarrage depuis Prospect, Contact, Compte, Opportunité | PASS (statique) | Les liens passés par les fiches préremplissent le contexte ; Compte/Contact secondaires appliqués. |
| Contact particulier sans Compte | PASS (statique) | Le lien Contact est une clé primaire suffisante. |
| Recherche contextuelle | PASS (statique) | Recherche nom, société, e-mail, téléphone et opportunité ; aucun choix automatique. |
| Changement de rattachement après transcription | PASS (statique) | L’analyse est invalidée, la transcription est conservée et doit être relancée. |
| Tâche Mon travail liée | PASS (statique) | Action « Note vocale » transmet les liens de la tâche. |
| Blocage API activité vocale orpheline | PASS (revue serveur) | `validate` refuse explicitement une activité vocale sans lien. |
| Droits sur objets liés | PASS (revue serveur) | Existence et permission de lecture de chaque lien vérifiées par le dépôt. |
| Audit note vocale | PASS (revue serveur) | Événement dédié avec fournisseur et contexte, plus audit de création. |
| Micro disponible / indisponible, dictée texte | NOT TESTED | Nécessite navigateur et matériel réels ; le fallback texte reste présent dans le code. |
| Parcours tactile 375 / 430 px | BLOCKED | Contrôle navigateur indisponible dans cet environnement. |
| Rôles réels READ_ONLY / Commercial / Manager / Direction | BLOCKED | Aucune identité de test autorisée ; aucun rôle créé pour la recette. |

## Verdict 5F

**NOT READY FOR DATA MIGRATION** — les contrôles statiques, TypeScript, lint et build sont satisfaisants, mais la recette de navigateur, du micro, de la persistance réelle et des rôles multi-utilisateurs reste bloquée. Aucun défaut bloquant supplémentaire n’a été observé dans la revue de code.

## Recette 5G — administration multi-utilisateurs (2026-09-26)

| Scénario | Statut | Preuve / raison |
|---|---|---|
| Navigation et sections SuperAdmin | PASS (statique) | Module et onglets conditionnés par les permissions. |
| Utilisateurs : recherche, filtre, création interne, édition | PASS (revue serveur + build) | Table et API `create-user` protégée. |
| Accès au Site : autorisé / en attente | PASS (revue serveur) | Création interne `PENDING`; aucune invitation réelle n’est envoyée. |
| Désactivation / dernier SuperAdmin | PASS (revue serveur) | `actor()` refuse un inactif et l’API protège le dernier SuperAdmin actif. |
| Équipes : responsable, actif, création, édition, désactivation | PASS (revue serveur + build) | `team_settings`, sans suppression. |
| Matrice rôles / permissions / scopes | PASS (revue serveur + build) | Matrice dynamique ; SuperAdmin système ; scope utilisateur plafonne le grant. |
| Administration Direction / Manager / Commercial / READ_ONLY | BLOCKED | Identités correspondantes non autorisées au Site privé. |
| Refus HTTP READ_ONLY après désactivation | BLOCKED | Règle revue statiquement, session réelle requise. |
| Audit changements administratifs | PASS (revue serveur) | Changements admin inscrits dans `audit_logs`. |
| Lint / Build | PASS | `npm run lint` et `npm run build` réussis le 26 septembre 2026. |

Avant migration, créer les dossiers CRM internes nécessaires puis autoriser explicitement au moins une identité ChatGPT de test par rôle dans le Site privé et exécuter les scénarios bloqués. Aucun accès externe n’a été accordé durant cette recette.

| Complément 5G | Utilisateur : accès Site distinct, permissions effectives, désactivation | PASS (revue serveur + build) | L’état actif est relu par `actor()` ; la table sépare CRM / Site et la fiche calcule les grants plafonnés par scope. |
| Complément 5G | Profils Test A à D avec accès Site réel | BLOCKED | Les comptes CRM fictifs peuvent être préparés mais aucune autorisation externe n’a été accordée. |
