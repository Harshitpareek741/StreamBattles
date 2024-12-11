// src/types/vanta.d.ts

declare module "vanta/dist/vanta.net.min" {
    import * as THREE from "three";
  
    type VantaEffect = {
      destroy: () => void;
    };
  
    const NET: (options: {
      el: HTMLElement | null;
      THREE: typeof THREE;
      mouseControls: boolean;
      touchControls: boolean;
      gyroControls: boolean;
      minHeight: number;
      minWidth: number;
      scale: number;
      scaleMobile: number;
      color: number;
      backgroundColor: number;
      points: number;
      maxDistance: number;
      spacing: number;
    }) => VantaEffect;
  
    export default NET;
  }
  