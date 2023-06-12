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

  /*    NOTE    */
  'NOTE.newNote',
  'NOTE.untitledNote',

  /*    PROFILE    */
  'PROFILE.invite.deny',
  'PROFILE.invite.accept',
  'PROFILE.invite.desc',
  'PROFILE.delete.title1',
  'PROFILE.delete.title2',
  'PROFILE.delete.desc',
  'PROFILE.delete.button',

  /*    ACTIVITY    */
  'ACTIVITY',
}
