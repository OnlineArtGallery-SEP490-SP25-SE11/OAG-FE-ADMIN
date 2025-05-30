import { Vector3 } from 'three';
import { create } from 'zustand';

interface CameraStore {
  isLocked: boolean;
  targetPosition: Vector3 | null;
  setIsLocked: (value: boolean) => void;
  setTargetPosition: (value: Vector3 | null) => void;
} 

export const useCameraStore = create<CameraStore>((set) => ({
  isLocked: false,
  targetPosition: null,
  setIsLocked: (value) => set({ isLocked: value }),
  setTargetPosition: (value) => set({ targetPosition: value }),
}));