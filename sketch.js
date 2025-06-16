// p5.js Oscillator GUI with Waveform and Spectrograph Visualization
let oscillators = [];
let fft;
let isPlaying = false;
let waveData = [];
let spectrumHistory = [];
let maxHistoryLength = .18575963718; // Keep history length at sampleSize/sampleRate

// Control variables for 4 oscillators
let oscillatorData = [
    { frequency: 440, amplitude: 0.3, waveform: 'sine', cents: 0, baseFreq: 440, centsStep: 10 },
    { frequency: 554, amplitude: 0.2, waveform: 'triangle', cents: 0, baseFreq: 554, centsStep: 10 },
    { frequency: 659, amplitude: 0.15, waveform: 'square', cents: 0, baseFreq: 659, centsStep: 10 },
    { frequency: 880, amplitude: 0.1, waveform: 'sawtooth', cents: 0, baseFreq: 880, centsStep: 10 }
];

let mixer;

// Canvas dimensions
let canvasWidth = 800;
let canvasHeight = 600;

function setup() {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('sketch-container');
    
    // Initialize audio context
    getAudioContext().suspend();
    
    // Create mixer for combining oscillators
    mixer = new p5.Gain();
    mixer.connect();
    
    // Create 4 oscillators with variable waveforms
    for (let i = 0; i < 4; i++) {
        let osc = new p5.Oscillator();
        osc.setType(oscillatorData[i].waveform);
        osc.freq(oscillatorData[i].frequency);
        osc.amp(0); // Start silent
        osc.connect(mixer);
        oscillators.push(osc);
    }
    
    // Create FFT for spectrum analysis with higher resolution
    fft = new p5.FFT(0.9, 8196);
    fft.setInput(mixer);
    
    // Initialize spectrum history with higher resolution
    for (let i = 0; i < maxHistoryLength; i++) {
        spectrumHistory.push(new Array(1024).fill(0));
    }
    
    // Set up GUI controls
    setupControls();
}

function draw() {
    background(20);
    
    if (isPlaying) {
        // Get waveform and spectrum data
        let wave = fft.waveform();
        let spectrum = fft.analyze();
        
        // Update spectrum history for spectrograph
        spectrumHistory.shift();
        spectrumHistory.push([...spectrum]);
        
        // Draw visualizations
        drawWaveform(wave);
        drawSpectrograph();
        drawSpectrum(spectrum);
    }
    
    // Draw labels and dividers
    drawLabels();
}

function drawWaveform(wave) {
    // Waveform visualization (top half)
    stroke(0, 255, 100);
    strokeWeight(2);
    noFill();
    
    let waveHeight = height * 0.3;
    let waveY = height * 0.15;
    
    beginShape();
    for (let i = 0; i < wave.length; i++) {
        let x = map(i, 0, wave.length, 0, width);
        let y = map(wave[i], -1, 1, waveY + waveHeight, waveY);
        vertex(x, y);
    }
    endShape();
    
    // Draw center line
    stroke(100);
    strokeWeight(1);
    line(0, waveY + waveHeight/2, width, waveY + waveHeight/2);
}

function drawSpectrograph() {
    // Higher resolution spectrograph visualization (middle section)
    let spectroY = height * 0.45;
    let spectroHeight = height * 0.3;
    
    // Draw spectrogram as a high-resolution heatmap
    noStroke();
    let colWidth = width / spectrumHistory.length;
    
    for (let i = 0; i < spectrumHistory.length; i++) {
        let x = i * colWidth;
        let spectrum = spectrumHistory[i];
        
        // Only show lower frequencies for better visibility
        let maxFreqBin = Math.floor(spectrum.length * 0.3); // Show up to ~6kHz
        
        for (let j = 0; j < maxFreqBin; j++) {
            let y = map(j, 0, maxFreqBin, spectroY + spectroHeight, spectroY);
            let intensity = map(spectrum[j], 0, 255, 0, 1);
            
            // Enhanced color mapping with better contrast
            let r, g, b;
            if (intensity < 0.3) {
                // Dark blue to blue
                r = 0;
                g = 0;
                b = intensity * 255 / 0.3;
            } else if (intensity < 0.6) {
                // Blue to cyan
                r = 0;
                g = (intensity - 0.3) * 255 / 0.3;
                b = 255;
            } else if (intensity < 0.8) {
                // Cyan to yellow
                r = (intensity - 0.6) * 255 / 0.2;
                g = 255;
                b = 255 - (intensity - 0.6) * 255 / 0.2;
            } else {
                // Yellow to red
                r = 255;
                g = 255 - (intensity - 0.8) * 255 / 0.2;
                b = 0;
            }
            
            fill(r, g, b, intensity * 200 + 55);
            rect(x, y, colWidth + 1, spectroHeight / maxFreqBin + 1);
        }
    }
}

