export const normalizePhone = (phone?: string, phoneCode?: string) => {
  const rawPhone = String(phone || '').trim();
  const rawCode = String(phoneCode || '').trim();

  if (!rawPhone && !rawCode) return '';

  const phoneDigits = rawPhone.replace(/\D/g, '');
  const codeDigits = rawCode.replace(/\D/g, '');

  if (!phoneDigits) return '';

  if (rawPhone.startsWith('+')) {
    return `+${phoneDigits}`;
  }

  if (rawPhone.startsWith('00')) {
    return `+${phoneDigits.replace(/^00/, '')}`;
  }

  if (codeDigits) {
    return `+${codeDigits}${phoneDigits}`;
  }

  return phoneDigits;
};

export const canonicalizePhoneDigits = (phone?: string) => String(phone || '').replace(/\D/g, '');
