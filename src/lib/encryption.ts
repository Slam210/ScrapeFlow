// 32-byte key (64 hex chars); use AEAD
const ALG = "aes-256-gcm";
import crypto from "crypto";
import "server-only";

export const symmetricEncrypt = (data: string) => {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex) {
    throw new Error("Encryption key not found");
  }

  if (!/^[0-9a-fA-F]{64}$/.test(keyHex)) {
    throw new Error("ENCRYPTION_KEY must be 64 hex chars (32 bytes)");
  }
  const key = Buffer.from(keyHex, "hex");
  const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv(ALG, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  // envelope: version:alg:iv:tag:ciphertext (hex)
  return `v1:${ALG}:${iv.toString("hex")}:${tag.toString(
    "hex"
  )}:${encrypted.toString("hex")}`;
};

export const symmetricDecrypt = (encrypted: string) => {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex) {
    throw new Error("Encryption key not found");
  }

  if (!/^[0-9a-fA-F]{64}$/.test(keyHex)) {
    throw new Error("ENCRYPTION_KEY must be 64 hex chars (32 bytes)");
  }
  const key = Buffer.from(keyHex, "hex");
  const parts = encrypted.split(":");
  if (parts.length !== 5) throw new Error("Invalid encrypted payload");
  const [version, alg, ivHex, tagHex, ctHex] = parts;
  if (version !== "v1" || alg !== ALG) throw new Error("Unsupported payload");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const ct = Buffer.from(ctHex, "hex");
  const decipher = crypto.createDecipheriv(ALG, key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ct), decipher.final()]);
  return decrypted.toString("utf8");
};
