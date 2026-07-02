// Advanced Noise Suppression Module for Omni Messenger
// Reduces background noise while preserving voice clarity
// Uses spectral subtraction and voice activity detection

class NoiseSuppressor {
  constructor(audioContext, analyser, sampleRate = 48000) {
    this.ctx = audioContext;
    this.analyser = analyser;
    this.sampleRate = sampleRate;
    
    // Voice Activity Detection (VAD) parameters
    this.voiceThresholdDb = -35;  // Voice detection threshold
    this.noiseFloorDb = -70;      // Minimum noise floor
    this.voiceConfidence = 0;
    this.smoothingFactor = 0.15;
    
    // Noise gate parameters
    this.gateThreshold = -45;     // Gate opens above this level
    this.gateAttack = 0.005;      // Fast attack (5ms)
    this.gateRelease = 0.1;       // Slower release (100ms)
    this.gateGain = 1.0;
    
    // Spectral characteristics for voice detection
    this.voiceFreqRanges = [
      { min: 300, max: 1000, weight: 0.4 },   // Fundamental (male/female)
      { min: 1000, max: 4000, weight: 0.5 },  // Formants (most important)
      { min: 4000, max: 8000, weight: 0.1 }   // High frequency detail
    ];
    
    this.noiseProfile = null;
    this.noiseEstimate = new Uint8Array(128);
    this.calibrationCount = 0;
    this.calibrationTarget = 30; // Calibrate with first 30 frames of silence
  }

  // Calibrate noise profile (learns background noise signature)
  calibrateNoiseProfile(frequencyData) {
    if (this.calibrationCount < this.calibrationTarget) {
      if (!this.noiseProfile) {
        this.noiseProfile = new Uint8Array(frequencyData.length);
      }
      // Smooth update of noise profile
      for (let i = 0; i < frequencyData.length; i++) {
        this.noiseProfile[i] = Math.max(
          this.noiseProfile[i],
          frequencyData[i] * 0.9
        );
      }
      this.calibrationCount++;
      return this.calibrationCount >= this.calibrationTarget;
    }
    return true;
  }

  // Detect if audio contains voice using spectral analysis
  detectVoiceActivity(frequencyData) {
    if (!frequencyData || frequencyData.length < 32) return false;
    
    let voiceScore = 0;
    let energyInVoiceBands = 0;
    
    // Analyze voice-specific frequency ranges
    for (const range of this.voiceFreqRanges) {
      const minBin = Math.floor((range.min * frequencyData.length) / (this.sampleRate / 2));
      const maxBin = Math.floor((range.max * frequencyData.length) / (this.sampleRate / 2));
      
      let energy = 0;
      for (let i = minBin; i < maxBin && i < frequencyData.length; i++) {
        energy += (frequencyData[i] / 255) ** 2;
      }
      
      energyInVoiceBands += energy * range.weight;
      voiceScore += (energy > 0.02) ? range.weight : 0; // Boost if energy present
    }
    
    // Smooth voice confidence with exponential moving average
    const currentConfidence = energyInVoiceBands > 0.01 ? 1 : 0;
    this.voiceConfidence = (this.voiceConfidence * (1 - this.smoothingFactor)) + 
                          (currentConfidence * this.smoothingFactor);
    
    return this.voiceConfidence > 0.5;
  }

  // Spectral subtraction: estimate and remove noise
  subtractNoise(frequencyData) {
    if (!this.noiseProfile || !frequencyData) return frequencyData;
    
    const processed = new Uint8Array(frequencyData.length);
    const noiseReductionFactor = 0.85; // How much noise to remove (0-1)
    
    for (let i = 0; i < frequencyData.length; i++) {
      const signal = frequencyData[i];
      const noise = this.noiseProfile[i] || 30;
      
      // Spectral subtraction with over-subtraction control
      let reduced = signal - (noise * noiseReductionFactor);
      
      // Preserve some noise floor to avoid over-processing
      reduced = Math.max(reduced, noise * 0.3);
      
      // Soft limiting to prevent artifacts
      processed[i] = Math.min(reduced, 255);
    }
    
    return processed;
  }

  // Apply noise gate: suppress audio when no voice detected
  updateGate(isVoicePresent) {
    const targetGain = isVoicePresent ? 1.0 : 0.05; // Gate closes to 5% when silent
    const rate = isVoicePresent ? this.gateAttack : this.gateRelease;
    
    this.gateGain += (targetGain - this.gateGain) * rate;
    return Math.max(0, Math.min(1, this.gateGain));
  }

  // Main processing function
  process() {
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    
    // Step 1: Calibrate noise profile if needed
    if (!this.noiseProfile) {
      this.calibrateNoiseProfile(data);
    }
    
    // Step 2: Detect voice activity
    const hasVoice = this.detectVoiceActivity(data);
    
    // Step 3: Subtract noise from spectrum
    const processed = this.subtractNoise(data);
    
    // Step 4: Update noise gate
    this.updateGate(hasVoice);
    
    return {
      hasVoice,
      gateGain: this.gateGain,
      confidence: this.voiceConfidence
    };
  }

  // Force recalibration (call when environment noise changes)
  recalibrate() {
    this.noiseProfile = null;
    this.calibrationCount = 0;
    this.voiceConfidence = 0;
    this.gateGain = 1.0;
  }
}

// Export for use in injector
if (typeof window !== 'undefined') {
  window.NoiseSuppressor = NoiseSuppressor;
}
