import { type StoreApi } from 'zustand';
import { type NamedSet } from 'zustand/middleware';

type FirstSetStateArg<T> = Parameters<StoreApi<T>['setState']>[0];
export type SetState<T> = (partial: FirstSetStateArg<T>, name?: string) => void;
export type GetState<T> = StoreApi<T>['getState'];

type StateObject = Record<string, any>;

type SliceKey<S extends StateObject> = {
  [K in keyof S]: S[K] extends S ? K : never
}[keyof StateObject];

interface SliceConfig {
  /**
   *  1. `false`: calls to `set` will not be logged
   *  2. `type`: logs the `<slice name>.<type>`
   *  3. `all`: logs { type: `<slice name>.<type>`, payload: <args>`
   *
   *  Defaults to `all`
   */
  logCalls?: false | 'type' | 'all';
}

export const sliceGet = <S extends StateObject, K extends SliceKey<S>>(
  get: GetState<S>,
  key: K,
): GetState<S[K]> => {
  return () => get()[key];
};

export type CallLog = undefined | string | { type: string; payload: any };

export const sliceSet = <S extends StateObject, K extends SliceKey<S>>(
  set: NamedSet<S>,
  key: K,
  config: SliceConfig
): SetState<S[K]> => {
  /**
   * differs from global set in that the `replace` option is removed in
   * favor of a `name` optional arg.
   */
  return (partial: FirstSetStateArg<S[K]>, name?: string) => {
    let log: CallLog = undefined;

    if (!!config.logCalls) {
      const type = `${key}.${name ?? 'set'}`;
      log = config.logCalls === 'all' ? { type, payload: partial } : type;
    }

    set(
      (state) => {
        const nextState =
          typeof partial === 'function'
            ? (partial as (s: S[K]) => S[K])(state[key])
            : partial;

        return {
          [key]: {
            ...state[key],
            ...nextState,
          },
        } as Partial<S>
      },
      false,
      log,
    );
  };
};

export type CreateSlice<
  Slice extends StateObject,
  AppState extends StateObject = StateObject,
> = (
  set: SetState<Slice>,
  get: GetState<Slice>,
  store: StoreApi<AppState>,
) => Slice;

export const slice =
  <S extends StateObject>(
    set: NamedSet<S>,
    get: GetState<S>,
    store: StoreApi<S>,
    config: SliceConfig = {  logCalls: 'all' },
  ) =>
  <K extends SliceKey<S>>(k: K, init: CreateSlice<S[K], S>) =>
    init(sliceSet(set, k, config), sliceGet(get, k), store);

export default slice;
