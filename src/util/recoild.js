// recoild.js
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const playerDataState = atom({
  key: 'playerData', // Unique key for the atom
  default: [], // Initial value is an empty array
  effects_UNSTABLE: [persistAtom], // Apply persistence effect
});

// Define the Recoil state atom with persistence
export const nextLinkState = atom({
  key: 'nextLink', // Unique key for the atom
  default: {}, // Initial value
  effects_UNSTABLE: [persistAtom], // Apply persistence effect
});

// Define another Recoil state atom for tournament name with persistence
export const toNmState = atom({
  key: 'toNm', // Unique key for the atom
  default: '', // Initial value
  effects_UNSTABLE: [persistAtom], // Apply persistence effect
});

export const refreeNameState = atom({
  key: 'refreeName', // Unique key for the atom
  default: '', // Initial value
  effects_UNSTABLE: [persistAtom], // Apply persistence effect
});

