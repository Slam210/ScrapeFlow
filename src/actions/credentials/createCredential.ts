"use server";

import { auth } from "@clerk/nextjs/server";
import {
  createCredentialSchema,
  createCredentialSchemaType,
} from "../../../schema/credential";
import prisma from "@/lib/prisma";
import { symmetricEncrypt } from "@/lib/encryption";

/**
 * Creates a credential for the authenticated user from validated form data.
 *
 * Validates `form`, requires an authenticated user, encrypts the credential value,
 * and persists a new credential record. On success returns the redirect path for credentials.
 *
 * @param form - Form data matching `createCredentialSchemaType` (must include `name` and `value`)
 * @returns The path string "/credentials" on success
 * @throws Error("Invalid form data") if validation fails
 * @throws Error("Unauthenticated") if no user is authenticated
 * @throws Error("Failed to create credential") if persisting the credential fails
 */
export async function createCredential(form: createCredentialSchemaType) {
  const { success, data } = createCredentialSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  // Encrypt value
  const encryptedValue = symmetricEncrypt(data.value);
  console.log("@TEST", {
    plain: data.value,
    encrypted: encryptedValue,
  });

  const result = await prisma.credential.create({
    data: {
      userId,
      name: data.name,
      value: encryptedValue,
    },
  });

  if (!result) {
    throw new Error("Failed to create credential");
  }

  return "/credentials";
}
