export const validateEmail = (email) => {
  if (!email.trim()) return 'Email is required';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password, minLength = 6) => {
  if (!password) return 'Password is required';
  if (password.length < minLength) return `Password must be at least ${minLength} characters`;
  return '';
};

export const validateName = (name) => {
  if (!name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
};

export const validateProduct = (form) => {
  const errors = {};

  if (!form.productId.trim()) {
    errors.productId = 'Product ID is required';
  } else if (!/^[A-Za-z0-9-]+$/.test(form.productId)) {
    errors.productId = 'Only letters, numbers, and hyphens allowed';
  }

  if (!form.name.trim()) {
    errors.name = 'Product name is required';
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (form.price === '' || form.price === null || form.price === undefined) {
    errors.price = 'Price is required';
  } else if (!/^\d+(\.\d{1,2})?$/.test(String(form.price))) {
    errors.price = 'Price must be a valid number (digits only)';
  } else if (Number(form.price) < 0) {
    errors.price = 'Price cannot be negative';
  }

  if (form.rating !== '' && form.rating !== null && form.rating !== undefined) {
    const rating = Number(form.rating);
    if (Number.isNaN(rating) || rating < 0 || rating > 5) {
      errors.rating = 'Rating must be between 0 and 5';
    }
  }

  if (!form.company.trim()) {
    errors.company = 'Company is required';
  } else if (form.company.trim().length < 2) {
    errors.company = 'Company must be at least 2 characters';
  }

  return errors;
};
