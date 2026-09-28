# LUKE CRM — sécurité du socle persistant

## Identité et sessions
Le Site privé s’appuie sur la connexion native ChatGPT. Le dispatcher transmet `oai-authenticated-user-id` et `oai-authenticated-user-email` au serveur ; l’application ne stocke ni ne vérifie de mot de passe. La page CRM demande une session et les API vérifient la même identité indépendamment. Une identité inconnue ou un utilisateur désactivé reçoit un refus. La déconnexion utilise la route native `/signout-with-chatgpt`. L’expiration doit conduire à une nouvelle connexion ; une mutation en cours est signalée et une erreur serveur ne doit jamais être interprétée comme une sauvegarde réussie.

L’utilisateur `u1` est associé au premier propriétaire authentifié d’une base vierge. Les profils de test supplémentaires ne doivent recevoir d’`auth_id` que via une adresse vérifiée et un accès explicitement accordé au Site. Une adresse seule ne rend pas accessible un Site owner-private. La création initiale du Super Admin suppose que l’accès privé est réservé au propriétaire ; si l’audience change avant initialisation, le bootstrap doit être revu.

## Autorisation
Les tables `roles`, `permissions`, `role_permissions` expriment les actions et le scope. `OWN` vérifie l’Owner du dossier, `TEAM` l’équipe principale de cet Owner, `ALL` l’ensemble. Chaque route de lecture, écriture, suppression logique, administration ou conversion vérifie la permission côté serveur. Les contrôles visuels ne remplacent pas cette vérification. Les changements de propriétaire exigent aussi une permission `*.assign` sur l’ancien et le nouveau périmètre. Le moindre privilège est la valeur par défaut : permission absente = refus. `READ_ONLY` ne reçoit que les permissions de lecture.

Le Site reste privé. L’élargissement de l’audience ou l’association d’une identité supplémentaire à un rôle doit être explicitement autorisé puis testé sous chaque profil. Ne pas traiter un nom d’utilisateur fictif comme une session authentifiée.

## Intégrité et audit
D1 impose les clés étrangères pour les relations principales. Les services valident les propriétaires, le lien Account/Contact/Site/Opportunity, l’étape dans son pipeline, les statuts, la raison de perte et les champs requis. La conversion Prospect est atomique. Les changements critiques et mutations admin sont inscrits dans `audit_logs` avec acteur, heure, objet, action, ancienne et nouvelle valeur ; les reports disposent aussi de `task_history`. Les objets supprimés sont marqués `deleted_at`/`deleted_by` et omis des lectures normales.

Les valeurs d’origine sont conservées séparément des champs normalisés de recherche. Les taux de change sont manuels, horodatés et figés sur chaque opportunité au moment de la conversion. Aucun taux manquant n’est deviné. Les exports futurs nécessiteront `data.export` et un audit spécifique.

## Données et exploitation
Seul le seed `fictional-v1` est utilisé ; les documents financiers joints et les données clients réelles sont exclus. Les secrets doivent rester dans la configuration du fournisseur, hors du dépôt et hors des journaux. Les erreurs techniques sont journalisées côté serveur, avec message bref côté utilisateur. L’accès à l’audit, une politique de conservation, l’effacement légal, la sauvegarde/restauration, la rotation d’identités et les droits par territoire/Business Line devront être définis avant migration réelle. Le script de reset vise uniquement D1 local avec confirmation explicite et ne doit jamais être exécuté sur la production.

## Contrôles de stabilisation 5B
Les activités et tâches consultées sont filtrées côté serveur selon leur propriétaire et leurs fiches liées. La lecture d'une opportunité appartenant à B reste permise à B lorsque son compte appartient à A ; cela ne donne pas à B accès à la fiche complète du compte. Une activité liée à cette opportunité peut être consultée sans ouvrir le compte d'A. Les créations et modifications de liens vérifient les droits sur les fiches associées. L'auteur d'une activité créée par API est imposé à l'identité de session. Les changements d'Owner exigent des grants `*.assign` ; la configuration correspondante est ajoutée par migration additive. Aucun droit n'est accordé à READ_ONLY.

La matrice `UAT_CHECKLIST.md` définit les scénarios côté interface et API avec des identités distinctes, ainsi que l'examen des journaux d'audit. Aucun testeur supplémentaire n'est lié à une identité sans adresse, rôle, équipe et autorisation du propriétaire. Une validation manuelle du modèle Account A / Opportunity B, des états de session et des droits effectifs reste nécessaire avant des données réelles.

