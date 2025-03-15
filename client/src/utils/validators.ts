/**
 * Validates baccarat card input
 * Cards should be digits 0-9 only
 */
export function validateCardInput(input: string): boolean {
  // Check if input is empty
  if (!input) return false;
  
  // Check if input contains only digits
  const digitRegex = /^[0-9]+$/;
  return digitRegex.test(input);
}
