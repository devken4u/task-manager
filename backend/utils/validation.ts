function validateField(
  field: string,
  minLength: number = 0,
  maxLength: number = 0
): boolean {
  // is empty
  if (field.trim().length === 0) {
    return false;
  }

  // is greater than min length
  if (field.trim().length < minLength && minLength > 0) {
    return false;
  }

  // is greater than max length
  if (field.trim().length > maxLength && maxLength > 0) {
    return false;
  }

  return true;
}

export { validateField };
