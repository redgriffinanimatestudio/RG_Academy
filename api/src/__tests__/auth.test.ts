import { generateToken, verifyToken } from '../utils/auth';

describe('auth utils', () => {
  it('should generate and verify a valid JWT', () => {
    const token = generateToken('test-user', 'test@example.com');
    const decoded: any = verifyToken(token);
    expect(decoded).toBeTruthy();
    expect(decoded.id).toBe('test-user');
    expect(decoded.email).toBe('test@example.com');
  });

  it('should return null for invalid token', () => {
    expect(verifyToken('invalid.token')).toBeNull();
  });
});
