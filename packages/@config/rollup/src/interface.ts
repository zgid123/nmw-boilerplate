export type TModule = 'cjs' | 'es';

export type TExtension = 'mjs' | 'cjs';

export type TExternalDict = Partial<Record<TModule, string[]>>;

export type TExternal = TExternalDict | string[];
