export interface HashServiceInterface {
  make(str: string): string;
}

export const HashServiceInterface = Symbol('HashServiceInterface');
