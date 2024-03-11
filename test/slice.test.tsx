import React, { useEffect } from 'react'
import { render } from '@testing-library/react'
import { it, expect } from 'vitest'
import { create } from 'zustand'
import { type CreateSlice, type CallLog, slice, sliceSet } from '../src';

type SliceAState = {
  count: number
  incrementA: VoidFunction
};

type SliceBState = {
  count: number
  decrementB: VoidFunction
};

type AppState = {
  sliceA: SliceAState
  sliceB: SliceBState
};

it('can create a store with namespaced slices', async () => {
  const createSliceA: CreateSlice<SliceAState> = (set, get) => ({
    count: 0,
    incrementA: () => set({ count: get().count + 1 }, 'incrementA'),
  });

  const createSliceB: CreateSlice<SliceBState> = (set, get) => ({
    count: 0,
    decrementB: () => set({ count: get().count - 1 }),
  });

  const useBoundStore = create<AppState>((set, get, store) => {
    const createSlice = slice(set, get, store);
    return {
      sliceA: createSlice<'sliceA'>('sliceA', createSliceA),
      sliceB: createSlice<'sliceB'>('sliceB', createSliceB),
    }
  });

  const useSliceA = () => useBoundStore((s) => s.sliceA);
  const useSliceB = () => useBoundStore((s) => s.sliceB);

  const Counter: React.FC = () => {
    const { incrementA, count: countA } = useSliceA();
    const { decrementB, count: countB } = useSliceB();

    useEffect(incrementA, [incrementA]);
    useEffect(decrementB, [decrementB]);

    return (
      <div>
        <div>count a: {countA}</div>
        <div>count b: {countB}</div>
      </div>
    )
  };

  const { findByText } = render(
    <>
      <Counter />
    </>,
  );

  await findByText('count a: 1');
  await findByText('count b: -1');
});

it('respects config log options', () => {
  let logOption: CallLog;
  const mockSet = (_setter: any, _replace: false, log: CallLog  ) => {
    logOption = log;
  };

  let set = sliceSet<AppState, 'sliceA'>(mockSet as any, 'sliceA', { logCalls: 'all' });

  set({ count: 1 }, 'setCount');

  expect(logOption).toEqual({ type: 'sliceA.setCount', payload: { count: 1 } });

  set = sliceSet<AppState, 'sliceA'>(mockSet as any, 'sliceA', { logCalls: 'type' });

  set({ count: 2 }, 'setCount');

  expect(logOption).toEqual('sliceA.setCount');

  set = sliceSet<AppState, 'sliceA'>(mockSet as any, 'sliceA', { logCalls: false });

  set({ count: 3 }, 'setCount');

  expect(logOption).toBeUndefined();
});
