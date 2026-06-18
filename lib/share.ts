export const SHARE_EXPIRY_SECONDS = 300; // If someone shares the code at 10:00 then the code is valid for 10:05
export const MAX_CODE_GENERATION_ATTEMPTS = 10; // rate limiting
export const RECEIVED_STATUS_TTL_SECONDS = 60; // If someone enters the code at 10:01 then the received status will disappear after 10:02...
export const SHARE_TEXT_MAX_CHARACTERS = 10_000;

export type ShareDeliveryStatus = "pending" | "received" | "expired";

export interface StoredSharePayload {
  text: string;
  createdAt: number;
  expiresAt: number;
  burnAfterReading: true;
  status: ShareDeliveryStatus;
  copiedAt?: number;
}

// export interface ShareStatusPayload {
//   status: ShareDeliveryStatus;
//   copiedAt?: number;
// }

export function getShareStatusKey(code: string) {
  return `share-status:${code}`;
}

export function isShareDeliveryStatus(
  value: unknown
): value is ShareDeliveryStatus {
  return value === "pending" || value === "received" || value === "expired";
}

export function normalizeStoredSharePayload(
  rawShare: unknown,
  now = Date.now()
): StoredSharePayload | null {
  const normalizeObject = (payload: Partial<StoredSharePayload>) => {
    if (typeof payload.text !== "string" || !payload.text.trim()) {
      return null;
    }

    const createdAt =
      typeof payload.createdAt === "number" ? payload.createdAt : now;
    const expiresAt =
      typeof payload.expiresAt === "number"
        ? payload.expiresAt
        : createdAt + SHARE_EXPIRY_SECONDS * 1000;
    const copiedAt =
      typeof payload.copiedAt === "number" ? payload.copiedAt : undefined;
    const status = isShareDeliveryStatus(payload.status)
      ? payload.status
      : copiedAt
        ? "received"
        : expiresAt <= now
          ? "expired"
          : "pending";

    return {
      text: payload.text,
      createdAt,
      expiresAt,
      burnAfterReading: true as const,
      status,
      copiedAt,
    };
  };

  if (typeof rawShare === "object" && rawShare !== null) {
    return normalizeObject(rawShare as Partial<StoredSharePayload>);
  }

  if (typeof rawShare !== "string") {
    return null;
  }

  try {
    const parsed = JSON.parse(rawShare) as unknown;

    if (typeof parsed === "string") {
      return normalizeObject({ text: parsed });
    }

    if (typeof parsed === "object" && parsed !== null) {
      return normalizeObject(parsed as Partial<StoredSharePayload>);
    }
  } catch {
    return normalizeObject({ text: rawShare });
  }

  return null;
}
