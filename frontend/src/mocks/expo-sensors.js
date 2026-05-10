export const Pedometer = {
  isAvailableAsync: async () => typeof DeviceMotionEvent !== 'undefined',
  requestPermissionsAsync: async () => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const state = await DeviceMotionEvent.requestPermission();
        return { granted: state === 'granted' };
      } catch (e) {
        return { granted: false };
      }
    }
    return { granted: true };
  },
  watchStepCount: (callback) => {
    let steps = 0;
    let lastMagnitude = 0;
    const handleMotion = (event) => {
      const { x, y, z } = event.accelerationIncludingGravity || event.acceleration || {x:0, y:0, z:0};
      if (x === null || y === null || z === null) return;
      
      const magnitude = Math.sqrt(x*x + y*y + z*z);
      if (magnitude > 12 && lastMagnitude <= 12) {
        steps++;
        callback({ steps });
      }
      lastMagnitude = magnitude;
    };
    
    window.addEventListener('devicemotion', handleMotion);
    return {
      remove: () => window.removeEventListener('devicemotion', handleMotion)
    };
  }
};
