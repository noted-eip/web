export const API_BASE: string =
  process.env.REACT_APP_API_BASE || 'https://noted-rojasdiego.koyeb.app'

export const TOGGLE_DEV_FEATURES = !!process.env.REACT_APP_TOGGLE_DEV_FEATURES || false

export const GOOGLE_CLIENT_ID: string =
  process.env.REACT_GOOGLE_CLIENT_ID || ''