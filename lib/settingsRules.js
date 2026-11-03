export const ALLOWED_THEMES = ['light', 'dark', 'system'];
export const ALLOWED_LANGUAGES = ['English', 'Hindi', 'German', 'French'];

export const MIN_FONT_SIZE = 12;
export const MAX_FONT_SIZE = 24;

export const DEFAULT_SETTINGS = {
  theme: 'light',
  language: 'English',
  fontSize: 14,
};

export function validateSettings(input) {
  const errors = [];

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return [{ field: 'root', message: 'Payload must be a valid JSON object' }];
  }

  if (input.theme === undefined || input.theme === null) {
    errors.push({ field: 'theme', message: 'Theme is required' });
  } else if (!ALLOWED_THEMES.includes(input.theme)) {
    errors.push({
      field: 'theme',
      message: `Theme must be one of: ${ALLOWED_THEMES.join(', ')}`,
    });
  }


  if (input.language === undefined || input.language === null) {
    errors.push({ field: 'language', message: 'Language is required' });
  } else if (!ALLOWED_LANGUAGES.includes(input.language)) {
    errors.push({
      field: 'language',
      message: `Language must be one of: ${ALLOWED_LANGUAGES.join(', ')}`,
    });
  }

  if (input.fontSize === undefined || input.fontSize === null) {
    errors.push({ field: 'fontSize', message: 'Font size is required' });
  } else if (
    typeof input.fontSize !== 'number' ||
    !Number.isInteger(input.fontSize) ||
    input.fontSize < MIN_FONT_SIZE ||
    input.fontSize > MAX_FONT_SIZE
  ) {
    errors.push({
      field: 'fontSize',
      message: `Font size must be an integer between ${MIN_FONT_SIZE} and ${MAX_FONT_SIZE}`,
    });
  }

  return errors;
}