export const API_BASE: string =
  process.env.REACT_APP_API_BASE || 'https://noted-rojasdiego.koyeb.app'
  //process.env.REACT_APP_API_BASE || 'http://localhost:3000'

export const GOOGLE_CLIENT_ID: string =
  process.env.REACT_GOOGLE_CLIENT_ID || '871625340195-kf7c2u88u9aivgdru776a36hgel0kjja.apps.googleusercontent.com'
  
export const TOGGLE_DEV_FEATURES = !!process.env.REACT_APP_TOGGLE_DEV_FEATURES || false