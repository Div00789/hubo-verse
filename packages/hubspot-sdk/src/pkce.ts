import crypto from 'crypto';

/**
 * HubSpot OAuth 2.1 PKCE (Proof Key for Code Exchange) Utilities
 * Conforms to RFC 7636 and HubSpot Developer Platform specifications.
 */

export interface PkceChallenge {
  codeVerifier: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
}

/**
 * Generate a cryptographically secure random base64url-encoded string.
 */
function base64UrlEncode(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Generates PKCE code_verifier (43-128 chars) and SHA-256 code_challenge.
 */
export function generatePkceChallenge(): PkceChallenge {
  // 64 random bytes produces an 86-character base64url string (well within 43-128 range)
  const codeVerifier = base64UrlEncode(crypto.randomBytes(64));

  // Compute SHA-256 hash of the code_verifier
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  const codeChallenge = base64UrlEncode(hash);

  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod: 'S256',
  };
}

/**
 * Verifies whether a given verifier matches the challenge.
 */
export function verifyPkce(codeVerifier: string, expectedChallenge: string): boolean {
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  const computedChallenge = base64UrlEncode(hash);
  return computedChallenge === expectedChallenge;
}
