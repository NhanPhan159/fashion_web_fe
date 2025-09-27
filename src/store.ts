import { create } from "zustand";

import { Theme } from "./enums";

type StateValue = {
};

type Action = {
};

type Store = {
  value: StateValue;
  actions: Action;
};

const initialStateValue: StateValue = {
};

const useStore = create<Store>((set) => ({
  value: initialStateValue,
  actions: {
  },
}));

export const useGlobalStore = useStore;