function drawSpectrum(spectrum) {
    // Current spectrum visualization (bottom section)
    stroke(255, 200, 0);
    strokeWeight(1);
    noFill();
    
    let spectrumY = height * 0.8;
    let spectrumHeight = height * 0.15;
    
    beginShape();
    for (let i = 0; i < spectrum.length; i++) {
        let x = map(i, 0, spectrum.length, 0, width);
        let y = map(spectrum[i], 0, 255, spectrumY + spectrumHeight, spectrumY);
        vertex(x, y);
    }
    endShape();
    
    // Draw frequency markers
    stroke(100);
    strokeWeight(1);
    textAlign(CENTER, TOP);
    fill(150);
    textSize(10);
    
    for (let freq = 0; freq <= 2000; freq += 500) {
        let x = map(freq, 0, 22050, 0, width); // Nyquist frequency
        if (x < width) {
            line(x, spectrumY, x, spectrumY + spectrumHeight);
            text(freq + 'Hz', x, spectrumY + spectrumHeight + 5);
        }
    }
}

function drawLabels() {
    fill(200);
    textAlign(LEFT, TOP);
    textSize(16);
    
    // Visualization labels
    text('Combined Waveform (4 Oscillators)', 10, 20);
    text('High-Res Spectrograph (Combined Signal)', 10, height * 0.45 + 5);
    text('Current Spectrum (Combined)', 10, height * 0.8 + 5);
    
    // Current settings display for all oscillators
    textAlign(RIGHT, TOP);
    textSize(9);
    fill(150);
    let settingsText = '';
    for (let i = 0; i < oscillatorData.length; i++) {
        let data = oscillatorData[i];
        let centsStr = data.cents !== 0 ? ` ${data.cents >= 0 ? '+' : ''}${data.cents}¢` : '';
        settingsText += `OSC${i+1}: ${data.frequency.toFixed(1)}Hz${centsStr} ${data.amplitude.toFixed(2)}amp ${data.waveform} | `;
    }
    text(settingsText, width - 10, 20);
}

