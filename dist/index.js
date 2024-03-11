export const sliceGet = (get, key) => {
    return () => get()[key];
};
export const sliceSet = (set, key, config) => {
    /**
     * differs from global set in that the `replace` option is removed in
     * favor of a `name` optional arg.
     */
    return (partial, name) => {
        let log = undefined;
        if (!!config.logCalls) {
            const type = `${key}.${name !== null && name !== void 0 ? name : 'set'}`;
            log = config.logCalls === 'all' ? { type, payload: partial } : type;
        }
        set((state) => {
            const nextState = typeof partial === 'function'
                ? partial(state[key])
                : partial;
            return {
                [key]: {
                    ...state[key],
                    ...nextState,
                },
            };
        }, false, log);
    };
};
export const slice = (set, get, store, config = { logCalls: 'all' }) => (k, init) => init(sliceSet(set, k, config), sliceGet(get, k), store);
export default slice;
