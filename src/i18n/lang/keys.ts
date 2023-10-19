export enum AvailableLang {
  'en',
  'fr',
}

/*
	How to create new traduction keys:
		- Divide the different part of the key with dot
		- Use this format: <first letters of the category of the word>.
												.<the word in english>.<page of the word>.<location of the word>.
		- Put in caps the first part of the key
		- The page and the location can be optional depending on the category
		- Put in caps the first letter of the page
		- Locate the word with the html tags and in UpperCamelCase
		- If the key is in multiple pages, put "Generic" for the page of the word
		- Categories of word:
				- Authentication
				- Profile information
				- Notes information
				- Generic
				-
 */

export enum TranslationKeys {
  /*    GENERIC   */
  'GENERIC.name',
  'GENERIC.home',
  'GENERIC.profile',
  'GENERIC.role',
  'GENERIC.actions',

  /*		AUTHENTICATION		*/
  /*  Auth  */
  'AUTH.login',
  'AUTH.register',
  'AUTH.email',
  'AUTH.pwd',

  /* Signing */
  'SIGNIN.title',
  'SIGNIN.signinGoogle',
  'SIGNIN.resetPwd',

  /*  Signup  */
  'SIGNUP.title',
  'SIGNUP.signupGoogle',

  /*    RESETPASSWORD   */

  /* ResetPassword Email  */
  'RESETPWD.Email.title',
  'RESETPWD.Email.desc1',
  'RESETPWD.Email.desc2',
  'RESETPWD.Email.form',
  'RESETPWD.Email.button',

  /* ResetPassword Token  */
  'RESETPWD.Token.title',
  'RESETPWD.Token.desc',
  'RESETPWD.Token.form',
  'RESETPWD.Token.button',

  /*  ResetPassword Password  */
  'RESETPWD.Pwd.title',
  'RESETPWD.Pwd.desc',
  'RESETPWD.Pwd.form',

  /*    LANDING    */
  /* Description */
  'DESCRIPTION',
  'DESCRIPTION.descP1',
  'DESCRIPTION.descP2',
  'DESCRIPTION.title1',
  'DESCRIPTION.title1.desc',
  'DESCRIPTION.title2',
  'DESCRIPTION.title2.desc',

  /* Timeline */
  'TIMELINE',
  'TIMELINE.desc1',
  'TIMELINE.desc2',
  'TIMELINE.desc3',
  'TIMELINE.desc4',

  /* Team */
  'TEAM',
  'TEAM.roleRespDeadDocs',
  'TEAM.roleRespFront',
  'TEAM.roleRespBack',
  'TEAM.roleRespPres',
  'TEAM.roleDev',
  'TEAM.descBackDevops',
  'TEAM.descMobile',
  'TEAM.descFront',

  /* Contact */
  'CONTACT',
  'CONTACT.title',

  /*    DASHBOARD   */
  'DASHBOARD.selectGroup',

  /*    GROUP   */
  'GROUP.Empty.title1',
  'GROUP.Empty.desc1',
  'GROUP.Empty.title2',
  'GROUP.Empty.desc2',
  'GROUP.createGroup',
  'GROUP.creatingGroup',

  'GROUP.settings',
  'GROUP.upgrade',
  'GROUP.search',

  'GROUP.settings.members.title',
  'GROUP.settings.members.button',
  'GROUP.settings.members.colTitle1',
  'GROUP.settings.members.colTitle2',
  'GROUP.settings.members.colTitle3',
  'GROUP.settings.members.colTitle4',

  'GROUP.settings.invites.title',
  'GROUP.settings.invites.colTitle1',
  'GROUP.settings.invites.colTitle2',
  'GROUP.settings.invites.colTitle3',
  'GROUP.settings.invites.colTitle4',
  'GROUP.settings.invites.desc',

  /*    NOTE    */
  'NOTE.newNote',
  'NOTE.untitledNote',
  'NOTE.timecodeA',
  'NOTE.timecodeB',
  'NOTE.duplicate',
  'NOTE.share',
  'NOTE.delete',

  /*    PROFILE    */
  'PROFILE.invite.deny',
  'PROFILE.invite.accept',
  'PROFILE.invite.desc',
  'PROFILE.delete.title1',
  'PROFILE.delete.title2',
  'PROFILE.delete.desc',
  'PROFILE.delete.button',
  'PROFILE.feedback.title',
  'PROFILE.feedback.desc',
  'PROFILE.feedback.button',
  'PROFILE.beta.title',
  'PROFILE.beta.subTitle',
  'PROFILE.beta.desc',
  'PROFILE.beta.subDesc',
  'PROFILE.beta.button',
  'PROFILE.beta.buttonResTrue',
  'PROFILE.beta.buttonResFalse',

  /*    ACTIVITY    */
  'ACTIVITY',

  /*    SETTINGS    */
  'SETTINGS',
  'SETTINGS.langage.title',
  'SETTINGS.langage.options',
  'SETTINGS.langage.french',
  'SETTINGS.langage.english',
}
