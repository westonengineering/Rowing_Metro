let metronomeInterval;

document.getElementById("startStopBtn").addEventListener("click", function() {
    if (metronomeInterval) {
        clearInterval(metronomeInterval);
        metronomeInterval = null;
        this.textContent = 'Start';
    } else {
        let spm = document.getElementById("spm").value;
        let dutyCycle = document.getElementById("dutyCycle").value;
        startMetronome(spm, dutyCycle);
        this.textContent = 'Stop';
    }
});

function drawWave(spm, dutyCycle) {
    let canvas = document.getElementById("waveCanvas");
    let ctx = canvas.getContext("2d");
    const beatInterval = 60 / spm; // Time per beat in seconds
    const dutyTime = beatInterval * (dutyCycle / 100);
    const restTime = beatInterval - dutyTime;
    const dutyWidth = canvas.width * (dutyTime / beatInterval);
    const restWidth = canvas.width - dutyWidth;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(dutyWidth, canvas.height);
    ctx.lineTo(dutyWidth, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.stroke();
}

// Set up the audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration) {
    let oscillator = audioContext.createOscillator();
    oscillator.type = 'sine'; // You can experiment with 'square', 'sawtooth', 'triangle'
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

function startMetronome(spm, dutyCycle) {
    const beatInterval = 60 / spm; // Time per beat in seconds
    const dutyTime = beatInterval * (dutyCycle / 100);
    const restTime = beatInterval - dutyTime;

    metronomeInterval = setInterval(() => {
        playSound(440, dutyTime); // 'tic' sound
        setTimeout(() => playSound(330, restTime), dutyTime * 1000); // 'toc' sound
    }, beatInterval * 1000);
}
