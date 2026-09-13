type QueryKeyDefinition = (...args: never[]) => readonly unknown[];

type QueryKeyDefinitions = Record<string, QueryKeyDefinition>;

type FeatureQueryKeys<
  Scope extends string,
  Definitions extends QueryKeyDefinitions,
> = {
  readonly all: readonly [Scope];
} & {
  readonly [Name in keyof Definitions & string]: (
    ...args: Parameters<Definitions[Name]>
  ) => readonly [Scope, Name, ...ReturnType<Definitions[Name]>];
};

/**
 * Builds a namespaced, type-safe query-key factory for a feature.
 *
 * @example
 * export const profileKeys = createQueryKeys('profile', {
 *   detail: (id: string) => [id] as const,
 * });
 * profileKeys.all           // ['profile']
 * profileKeys.detail('123') // ['profile', 'detail', '123']
 */
export function createQueryKeys<
  Scope extends string,
  Definitions extends QueryKeyDefinitions,
>(
  scope: Scope,
  definitions: Definitions,
): FeatureQueryKeys<Scope, Definitions> {
  const keys: Record<string, unknown> = { all: [scope] as const };

  for (const name of Object.keys(definitions)) {
    keys[name] = (...args: never[]) =>
      [scope, name, ...definitions[name](...args)] as const;
  }

  return keys as FeatureQueryKeys<Scope, Definitions>;
}