function setupControls() {
    // Controls for 4 oscillators
    for (let i = 0; i < 4; i++) {
        // Frequency slider control
        let freqSlider = select(`#frequency${i+1}`);
        let freqInput = select(`#freq-input${i+1}`);
        let centsDisplay = select(`#cents-display${i+1}`);
        let centsMinus = select(`#cents-minus${i+1}`);
        let centsPlus = select(`#cents-plus${i+1}`);
        let centsStepInput = select(`#cents-step${i+1}`);
        
        // Function to update frequency from cents
        function updateFrequencyFromCents(oscIndex) {
            let baseFreq = oscillatorData[oscIndex].baseFreq;
            let cents = oscillatorData[oscIndex].cents;
            // Convert cents to frequency: f = f0 * 2^(cents/1200)
            let newFreq = baseFreq * Math.pow(2, cents / 1200);
            oscillatorData[oscIndex].frequency = newFreq;
            
            // Update displays
            if (freqInput) freqInput.value(newFreq.toFixed(1));
            if (freqSlider && newFreq <= 2000) freqSlider.value(newFreq);
            if (centsDisplay) {
                let sign = cents >= 0 ? '+' : '';
                centsDisplay.html(`${sign}${cents}¢`);
            }
            
            // Update oscillator if playing
            if (oscillators[oscIndex] && isPlaying) {
                oscillators[oscIndex].freq(newFreq);
            }
        }
        
        // Cents step control
        if (centsStepInput) {
            centsStepInput.input(() => {
                let step = parseInt(centsStepInput.value());
                if (step >= 1 && step <= 100) {
                    oscillatorData[i].centsStep = step;
                }
            });
        }
        
        // Frequency slider
        if (freqSlider) {
            freqSlider.input(() => {
                let newFreq = parseFloat(freqSlider.value());
                oscillatorData[i].baseFreq = newFreq;
                oscillatorData[i].frequency = newFreq;
                oscillatorData[i].cents = 0; // Reset cents when using slider
                
                if (freqInput) freqInput.value(newFreq);
                if (centsDisplay) centsDisplay.html('±0¢');
                
                if (oscillators[i] && isPlaying) {
                    oscillators[i].freq(newFreq);
                }
            });
        }
        
        // Frequency number input
        if (freqInput) {
            freqInput.input(() => {
                let newFreq = parseFloat(freqInput.value());
                if (newFreq >= 20 && newFreq <= 20000) {
                    oscillatorData[i].baseFreq = newFreq;
                    oscillatorData[i].frequency = newFreq;
                    oscillatorData[i].cents = 0; // Reset cents when typing frequency
                    
                    if (freqSlider && newFreq <= 2000) freqSlider.value(newFreq);
                    if (centsDisplay) centsDisplay.html('±0¢');
                    
                    if (oscillators[i] && isPlaying) {
                        oscillators[i].freq(newFreq);
                    }
                }
            });
        }
        
        // Cents minus button
        if (centsMinus) {
            centsMinus.mousePressed(() => {
                oscillatorData[i].cents -= oscillatorData[i].centsStep;
                updateFrequencyFromCents(i);
            });
        }
        
        // Cents plus button
        if (centsPlus) {
            centsPlus.mousePressed(() => {
                oscillatorData[i].cents += oscillatorData[i].centsStep;
                updateFrequencyFromCents(i);
            });
        }
        
        // Amplitude control
        let ampSlider = select(`#amplitude${i+1}`);
        let ampValue = select(`#amp-value${i+1}`);
        if (ampSlider) {
            ampSlider.input(() => {
                oscillatorData[i].amplitude = parseFloat(ampSlider.value());
                if (ampValue) ampValue.html(oscillatorData[i].amplitude.toFixed(2));
                if (oscillators[i] && isPlaying) {
                    oscillators[i].amp(oscillatorData[i].amplitude, 0.1);
                }
            });
        }
        
        // Waveform control
        let waveSelect = select(`#waveform${i+1}`);
        if (waveSelect) {
            waveSelect.changed(() => {
                oscillatorData[i].waveform = waveSelect.value();
                if (oscillators[i] && isPlaying) {
                    oscillators[i].setType(oscillatorData[i].waveform);
                }
            });
        }
    }
    
    // Start/Stop buttons
    let startBtn = select('#start-btn');
    let stopBtn = select('#stop-btn');
    
    if (startBtn) startBtn.mousePressed(startOscillators);
    if (stopBtn) stopBtn.mousePressed(stopOscillators);
}

function startOscillators() {
    if (!isPlaying) {
        userStartAudio().then(() => {
            // Start all oscillators with their current settings
            for (let i = 0; i < oscillators.length; i++) {
                oscillators[i].start();
                oscillators[i].amp(oscillatorData[i].amplitude, 0.1);
            }
            isPlaying = true;
            console.log('All oscillators started');
        });
    }
}

function stopOscillators() {
    if (isPlaying) {
        // Stop all oscillators
        for (let i = 0; i < oscillators.length; i++) {
            oscillators[i].stop();
        }
        isPlaying = false;
        
        // Clear visualizations
        spectrumHistory = [];
        for (let i = 0; i < maxHistoryLength; i++) {
            spectrumHistory.push(new Array(1024).fill(0));
        }
        
        console.log('All oscillators stopped');
    }
}

// Keyboard shortcuts
function keyPressed() {
    if (key === ' ') {
        if (isPlaying) {
            stopOscillators();
        } else {
            startOscillators();
        }
        return false; // Prevent default
    }
}

// Handle window resize
function windowResized() {
    resizeCanvas(canvasWidth, canvasHeight);
}
