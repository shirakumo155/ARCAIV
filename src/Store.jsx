import { create } from 'zustand'

export const useCsvDataStore = create((set) => ({
  filename: null,
  time: 0,
  timeHUD: 0,
  data: new Array(),
  dataLength: 0,
  isPaused: false,
  animationSpeed: 1.0,
  camera: "GodView",
  setFileName: (filename) => set({ filename: filename }),
  setData: (data) => set({ data: data }),
  setTime: (i) => set(() => ({ time: i })),
  setTimeHUD: (i) => set(() => ({ timeHUD: i })),
  setLength: (i) => set(() => ({ dataLength: i })),
  setIsPaused: (i) => set({ isPaused: i }),
  setAnimationSpeed: (i) => set(() => ({ animationSpeed: i })),
  setCamera: (i) => set(() => ({ camera: i })),
  resetFileName: () => set({ filename: null }),
  resetData: () => set({ data: [] }),
  resetIndex: () => set({ index: 0 }),
  resetTime: () => set({ time: 0 }),
  resetTimeHUD: () => set({ timeHUD: 0 }),
}))

export const useCsvDataListStore = create((set) => ({
  fileArr: new Array(),
  setFileArr: (files) => set({ fileArr: files }),
  resetFileArr: () => set({ fileArr: [] }),
}))

export const useTimeLineStateStore = create((set) => ({
  timeLineState: new Array(),
  setTimeLineState: (state) => set({ timeLineState: state }),
  resetTimeLineState: () => set({ timeLineState: [] }),
}))



