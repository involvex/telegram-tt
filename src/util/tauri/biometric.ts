import type { Status } from '@tauri-apps/plugin-biometric';
import { checkStatus } from '@tauri-apps/plugin-biometric';

import { IS_TAURI } from '../browser/globalEnvironment';

// Wrapper around the Tauri biometric plugin. Only meaningful inside the
// Tauri shell; returns `undefined` on web builds so callers can hide
// biometric UI without branching on `IS_TAURI` themselves.
export async function getBiometricStatus(): Promise<Status | undefined> {
  if (!IS_TAURI) return undefined;

  try {
    return await checkStatus();
  } catch (err) {
    return undefined;
  }
}

export function isBiometricAvailable(status: Status | undefined): boolean {
  return Boolean(status?.isAvailable);
}
