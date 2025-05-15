const tokenBlacklist = new Set<string>();

export const revokeToken = (token: string) => {
  tokenBlacklist.add(token);
  setTimeout(() => tokenBlacklist.delete(token), 15 * 60 * 1000); // 15 min expiry
};

export const isTokenRevoked = (token: string): boolean => {
  return tokenBlacklist.has(token);
};
