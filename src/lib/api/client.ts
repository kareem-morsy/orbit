export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const payload = await response.json();
  if (!response.ok) throw new ApiError(payload.error ?? "Request failed", response.status);
  return payload;
}
