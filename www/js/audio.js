let synth = null; let audioInitialized = false;
        async function initAudio() {
            if (audioInitialized) return;
            try {
                await Tone.start();
                synth = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "triangle" }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.5 } }).toDestination();
                synth.volume.value = -15; audioInitialized = true;
            } catch (e) { console.log("Audio init failed", e); }
        }
        function playSfx(type) {
            if (!audioInitialized || !synth) return;
            switch(type) {
                case 'click': synth.triggerAttackRelease("C5", "32n"); break;
                case 'hit': synth.triggerAttackRelease(["C3", "G3"], "16n"); break;
                case 'hurt': synth.triggerAttackRelease("G2", "8n"); break;
                case 'lvlup': synth.triggerAttackRelease(["C5", "E5", "G5", "C6"], "4n"); break;
                case 'boss': synth.triggerAttackRelease(["C2", "C3", "G2"], "2n"); break;
                case 'heal': synth.triggerAttackRelease(["E5", "G5", "C6"], "16n"); break;
                case 'buy': synth.triggerAttackRelease(["G5", "B5"], "16n"); break;
            }
        }
        document.body.addEventListener('click', initAudio, { once: true });
        document.body.addEventListener('touchstart', initAudio, { once: true });