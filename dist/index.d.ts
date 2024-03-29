import { NamedSet } from 'zustand/middleware';
import { StoreApi } from 'zustand';

export declare type CallLog = undefined | string | {
    type: string;
    payload: any;
};

export declare type CreateSlice<Slice extends StateObject, AppState extends StateObject = StateObject> = (set: SetState<Slice>, get: GetState<Slice>, store: StoreApi<AppState>) => Slice;

declare type FirstSetStateArg<T> = Parameters<StoreApi<T>['setState']>[0];

export declare type GetState<T> = StoreApi<T>['getState'];

export declare type SetState<T> = (partial: FirstSetStateArg<T>, name?: string) => void;

declare const slice: <S extends StateObject>(set: NamedSet<S>, get: GetState<S>, store: StoreApi<S>, config?: SliceConfig) => <K extends SliceKey<S>>(k: K, init: CreateSlice<S[K], S>) => S[K];
export default slice;
export { slice }

declare interface SliceConfig {
    /**
     *  1. `false`: calls to `set` will not be logged
     *  2. `type`: logs the `<slice name>.<type>`
     *  3. `all`: logs { type: `<slice name>.<type>`, payload: <args>`
     *
     *  Defaults to `all`
     */
    logCalls?: false | 'type' | 'all';
}

export declare const sliceGet: <S extends StateObject, K extends SliceKey<S>>(get: GetState<S>, key: K) => GetState<S[K]>;

declare type SliceKey<S extends StateObject> = {
    [K in keyof S]: S[K] extends S ? K : never;
}[keyof StateObject];

export declare const sliceSet: <S extends StateObject, K extends SliceKey<S>>(set: NamedSet<S>, key: K, config: SliceConfig) => SetState<S[K]>;

declare type StateObject = Record<string, any>;

export { }
