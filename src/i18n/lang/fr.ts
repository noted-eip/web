import {LocaleTypedMessages} from '../types'

const frTranslation: LocaleTypedMessages = {
  /*    GENERIC   */
  'GENERIC.name': 'Nom',
  'GENERIC.home': 'Acceuil',
  'GENERIC.profile': 'Profil',
  'GENERIC.role': 'Rôle',
  'GENERIC.actions': 'Actions',
    
  /*		AUTHENTICATION		*/
  /*  Auth  */
  'AUTH.login': 'Connexion',
  'AUTH.register': 'Inscription',
  'AUTH.email': 'Email',
  'AUTH.pwd': 'Mot de passe',

  /* Signing */
  'SIGNIN.title': 'Connectez-vous à votre compte',
  'SIGNIN.signinGoogle': 'Connectez-vous avec Google',
  'SIGNIN.resetPwd': 'Réinitialiser le mot de passe',

  /*  Signup  */
  'SIGNUP.title': 'Créer un compte',
  'SIGNUP.signupGoogle': 'S\'inscrire avec Google',

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
  'RESETPWD.Token.form': 'Votre jeton',
  'RESETPWD.Token.button': 'Envoyer token',

  /*  ResetPassword Password  */
  'RESETPWD.Pwd.title': 'Crée un nouveau mot de passe',
  'RESETPWD.Pwd.desc': 'Entrez un nouveau mot de passe pour votre compte',
  'RESETPWD.Pwd.form': 'Confirmez le mot de passe',

  /*    LANDING    */
  /* Description */
  'DESCRIPTION': 'Déscription',
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
  'TIMELINE.desc4': 'Au cours de ce sprint, nous avons implémenté les fonctionnalités les plus importantes de notre application pour l\'édition et la recommandation de notes. A noté avoir sa première beta utilisable !',

  /* Team */
  'TEAM': 'L\'équipe',
  'TEAM.roleRespDeadDocs': 'Responsable Deadlines and docs',
  'TEAM.roleRespFront': 'Responsable Frontend',
  'TEAM.roleRespBack': 'Responsable Backend',
  'TEAM.roleRespPres': 'Responsable Presentation',
  'TEAM.roleDev': 'Développeur',
  'TEAM.descBackDevops': 'Développeur backend et devops',
  'TEAM.descMobile': 'Développeur mobile',
  'TEAM.descFront': 'Développeur frontend web',

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

  'GROUP.settings': 'Paramètres',
  'GROUP.upgrade': 'Améliorer',
  'GROUP.search': 'Chercher',

  /*    NOTE    */
  'NOTE.newNote': 'Nouvelle note',
  'NOTE.untitledNote': 'Note sans nom',

  /*    PROFILE    */
  'PROFILE.invite.deny': 'Refuser',
  'PROFILE.invite.accept': 'Accepter',
  'PROFILE.invite.desc': 'Vous n\'avez été invité à aucun groupe',
  'PROFILE.delete.title1': 'Zone dangereuse',
  'PROFILE.delete.title2': 'Supprimer mon compte',
  'PROFILE.delete.desc': 'Cela a pour effet de supprimer définitivement toutes vos données personnelles, y compris vos notes.',
  'PROFILE.delete.button': 'Supprimer le compte',

  /*    ACTIVITY    */
  'ACTIVITY': 'Activity',

  /*    SETTINGS    */
  'SETTINGS': 'Paramètres',
  'SETTINGS.langage.title': 'Langue',
  'SETTINGS.langage.options': 'Options',
  'SETTINGS.langage.french': 'Français',
  'SETTINGS.langage.english': 'Anglais',
}

export default frTranslation
