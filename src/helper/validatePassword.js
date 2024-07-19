const validatePassword = (password) => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-!@#$%^&*()_+=[\]{}|;':",./<>?\\]).{8,}$/;
  return passwordRegex.test(password);
};

export default validatePassword;