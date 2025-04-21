import { Removable } from './removable';

interface MutationConfig {
  mutationId: number;
  // mutationCache: MutationCache;
}

export class Mutation extends Removable {
  constructor() {
    super();
  }
  protected optionalRemove(): void {
    throw new Error('Method not implemented.');
  }
}
