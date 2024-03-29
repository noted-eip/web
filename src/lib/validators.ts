export const validateEmail = (email: string): undefined | string => {
  const regex =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>().,;\s@"]+\.{0,1})+([^<>().,;:\s@"]{2,}|[\d.]+))$/
  if (regex.test(email)) {
    return undefined
  }
  return 'Invalid email address'
}

export const validateName = (name: string): undefined | string => {
  const regex = /^[A-Za-z]{4,}$/
  if (regex.test(name)) {
    return undefined
  }
  return 'Name must be A-Z and over 2 characters long'
}

export const validatePassword = (password: string): undefined | string => {
  const regex = /^[\s\S]{6,}$/
  if (regex.test(password)) {
    return undefined
  }
  return 'Invalid password'
}

export const validateCode = (code: string): undefined | string => {
  if (code.match('[0-9]+') && code.length === 4) {
    return undefined
  }
  return 'Code must be 0-9 and 4 characters long'
}
