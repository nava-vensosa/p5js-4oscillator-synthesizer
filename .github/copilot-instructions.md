<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# p5.js 4-Oscillator Synthesizer GUI Project

This is an advanced p5.js project that creates an interactive 4-oscillator synthesizer with GUI controls and high-resolution real-time visualizations.

## Project Features
- 4 independent oscillators with individual controls
- Frequency, amplitude, and waveform controls for each oscillator
- Precise frequency input with text fields and cents fine-tuning
- Variable cents step control (1-100 cents)
- Real-time combined waveform visualization
- High-resolution spectrograph showing frequency content evolution
- Current spectrum analysis display of combined signal
- GUI controls using HTML sliders, number inputs, and dropdowns

## Technical Guidelines
- Use p5.js and p5.sound.js for audio synthesis and analysis
- Implement responsive visualizations that update in real-time
- Follow p5.js best practices for setup(), draw(), and event handling
- Use FFT analysis for spectrum visualization
- Maintain smooth audio performance and visual updates

## Code Style
- Use clear variable names and comments
- Organize code into logical functions
- Handle audio context properly for web audio requirements
- Implement proper error handling for audio operations
