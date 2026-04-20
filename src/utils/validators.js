export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateAmount = (amount) => {
  const num = Number(amount);
  return !isNaN(num) && num > 0 && num <= 100000000;
};

export const validateDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

export const validateFutureDate = (date) => {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
};