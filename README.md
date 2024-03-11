# Zustand Slice

A utility for using namespaced slices, similar to what you'd get with `combineReducers` in Redux, for use with [Zustand](https://github.com/pmndrs/zustand).

For example:

``` typescript
import create from 'zustand';
import { devtools } 'zustand/middleware';
import { slice } from 'zustand-slice';

import { type FishState, createFishSlice } from './fish';
import { type BearState, createBearSlice } from './bears';

interface AppState {
  fish: FishState;
  bears: BearState;
}

const useAppStore = create(
  devtools(
    (set, get, api) => {
      const createSlice = slice(set, get, api);

      return {
        fish: createSlice<'fish'>('fish', createFishSlice),
        bears: createSlice<'bears'>('bears', createBearSlice),
      };
    }
  )
);

export const useBears = () => {
  return useAppStore(s => s.bears);
};

export const useFish = () => {
  return useAppState(s => s.fish);
};
```

`fish.ts`
```typescript
import { type CreateSlice } from 'zustand-slice';

export interface FishState {
  population: number;
  increasePopulation: VoidFunction;
}

export const createFishSlice: CreateSlice<FishState> = (set, get) => {
  return {
    population: 0,
    // you can pass a string to label the call in Redux Dev Tools.
    // This will show up as `fish.increasePopulation` in the action list
    increasePopulation: () => set({ population: get().population + 1 }, 'increasePopulation')
  };
};

```

`bears.ts`

``` typescript
import { type CreateSlice } from 'zustand-slice';

export interface BearState {
  population: number;
  increasePopulation: VoidFunction;
}

export const createBearSlice: CreateSlice<BearState> = (set, get) => {
  return {
    population: 0,
    // This will show up as `bear.set` in the action list
    increasePopulation: () => set({ population: get().population + 1 })
  };

```

## Config

```typescript
interface SliceConfig {
  /**
   *  1. `false`: calls to `set` will not be logged
   *  2. `type`: logs the `<slice name>.<type = set>`
   *  3. `all`: logs { type: `<slice name>.<type>`, payload: <args>`
   *
   *  Defaults to `all`
   */
  logCalls?: false | 'type' | 'all';
}
```
