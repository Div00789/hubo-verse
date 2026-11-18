import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

/**
 * Enterprise Credential Encryption
 * Stores HubSpot OAuth Access/Refresh Tokens encrypted with AES-256-GCM.
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Standard for GCM
const AUTH_TAG_LENGTH = 16;

export interface EncryptedPayload {
  iv: string; // Hex
  authTag: string; // Hex
  encryptedData: string; // Hex
}

export function encryptSecret(plainText: string, encryptionKeyHex: string): EncryptedPayload {
  const key = Buffer.from(encryptionKeyHex, 'hex');
  if (key.length !== 32) {
    throw new Error('Encryption key must be exactly 32 bytes (64 hex characters).');
  }

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return {
    iv: iv.toString('hex'),
    authTag,
    encryptedData: encrypted,
  };
}

export function decryptSecret(payload: EncryptedPayload, encryptionKeyHex: string): string {
  const key = Buffer.from(encryptionKeyHex, 'hex');
  const iv = Buffer.from(payload.iv, 'hex');
  const authTag = Buffer.from(payload.authTag, 'hex');

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(payload.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
