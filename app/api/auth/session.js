import crypto from 'crypto';

// Use ADMIN_PASSWORD or SUPABASE_SERVICE_ROLE_KEY as a secret
// In production, you would ideally have a dedicated NEXTAUTH_SECRET or SESSION_SECRET
const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.ADMIN_PASSWORD || 'fallback-dev-secret';

/**
 * Creates a cryptographically signed token string.
 * @returns {string} The signed token.
 */
export function signSession() {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(timestamp);
  const signature = hmac.digest('hex');
  return `${timestamp}.${signature}`;
}

/**
 * Verifies a cryptographically signed token string.
 * @param {string} token - The signed token from the cookie.
 * @returns {boolean} True if the token is valid, false otherwise.
 */
export function verifySession(token) {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  
  const [timestamp, signature] = parts;
  if (!timestamp || !signature) return false;
  
  // Check expiration (7 days max)
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - parseInt(timestamp, 10) > maxAgeMs) {
    return false;
  }

  // Verify HMAC signature
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(timestamp);
  const expectedSignature = hmac.digest('hex');
  
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch (e) {
    return false;
  }
}
