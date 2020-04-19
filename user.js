const users = [];

const checkUserExistByEmail = (email) => {
  const duplicatedUser = users.find(e => e.email === email)
  
  if (duplicatedUser) return true
  
  return false
}

module.exports = {
  checkUserExistByEmail,
  users,
}