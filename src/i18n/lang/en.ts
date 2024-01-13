import {LocaleTypedMessages} from '../types'

const enTranslation: LocaleTypedMessages = {
  /*    GENERIC   */
  'GENERIC.name': 'Name',
  'GENERIC.home': 'Home',
  'GENERIC.profile': 'Profile',
  'GENERIC.groups': 'Groups',
  'GENERIC.notes': 'Notes',
  'GENERIC.role': 'Role',
  'GENERIC.actions': 'Actions',
  'GENERIC.logout': 'Logout',

  /*		AUTHENTICATION		*/
  /*  Auth  */
  'AUTH.login': 'Login',
  'AUTH.register': 'Register',
  'AUTH.email': 'Email',
  'AUTH.pwd': 'Password',
  'AUTH.error.name': 'Invalid name',
  'AUTH.error.email': 'Invalid email address',
  'AUTH.error.pwd': '6 characters, letters numbers and symbols',

  /* Signing */
  'SIGNIN.title': 'Signin to your account',
  'SIGNIN.signinGoogle': 'Sign in with Google',
  'SIGNIN.resetPwd': 'Reset password',

  /*  Signup  */
  'SIGNUP.title': 'Create an account',
  'SIGNUP.signupGoogle': 'Sign up with Google',
  'SIGNUP.wantSignIn': 'Already have an account',
  'SIGNUP.wantSignUp': 'I want to create an account',

  /*    RESETPASSWORD   */

  /* ResetPassword Email  */
  'RESETPWD.Email.title': 'Forgot password?',
  'RESETPWD.Email.desc1': 'Enter the email address associated with your account',
  'RESETPWD.Email.desc2': 'We will email you a verification code to check your authenticity',
  'RESETPWD.Email.form': 'Your email',
  'RESETPWD.Email.button': 'Send email',

  /* ResetPassword Token  */
  'RESETPWD.Token.title': 'Verification',
  'RESETPWD.Token.desc': 'Enter the verification code we just sent you on your email address',
  'RESETPWD.Token.form': 'Your token',
  'RESETPWD.Token.button': 'Send token',

  /*  ResetPassword Password  */
  'RESETPWD.Pwd.title': 'Create a new password',
  'RESETPWD.Pwd.desc': 'Enter a new password for your account',
  'RESETPWD.Pwd.form': 'Confirm Password',
  'RESETPWD.Pwd.form2': 'Not the same password',

  /*    LANDING    */
  /* Description */
  'DESCRIPTION': 'Description',
  'DESCRIPTION.descP1': 'Noted is an ergonomic workspace destined to university students. It is a web application where they can share their notes and organize them.',
  'DESCRIPTION.descP2': 'Noted’s strength is its unique editing mode which includes recommendations based on notes published by students. It will allow students to improve their notes by facilitating collaboration.',
  'DESCRIPTION.title1': 'Take notes',
  'DESCRIPTION.title1.desc': 'You can create and edit notes with a system of recommendations.',
  'DESCRIPTION.title2': 'Share your notes',
  'DESCRIPTION.title2.desc': 'You have all the notes of your group.',

  /* Timeline */
  'TIMELINE': 'Timeline',
  'TIMELINE.desc1': 'During this sprint we try different technologies and libraries for the backend and for web, mobile and desktop frontend.',
  'TIMELINE.desc2': 'During this sprint we choose which technologies and libraries will be used and which platform will be supported. Then we begin to create the main feature of Noted.',
  'TIMELINE.desc3': 'During this sprint we improved and finalize the features from the last sprint and begin the next core features.',
  'TIMELINE.desc4': 'During this sprint we implemented the most important features of our application for the notes edition and recommendation. Noted have his first beta usable !',

  /* Team */
  'TEAM': 'The team',
  'TEAM.roleRespDeadDocs': 'Deadlines and docs responsible',
  'TEAM.roleRespFront': 'Frontend responsible',
  'TEAM.roleRespBack': 'Backend responsible',
  'TEAM.roleRespPres': 'Presentation responsible',
  'TEAM.roleDev': 'Developer',
  'TEAM.descBackDevops': 'Backend and devops developer',
  'TEAM.descMobile': 'Mobile developer',
  'TEAM.descFront': 'Frontend developer',

  /* Contact */
  'CONTACT': 'Contact',
  'CONTACT.title': 'Noted Chief',

  /*    DASHBOARD   */
  'DASHBOARD.selectGroup': 'Select a group',  

  /*    GROUP   */
  'GROUP.Empty.title1': 'No Group',
  'GROUP.Empty.desc1': 'Create or join a group to start writing!',
  'GROUP.Empty.title2': 'Invites',
  'GROUP.Empty.desc2': 'Invites to groups will show up here.',
  'GROUP.createGroup': 'Create a group',
  'GROUP.creatingGroup': 'Creating...',
  'GROUP.inMyGroup': 'In my group...',

  'GROUP.settings': 'Settings',
  'GROUP.upgrade': 'Upgrade',
  'GROUP.search': 'Seach',

  'GROUP.settings.members.title': 'Members',
  'GROUP.settings.members.button': 'Send invite',
  'GROUP.settings.members.colTitle1': 'NAME',
  'GROUP.settings.members.colTitle2': 'EMAIL',
  'GROUP.settings.members.colTitle3': 'ROLE',
  'GROUP.settings.members.colTitle4': 'ACTIONS',

  'GROUP.settings.invites.title': 'Pending Invites',
  'GROUP.settings.invites.colTitle1': 'DESTINED TO',
  'GROUP.settings.invites.colTitle2': 'INVITED BY',
  'GROUP.settings.invites.colTitle3': 'EXPIRES IN',
  'GROUP.settings.invites.colTitle4': 'ACTIONS',
  'GROUP.settings.invites.desc': 'No pending invites for this group',

  /*    NOTE    */
  'NOTE.myNotes': 'My notes',
  'NOTE.newNote': 'New note',
  'NOTE.untitledNote': 'Untitled note',
  'NOTE.timecodeA': 'Last edited',
  'NOTE.timecodeB': 'by',
  'NOTE.duplicate': 'Duplicate',
  'NOTE.share': 'Share',
  'NOTE.delete': 'Delete',
  'NOTE.export.button1': 'Export in PDF',
  'NOTE.export.button2': 'Export in Markdown',
  'NOTE.export.button3': 'Export',

  /*    PROFILE    */
  'PROFILE.invite.deny': 'Deny',
  'PROFILE.invite.accept': 'Accept',
  'PROFILE.invite.desc': 'You haven’t been invited to any group',
  'PROFILE.delete.title1': 'Danger Zone',
  'PROFILE.delete.title2': 'Delete my account',
  'PROFILE.delete.desc': 'This has the effect of permanently deleting all of your personal data including your notes.',
  'PROFILE.delete.button': 'Delete Account',
  'PROFILE.feedback.title': 'Send feedback',
  'PROFILE.feedback.desc': 'We are interested in your opinion! Fill in a quick form to help us improve our application. Maybe you will see one of your ideas in our next updates!',
  'PROFILE.feedback.button': 'Access Form',
  'PROFILE.beta.title': 'Extra features',
  'PROFILE.beta.subTitle': 'Mobile application',
  'PROFILE.beta.desc': 'You will receive an invite to install the application on your phone. With it you can browse your groups, notes, invitations, members and recommendations but cannot modify your notes (yet 😉).',
  'PROFILE.beta.subDesc': 'Your account\'s email should be linked to a Google account in order to be invited!',
  'PROFILE.beta.button': 'Access beta',
  'PROFILE.beta.buttonResTrue': 'Sent!',
  'PROFILE.beta.buttonResFalse': 'Already joined',
  'PROFILE.langage.title': 'Langage',
  'PROFILE.langage.desc': 'Change the language used in the user interface.',
  'PROFILE.langage.options': 'Options',
  'PROFILE.langage.fr': 'French',
  'PROFILE.langage.en': 'English',

  /*    PANEL   */
  'PANEL.activity': 'Activity',
  'PANEL.activity.loading': 'Loading your activities...',
  'PANEL.activity.none': 'No recent activity',
  'PANEL.activity.noGroup': 'No group selected',
  'PANEL.companion': 'Companion',
  'PANEL.companion,buton1': 'Filter by block',
  'PANEL.companion,buton2': 'Filter by entire note',
  'PANEL.companion,buton3': 'Apply',

  /*    ACTIVITY    */
  'ACTIVITY': 'Activity',

  /*    SETTINGS    */
  'SETTINGS': 'Settings',
  'SETTINGS.langage.title': 'Langage',
  'SETTINGS.langage.options': 'Options',
  'SETTINGS.langage.french': 'French',
  'SETTINGS.langage.english': 'English',

  /*    VALIDATION    */
  'VALIDATION.title': 'Please validate your account',
  'VALIDATION.content': 'You received an activation code at the following address:',
  'VALIDATION.placeholder': '0000',
  'VALIDATION.button': 'Validate',
  'VALIDATION.resend': 'I did not receive the code',
  'VALIDATION.resend_link': 'send again',

  /*    ERRORS    */
  'ERROR.connection.created_with_google': 'Please login with Google.',
  'ERROR.connection.input_invalid': 'Invalid email or password.',
  'ERROR.connection.input_does_not_match': 'Invalid email or password.',
  'ERROR.creation.already_exist': 'This email is already used.',
  'ERROR.creation.input_invalid': 'Invalid email or password.',
  'ERROR.validation.token_does_not_match': 'Invalid token.',
  'ERROR.export.something_wrong': 'An error occured while exporting.',
  'ERROR.quiz.something_wrong': 'An error occured while creating the quiz.',
  'ERROR.invite.something_wrong': 'An error occured while sending the invite.',
  'ERROR.invite.already_exist': 'This user is already invited.',
  'ERROR.unknown': 'Unknown error',
}

export default enTranslation
