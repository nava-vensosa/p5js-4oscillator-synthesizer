# p5.js 4-Oscillator Synthesizer GUI

An advanced interactive web application built with p5.js that provides real-time control over 4 audio oscillators with high-resolution visualization tools.

## Features

- **4 Independent Oscillators**
  - Individual frequency control (20Hz - 2000Hz) for each oscillator
  - Individual amplitude control (0 - 1.0) for each oscillator
  - Individual waveform selection (Sine, Triangle, Square, Sawtooth) for each oscillator
  - Combined audio output through a mixer

- **High-Resolution Visualizations**
  - **Combined Waveform Display**: Shows the mixed waveform from all 4 oscillators
  - **High-Resolution Spectrograph**: Time-frequency heatmap (8196 FFT bins, 8196/44100 window slices) showing how the combined spectrum evolves over time
  - **Current Spectrum**: Live frequency analysis of the combined signal from all oscillators

- **Enhanced User Interface**
  - 4 separate control panels for each oscillator
  - Color-coded oscillator sections
  - Real-time parameter value displays
  - Scrollable control panel for compact display
  - Start/Stop buttons for all oscillators
  - Keyboard shortcuts (Spacebar to toggle all oscillators)

## Getting Started

### Prerequisites
- A modern web browser with Web Audio API support
- Node.js (optional, for development server)

### Installation

1. Clone or download this project
2. Install dependencies (optional):
   ```bash
   npm install
   ```

### Running the Application

#### Option 1: Using a development server (recommended)
```bash
npm start
```
This will start a live server on `http://localhost:8080`

#### Option 2: Direct file opening
Simply open `index.html` in your web browser. Note that some browsers may require HTTPS for audio features.

### Usage

1. Click "Start All Oscillators" to begin audio generation
2. Adjust individual oscillator controls to create complex sounds:
   - **Oscillator 1**: Default 440Hz sine wave (musical note A4)
   - **Oscillator 2**: Default 554Hz triangle wave (musical note C#5)
   - **Oscillator 3**: Default 659Hz square wave (musical note E5)
   - **Oscillator 4**: Default 880Hz sawtooth wave (musical note A5, one octave up)
3. Modify frequencies, amplitudes, and waveforms to create:
   - Harmonic chords by setting musical intervals
   - Complex timbres by mixing different waveforms
   - Beat frequencies by setting oscillators to nearby frequencies
   - Rich textures by varying amplitudes
4. Observe the real-time visualizations:
   - **Top section**: Combined waveform showing the mixed signal
   - **Middle section**: High-resolution spectrograph showing frequency content evolution
   - **Bottom section**: Current frequency spectrum analysis
5. Use the spacebar as a shortcut to start/stop all oscillators

## Technical Details

### Built With
- **p5.js**: Creative coding library for graphics and interaction
- **p5.sound.js**: Audio synthesis and analysis capabilities
- **Web Audio API**: Browser-native audio processing
- **p5.Gain**: Audio mixer for combining multiple oscillator signals

### Key Components
- **4x p5.Oscillator**: Generate individual audio waveforms
- **p5.Gain (Mixer)**: Combines all oscillator signals
- **p5.FFT (8192 bins)**: High-resolution frequency analysis for visualizations
- **HTML5 Canvas**: Renders real-time graphics with enhanced color mapping
- **Web Audio Context**: Manages audio processing

### Architecture
- `index.html`: Main HTML structure and enhanced styling for 4-oscillator interface
- `sketch.js`: Core p5.js application logic with multi-oscillator synthesis
- `package.json`: Project dependencies and scripts

## Advanced Features

### High-Resolution Spectrograph
- **8192 FFT bins** for detailed frequency analysis
- **400 time slices** for smooth temporal resolution
- **Enhanced color mapping**: Blue → Cyan → Yellow → Red intensity scale
- **Focused frequency range**: Displays up to ~6kHz for optimal visibility

### Musical Applications
- **Chord synthesis**: Create major/minor chords using harmonic intervals
- **Beat phenomena**: Set oscillators to close frequencies to hear beating
- **Timbre exploration**: Mix different waveforms for complex sounds
- **Harmonic series**: Explore natural overtone relationships

## Browser Compatibility

This application works best in modern browsers that support:
- Web Audio API
- HTML5 Canvas
- ES6+ JavaScript features

## License

MIT License - feel free to use and modify for your projects.

## Contributing

Feel free to submit issues and enhancement requests!
