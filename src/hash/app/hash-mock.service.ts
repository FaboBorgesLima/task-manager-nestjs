import { HashServiceInterface } from '../domain/hash.service.interface';

/**
 * This is a mock implementation of the HashServiceInterface.
 * It simply returns the input string as the hashed value.
 * This is useful for testing purposes where you don't want to perform actual hashing.
 */
export class HashMockService implements HashServiceInterface {
  public static getInstance(): HashMockService {
    return new HashMockService();
  }

  public make(str: string): string {
    return str;
  }
}