L'essai local du prédicat OWN/TEAM et du seed a confirmé un seul marqueur `fictional-v1`, huit utilisateurs fictifs et aucun grant de mutation READ_ONLY. Il ne remplace pas des appels HTTP authentifiés sous les six rôles : aucun compte test supplémentaire n'a reçu d'accès. La désactivation visuelle exhaustive des actions READ_ONLY reste à valider/corriger avant de qualifier la recette multi-utilisateurs complète ; le refus côté serveur demeure obligatoire.

## Parcours B2C 5C
Le serveur exige un Contact `INDIVIDUAL` sans Account, une source admise, un moyen de contact et un Owner existant. Une opportunité `B2C` exige ce Contact, `businessLine = Services`, le pipeline Services et aucun Account ; le centre éventuel doit appartenir au référentiel actif. Les activités et tâches peuvent lier directement un Contact sans Account. La recherche de doublons et les résultats de la recherche globale restent limités aux fiches visibles pour la session. Les changements de statut relationnel et la promotion en Client actif sont audités. Les champs de consentement, s’ils sont présents, ne créent aucun consentement tacite et aucune campagne n’est activée.

## Capture assistée 5D
Les images de carte et l’audio brut ne sont pas persistés ni envoyés à un fournisseur externe dans la version actuelle. L’OCR `TextDetector` et la reconnaissance vocale du navigateur ne démarrent qu’après action de l’utilisateur ; les solutions de repli sont la saisie manuelle et la note texte. La transcription, le résumé et les champs proposés n’écrivent rien avant « Valider et enregistrer ». Les opérations réutilisent les API persistantes existantes et donc les permissions sur Contact, Account, Opportunity, Activity et Task. Les audits ajoutent les créations de contacts/comptes par carte, les activités/tâches vocales et les changements d’étape validés depuis une note vocale. L’activation future d’un fournisseur OCR ou de transcription serveur devra préciser le pays de traitement, les clés secrètes, la durée de conservation temporaire et l’accord de sous-traitance avant sa configuration.

## Recette 5E — constat de sécurité
La revue statique du 26 septembre 2026 confirme que les routes CRM passent par `actor()` et appliquent les permissions côté serveur ; `READ_ONLY` ne reçoit que les lectures dans le seed. Les relations liées sont contrôlées avant écriture et aucune clé applicative n'est exposée dans le client ou dans le dépôt. Cette revue ne remplace pas les tests HTTP authentifiés sous DIRECTION, SALES_MANAGER, COMMERCIAL et READ_ONLY : ces identités ne sont pas liées au Site privé. Aucune donnée réelle ne doit être migrée tant que les essais croisés de scope, de refus 403 et d'audit ne sont pas documentés dans `UAT_CHECKLIST.md`.
# Addendum 5F — intégrité des notes vocales

Le serveur refuse toute activité `captureOrigin: voice` sans au moins un lien `prospectId`, `contactId`, `accountId` ou `opportunityId`, y compris par appel direct à l’API. La validation de liens existants et des droits de lecture est appliquée côté serveur avant l’écriture. La recherche du rattachement s’appuie uniquement sur les collections renvoyées par les routes déjà filtrées par permissions.

L’audit `activity.voice.create` conserve le fournisseur d’extraction et les identifiants de contexte ; l’audit générique de création conserve le contenu validé. Aucun audio brut n’est persisté.

## Addendum 5G — gouvernance des accès

`user_access` conserve le scope applicatif, l’état d’accès au Site et la dernière connexion ; `team_settings` conserve le responsable et le statut de l’équipe. À chaque requête authentifiée, `actor()` relit l’état actif et le scope : une désactivation prend effet côté serveur. Le scope final est le minimum entre le grant de rôle/permission et le scope du dossier utilisateur.

Les routes d’administration exigent leurs permissions dédiées (`admin.users`, `admin.teams`, `admin.roles`, `admin.rates`, `admin.config`, `audit.read`). Toute mutation est auditée. L’API refuse de retirer les droits du dernier SuperAdmin actif. La liaison d’un e-mail à une identité ne contourne pas l’accès owner-private du Site : l’autorisation externe demeure obligatoire.
