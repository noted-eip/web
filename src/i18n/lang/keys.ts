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
  /*		AUTHENTICATION		*/

  /* Title */
  'AUTH.connection.Login',

  /* Button */
  'AUTH.connectionWithGoogle.Login',
  'AUTH.connectionWithFacebook.Login',
  'AUTH.registerWithGoogle.Register',
  'AUTH.registerWithFacebook.Register',
  'AUTH.getConnect.Generic',
  'AUTH.createAccount.Register',

  /* Label */
  'AUTH.email.Generic',
  'AUTH.password.Generic',
  'AUTH.firstName.Register',
  'AUTH.lastName.Register',
  'AUTH.rewritePassword.Register',

  /* Link */
  'AUTH.forgetPassword.Login',
  'AUTH.alreadyGotAccount.Register',

  /* Modal */
  'AUTH.sendYouEmail.ModalTitle',
  'AUTH.clickOnLink.ModalBody',
}
