import {LocaleTypedMessages} from '../types'

const frTranslation: LocaleTypedMessages = {
  /*    GENERIC   */
  'GENERIC.name': 'Nom',
  'GENERIC.home': 'Accueil',
  'GENERIC.profile': 'Profil',
  'GENERIC.groups': 'Groupes',
  'GENERIC.notes': 'Notes',
  'GENERIC.role': 'Rôle',
  'GENERIC.actions': 'Actions',
  'GENERIC.logout': 'Déconnexion',
  'GENERIC.copy': 'Copie',

  /*		AUTHENTICATION		*/
  /*  Auth  */
  'AUTH.login': 'Connexion',
  'AUTH.register': 'Inscription',
  'AUTH.email': 'Email',
  'AUTH.pwd': 'Mot de passe',
  'AUTH.error.name': 'Nom invalide',
  'AUTH.error.email': 'Adresse email invalide',
  'AUTH.error.pwd': '6 caractères, lettres, chiffres et symboles',

  /* Signing */
  'SIGNIN.title': 'Connectez-vous à votre compte',
  'SIGNIN.signinGoogle': 'Connectez-vous avec Google',
  'SIGNIN.resetPwd': 'Réinitialiser le mot de passe',


  /*  Signup  */
  'SIGNUP.title': 'Créer un compte',
  'SIGNUP.signupGoogle': 'S\'inscrire avec Google',
  'SIGNUP.wantSignIn': 'J\'ai déjà un compte',
  'SIGNUP.wantSignUp': 'Je veux créer un compte',
  'SIGNUP.formHelperText': '4 caractères requis',
  'SIGNUP.accessBeta1': 'Une fois enregistré, vous pouvez demander un accès anticipé à notre application mobile dans les paramètres de votre compte ! ',
  'SIGNUP.accessBeta2': 'Ne fonctionne que pour les courriels liés à un compte Google.',
  'SIGNUP.termsCheckbox1': 'Je suis d\'accord avec les',
  'SIGNUP.termsCheckbox2': 'conditions d\'utilisation',
  'SIGNUP.terms1': 'Les présentes CGU ou Conditions Générales d’Utilisation encadrent juridiquement l’utilisation des services du site noted.',
  'SIGNUP.terms2': 'Constituant le contrat entre la société Noted, l’Utilisateur, l’accès au site doit être précédé de l’acceptation de ces CGU. L’accès à cette plateforme signifie l’acceptation des présentes CGU.',
  'SIGNUP.terms3': 'Pour la création du compte de l’Utilisateur, la collecte des informations au moment de l’inscription sur le site est nécessaire et obligatoire. Conformément à la loi n°78-17 du 6 janvier relative à l’informatique, aux fichiers et aux libertés, la collecte et le traitement d’informations personnelles s’effectuent dans le respect de la vie privée.',
  'SIGNUP.terms4': 'Les marques, logos ainsi que les contenus du site noted (illustrations graphiques, textes…) sont protégés par le Code de la propriété intellectuelle et par le droit d’auteur.',
  'SIGNUP.terms5': 'Noted dispose du droit d’exercer une modération à priori sur les publications et peut refuser leur mise en ligne sans avoir à fournir de justification.',
  'SIGNUP.closeModal': 'Fermer la fenêtre',
  'SIGNUP.termsService': 'Terms of Service',

  /* Home */
  'HOME.lastGroups': 'Derniers groupes',
  'HOME.lastNotes': 'Dernières notes',
  
  /*    RESETPASSWORD   */

  /* ResetPassword Email  */
  'RESETPWD.Email.title': 'Mot de passe oublié?',
  'RESETPWD.Email.desc1': 'Saisissez l\'adresse e-mail associée à votre compte',
  'RESETPWD.Email.desc2': 'Nous vous enverrons un code de vérification par e-mail pour vérifier votre authenticité',
  'RESETPWD.Email.form': 'Votre e-mail',
  'RESETPWD.Email.button': 'Envoyer e-mail',

  /* ResetPassword Token  */
  'RESETPWD.Token.title': 'Vérification',
  'RESETPWD.Token.desc': 'Entrez le code de vérification que nous venons de vous envoyer sur votre adresse e-mail',
  'RESETPWD.Token.noCode': 'Vous n\'avez pas reçu le code ? ',
  'RESETPWD.Token.resend': 'Renvoyez le code',
  'RESETPWD.Token.badToken': 'Mauvais token',
  'RESETPWD.Token.tokenResend': 'Un nouveau code a été envoyé !',

  /*  ResetPassword Password  */
  'RESETPWD.Pwd.title': 'Crée un nouveau mot de passe',
  'RESETPWD.Pwd.desc': 'Entrez un nouveau mot de passe pour votre compte',
  'RESETPWD.Pwd.form': 'Confirmez le mot de passe',
  'RESETPWD.Pwd.form2': 'Mot de passe différent',

  /*    LANDING    */
  /* Description */
  'DESCRIPTION': 'Description',
  'DESCRIPTION.descP1': 'Noted est un espace de travail ergonomique destiné aux étudiants universitaires. Il s\'agit d\'une application Web où ils peuvent partager leurs notes et les organiser.',
  'DESCRIPTION.descP2': 'La force de Noted est son mode d\'édition unique, qui comprend des recommandations basées sur des notes publiées par les étudiants. Il permettra aux étudiants d\'améliorer leurs notes en facilitant la collaboration.',
  'DESCRIPTION.title1': 'Prendre des notes',
  'DESCRIPTION.title1.desc': 'Vous pouvez créer et modifier des notes avec un système de recommandations.',
  'DESCRIPTION.title2': 'Partagez vos notes',
  'DESCRIPTION.title2.desc': 'Vous avez toutes les notes de votre groupe.',

  /* Timeline */
  'TIMELINE': 'Calendrier',
  'TIMELINE.desc1': 'Au cours de ce sprint, nous essayons différentes technologies et bibliothèques pour le backend et pour le web, le mobile et le bureau.',
  'TIMELINE.desc2': 'Au cours de ce sprint, nous choisissons quelles technologies et bibliothèques seront utilisées et quelle plate-forme sera prise en charge. Ensuite, nous commençons à créer la fonctionnalité principale de Noted.',
  'TIMELINE.desc3': 'Au cours de ce sprint, nous avons amélioré et finalisé les fonctionnalités du dernier sprint et commencé les prochaines fonctionnalités de base.',
  'TIMELINE.desc4': 'Au cours de ce sprint, nous avons implémenté les fonctionnalités les plus importantes de notre application pour l\'édition et la recommandation de notes. Noted a sa première beta utilisable !',
  'TIMELINE.desc5': 'Au cours de ce sprint, nous avons continué l\'implémentation des fonctionnalités majeures de l\'application.',
  'TIMELINE.desc6': 'Au cours de ce sprint, nous avons développé l\'unicité graphique entre le frontend et le mobile, implémenté les dernières fonctionnalités comme le quiz et réglé tous les derniers problèmes graphiquent et de logique.',
  /* Team */
  'TEAM': 'L\'équipe',
  'TEAM.roleRespDeadDocs': 'Responsable Deadlines and docs',
  'TEAM.roleRespFront': 'Responsable Frontend',
  'TEAM.roleRespBack': 'Responsable Backend',
  'TEAM.roleRespPres': 'Responsable Presentation',
  'TEAM.rolePersona': 'Responsable Persona',
  'TEAM.descBackDevops': 'Développeur backend et devops',
  'TEAM.descMobile': 'Développeur mobile',
  'TEAM.descFront': 'Développeur frontend',

  /* Contact */
  'CONTACT': 'Contact',
  'CONTACT.title': 'Chef Noted',

  /*    DASHBOARD   */
  'DASHBOARD.selectGroup': 'Sélectionnez un groupe',

  /*    GROUP   */
  'GROUP.Empty.title1': 'Aucun groupe',
  'GROUP.Empty.desc1': 'Créez ou rejoignez un groupe pour commencer à écrire !',
  'GROUP.Empty.title2': 'Invitations',
  'GROUP.Empty.desc2': 'Les invitations aux groupes s\'afficheront ici.',
  'GROUP.createGroup': 'Créer un groupe',
  'GROUP.creatingGroup': 'Création...',
  'GROUP.inMyGroup': 'Dans mon groupe...',
  'GROUP.myGroup': 'Mon Groupe',
  'GROUP.createdOn': 'Créer le ',

  'GROUP.settings': 'Paramètres',
  'GROUP.upgrade': 'Améliorer',
  'GROUP.search': 'Chercher',

  'GROUP.settings.members.title': 'Membres',
  'GROUP.settings.members.button': 'Envoyer invitation',
  'GROUP.settings.members.colTitle1': 'NOM',
  'GROUP.settings.members.colTitle2': 'EMAIL',
  'GROUP.settings.members.colTitle3': 'RÔLE',
  'GROUP.settings.members.colTitle4': 'ACTIONS',

  'GROUP.settings.invites.title': 'Invitation en cours',
  'GROUP.settings.invites.colTitle1': 'DESTINÉ À',
  'GROUP.settings.invites.colTitle2': 'INVITÉ PAR',
  'GROUP.settings.invites.colTitle3': 'EXPIRE DANS',
  'GROUP.settings.invites.colTitle4': 'ACTIONS',
  'GROUP.settings.invites.desc': 'Aucune invitation en attente pour ce groupe',

  'GROUP.noteTab.rename': 'Renommer',
  'GROUP.noteTab.copyLink': 'Copier le lien',
  'GROUP.noteTab.delete': 'Supprimer',

  /*    NOTE    */
  'NOTE.myNotes': 'Mes notes',
  'NOTE.newNote': 'Nouvelle note',
  'NOTE.untitledNote': 'Note sans nom',
  'NOTE.timecodeA': 'Dernière modification',
  'NOTE.timecodeB': 'par',
  'NOTE.duplicate': 'Dupliquer',
  'NOTE.share': 'Partager',
  'NOTE.delete': 'Supprimer',
  'NOTE.export.button1': 'Exporter en PDF',
  'NOTE.export.button2': 'Exporter en Markdown',
  'NOTE.export.button3': 'Exporter',

  /* Notes */
  'NOTES.noNotes': 'Aucune notes',

  /*    PROFILE    */
  'PROFILE.invite.deny': 'Refuser',
  'PROFILE.invite.accept': 'Accepter',
  'PROFILE.invite.desc': 'Vous n\'avez été invité à aucun groupe',
  'PROFILE.delete.title1': 'Zone dangereuse',
  'PROFILE.delete.title2': 'Supprimer mon compte',
  'PROFILE.delete.desc': 'Cela a pour effet de supprimer définitivement toutes vos données personnelles, y compris vos notes.',
  'PROFILE.delete.button': 'Supprimer le compte',
  'PROFILE.feedback.title': 'Envoyer retour',
  'PROFILE.feedback.desc': 'Votre avis nous intéresse ! Remplissez un formulaire rapide pour nous aider à améliorer notre application. Peut-être verrez-vous une de vos idées dans nos prochaines mises à jour !',
  'PROFILE.feedback.button': 'Accéder au formulaire',
  'PROFILE.beta.title': 'Fonctionnalités supplémentaires',
  'PROFILE.beta.subTitle': 'Application mobile',
  'PROFILE.beta.desc': 'Vous recevrez une invitation pour installer l\'application sur votre téléphone. Avec lui vous pouvez parcourir vos groupes, notes, invitations, membres et recommandations mais vous ne pouvez pas modifier vos notes (encore 😉).',
  'PROFILE.beta.subDesc': 'L\'email de votre compte doit être lié à un compte Google pour être invité !',
  'PROFILE.beta.button': 'Accéder à la beta',
  'PROFILE.beta.buttonResTrue': 'Envoyé!',
  'PROFILE.beta.buttonResFalse': 'Déjà rejoint',
  'PROFILE.langage.title': 'Langue',
  'PROFILE.langage.desc': 'Modifiez la langue utilisée dans l’interface utilisateur.',
  'PROFILE.langage.options': 'Options',
  'PROFILE.langage.fr': 'Français',
  'PROFILE.langage.en': 'Anglais',
  'PROFIILE.beta': 'Vous avez maintenant accès à la version bêta',

  /*    PANEL   */
  'PANEL.activity': 'Activité',
  'PANEL.activity.loading': 'Chargement de vos activités...',
  'PANEL.activity.none': 'Aucune activité récente',
  'PANEL.activity.noGroup': 'Aucun groupe sélectionné',
  'PANEL.companion': 'Compagnion',
  'PANEL.companion,buton1': 'Filtrer par block',
  'PANEL.companion,buton2': 'Filtrer avec la note entière',
  'PANEL.companion,buton3': 'Appliquer',
  'PANEL.comments': 'Commentaires',
  'PANEL.comments.empty': 'Aucun commentaires',
  'PANEL.comments.loading': 'Chargement des commentaires du block...',
  'PANEL.comments.noblock': 'Aucun block sélectionné',
  'PANEL.comments.comment': 'Commentaire',
  'PANEL.quizs': 'Quizs',
  'PANEL.quizs.notFound': 'Votre quiz n\' a pas été trouvé',
  'PANEL.quizs.next': 'Suivant',
  'PANEL.quizs.generate': 'Générer',
  'PANEL.leaderboard': 'Classement',
  'PANEL.leaderboard.loading': 'Chargement du classement..',
  'PANEL.leaderboard.none': 'Pas de classement',


  /*    ACTIVITY    */
  'ACTIVITY': 'Activity',

  /*    SETTINGS    */
  'SETTINGS': 'Paramètres',
  'SETTINGS.langage.title': 'Langue',
  'SETTINGS.langage.options': 'Options',
  'SETTINGS.langage.french': 'Français',
  'SETTINGS.langage.english': 'Anglais',

  /*    CONFIRMATION    */
  'CONFIRMATION.form.desc0': 'Veuilliez entrer',
  'CONFIRMATION.form.desc1': 'compris',
  'CONFIRMATION.form.desc3': 'pour confirmer',
  'CONFIRMATION.button': 'Je comprends les conséquences, ',
  'CONFIRMATION.title.note': 'Supprimer ma note',
  'CONFIRMATION.title.group': 'Supprimer un membre',

  /*    VALIDATION    */
  'VALIDATION.title': 'Veuillez valider votre compte',
  'VALIDATION.content': 'Vous avez reçus un code d\'activation à l\'adresse suivante :',
  'VALIDATION.placeholder': '0000',
  'VALIDATION.button': 'Valider',
  'VALIDATION.resend': 'Je n\'ai pas reçus le code',
  'VALIDATION.resend_link': 'l\'envoyer à nouveau',

  /*    EDITOR    */
  'EDITOR.placeholder': 'Insérez votre text ici...',

  /*    ERROR    */
  'ERROR.connection.created_with_google' : 'Veuillez vous connecter avec Google.',
  'ERROR.input_invalid' : 'Les mots de passe ne correspondent pas.',
  'ERROR.creation.already_exist' : 'Ce compte existe déjà.',
  'ERROR.validation.token_does_not_match' : 'Le code ne correspond pas.',
  'ERROR.export.something_wrong' : 'Une erreur est survenue lors de l\'exportation.',
  'ERROR.quiz.something_wrong' : 'Une erreur est survenue lors de la génération du quiz.',
  'ERROR.invite.something_wrong': 'Une erreur est survenue lors de l\'envoi de l\'invitation.',
  'ERROR.invite.already_exist': 'cette personne à déjà reçus une invitation.',
  'ERROR.unknown' : 'Erreur inconnue',

  /*    QUIZS    */
  'QUIZS.button.check': 'Vérifier',
  'QUIZS.button.next': 'Suivant',
  'QUIZS.button.quit': 'Retourner à la note',
  'QUIZS.score': 'Votre score est de',
  'QUIZS.noQuiz': 'Chargement de votre quiz...',
}

export default frTranslation
