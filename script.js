// ================= LOVE LETTER EXACT TEXT =================
const LOVE_LETTER_TEXT = `Untuk perempuan tercantik yang pernah hadir dalam hidupku.

Terima kasih sudah menjadi seseorang yang begitu baik dan istimewa.

Kamu mungkin tidak sadar, tetapi senyummu bisa membuat hari yang biasa menjadi lebih indah.

Aku suka caramu tersenyum, caramu berbicara, dan semua hal kecil yang membuatmu menjadi dirimu sendiri.

Jangan pernah merasa kurang berharga, karena kamu adalah seseorang yang sangat spesial.

Semoga kamu selalu bahagia, selalu tersenyum, dan tidak pernah kehilangan semangat.

Aku cuma ingin kamu tahu bahwa kehadiranmu sangat berarti. 💗

With Love ❤️`;

// ================= ROMANTIC MUSIC SYNTHESIZER (WEB AUDIO API - 100% OFFLINE) =================
let audioCtx = null;
let isMusicPlaying = false;
let musicTimer = null;

// Gentle romantic piano/music-box melody frequencies
const ROMANTIC_MELODY = [
    523.25, 659.25, 783.99, 1046.50, 987.77, 783.99, 659.25, 587.33,
    698.46, 880.00, 1046.50, 987.77, 783.99, 659.25, 587.33, 523.25
];

function playMusicNote(freq) {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 1.15);
}

function toggleRomanticMusic() {
    const btn = document.getElementById('music-toggle-btn');
    const statusText = document.getElementById('music-status-text');

    if (isMusicPlaying) {
        isMusicPlaying = false;
        clearInterval(musicTimer);
        btn.classList.remove('playing');
        statusText.textContent = 'Musik: OFF';
    } else {
        isMusicPlaying = true;
        btn.classList.add('playing');
        statusText.textContent = 'Musik: ON';
        let noteIdx = 0;
        playMusicNote(ROMANTIC_MELODY[noteIdx++]);
        musicTimer = setInterval(() => {
            if (!isMusicPlaying) return;
            playMusicNote(ROMANTIC_MELODY[noteIdx % ROMANTIC_MELODY.length]);
            noteIdx++;
        }, 650);
    }
}

document.getElementById('music-toggle-btn').addEventListener('click', toggleRomanticMusic);

// ================= BACKGROUND AMBIENT HEARTS, PETALS & SPARKLES =================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let rainIntensity = 28;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const SYMBOLS = ['💗', '🌸', '✨', '🌷', '💕', '⭐'];

function createAmbientParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 13 + Math.random() * 14,
            speedY: 0.6 + Math.random() * 1.4,
            speedX: (Math.random() - 0.5) * 0.8,
            symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            alpha: 0.45 + Math.random() * 0.55
        });
    }
}
createAmbientParticles(rainIntensity);

function renderAmbientLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.font = `${p.size}px serif`;
        ctx.fillText(p.symbol, p.x, p.y);

        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.02) * 0.3;

        if (p.y > canvas.height + 20) {
            p.y = -20;
            p.x = Math.random() * canvas.width;
        }
    });
    requestAnimationFrame(renderAmbientLoop);
}
renderAmbientLoop();

// ================= HEART EXPLOSION EFFECT =================
function triggerHeartBurst(originX, originY) {
    const burstIcons = ['❤️', '💗', '💖', '💕', '🌸', '✨'];
    for (let i = 0; i < 24; i++) {
        const span = document.createElement('span');
        span.className = 'burst-particle';
        span.textContent = burstIcons[Math.floor(Math.random() * burstIcons.length)];
        span.style.left = `${originX}px`;
        span.style.top = `${originY}px`;

        const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.4;
        const distance = 80 + Math.random() * 150;
        span.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
        span.style.setProperty('--ty', `${Math.sin(angle) * distance - 40}px`);

        document.body.appendChild(span);
        setTimeout(() => span.remove(), 1200);
    }
}

// ================= SCREEN NAVIGATION =================
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// ================= STAGE 1 -> STAGE 2 =================
document.getElementById('start-adventure-btn').addEventListener('click', (e) => {
    triggerHeartBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);
    if (!isMusicPlaying) toggleRomanticMusic();
    initMysteryGame();
    switchScreen('stage-game');
});

// ================= STAGE 2: 5 MYSTERY HEART BOXES GAME =================
let winningIndices = [];
let foundCorrectCount = 0;

function initMysteryGame() {
    foundCorrectCount = 0;
    document.getElementById('game-feedback').textContent = '';
    document.getElementById('game-win-box').classList.add('hidden');

    // Reset progress dots
    document.querySelectorAll('.prog-dot').forEach(dot => dot.textContent = '🤍');

    // Pick 3 random winning indices out of 0..4
    const pool = [0, 1, 2, 3, 4];
    pool.sort(() => Math.random() - 0.5);
    winningIndices = pool.slice(0, 3);

    document.querySelectorAll('.heart-box').forEach((box, idx) => {
        box.disabled = false;
        box.classList.remove('correct', 'wrong');
        box.querySelector('.box-icon').textContent = '💌';
        box.querySelector('small').textContent = `Kotak ${idx + 1}`;

        box.onclick = (e) => handleBoxClick(box, idx, e);
    });
}

function handleBoxClick(box, idx, event) {
    if (box.disabled || foundCorrectCount >= 3) return;
    box.disabled = true;

    const feedbackEl = document.getElementById('game-feedback');
    const dots = document.querySelectorAll('.prog-dot');

    if (winningIndices.includes(idx)) {
        box.classList.add('correct');
        box.querySelector('.box-icon').textContent = '💗';
        box.querySelector('small').textContent = 'Ketemu!';
        dots[foundCorrectCount].textContent = '💗';
        foundCorrectCount++;

        const rect = box.getBoundingClientRect();
        triggerHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        playMusicNote(880);

        if (foundCorrectCount < 3) {
            feedbackEl.textContent = `Yeay! Dapat ${foundCorrectCount}/3 hati cinta! Cari ${3 - foundCorrectCount} lagi ✨`;
        } else {
            feedbackEl.textContent = '';
            document.querySelectorAll('.heart-box').forEach(b => b.disabled = true);
            document.getElementById('game-win-box').classList.remove('hidden');
        }
    } else {
        box.classList.add('wrong');
        box.querySelector('.box-icon').textContent = '🌸';
        box.querySelector('small').textContent = 'Zonk Lucu';
        feedbackEl.textContent = 'Isinya kelopak bunga! Coba pilih kotak hati lainnya ya 🌸';
    }
}

// ================= STAGE 2 -> STAGE 3 (ENVELOPE & TYPING LETTER) =================
let typingTimer = null;

document.getElementById('open-envelope-btn').addEventListener('click', (e) => {
    triggerHeartBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);
    switchScreen('stage-letter');
    playEnvelopeAndLetter();
});

function playEnvelopeAndLetter() {
    const envScene = document.getElementById('envelope-scene');
    const envWrapper = document.getElementById('envelope-wrapper');
    const letterCard = document.getElementById('letter-content-card');

    envScene.classList.remove('hidden');
    letterCard.classList.add('hidden');
    envWrapper.classList.remove('open');

    setTimeout(() => {
        envWrapper.classList.add('open');
    }, 350);

    setTimeout(() => {
        envScene.classList.add('hidden');
        letterCard.classList.remove('hidden');
        startTypingLetter();
    }, 1750);
}

function startTypingLetter() {
    if (typingTimer) clearInterval(typingTimer);
    const bodyEl = document.getElementById('typed-letter-body');
    bodyEl.textContent = '';
    let i = 0;

    typingTimer = setInterval(() => {
        bodyEl.textContent += LOVE_LETTER_TEXT.charAt(i);
        i++;
        if (i >= LOVE_LETTER_TEXT.length) {
            clearInterval(typingTimer);
        }
    }, 28);
}

// Love Letter Interactive Buttons
document.getElementById('love-you-btn').addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    triggerHeartBurst(rect.left + rect.width / 2, rect.top);
    playMusicNote(1046.50);
});

document.getElementById('replay-letter-btn').addEventListener('click', () => {
    playEnvelopeAndLetter();
});

// Secret Message Modal
const secretModal = document.getElementById('secret-modal');
document.getElementById('secret-msg-btn').onclick = () => secretModal.classList.remove('hidden');
document.getElementById('close-secret-modal').onclick = () => secretModal.classList.add('hidden');

// Photo Gallery Modal & LocalStorage Persistence
const galleryModal = document.getElementById('gallery-modal');
document.getElementById('gallery-btn').onclick = () => {
    renderPhotoGallery();
    galleryModal.classList.remove('hidden');
};
document.getElementById('close-gallery-modal').onclick = () => galleryModal.classList.add('hidden');

document.getElementById('photo-upload-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
        const savedPhotos = JSON.parse(localStorage.getItem('mylovelygirl_photos')) || [];
        savedPhotos.unshift({
            id: Date.now(),
            src: ev.target.result,
            caption: `Kenangan Indah #${savedPhotos.length + 1} 💗`
        });
        localStorage.setItem('mylovelygirl_photos', JSON.stringify(savedPhotos));
        renderPhotoGallery();
    };
    reader.readAsDataURL(file);
});

function renderPhotoGallery() {
    const grid = document.getElementById('photo-grid');
    const savedPhotos = JSON.parse(localStorage.getItem('mylovelygirl_photos')) || [];
    grid.innerHTML = '';

    if (savedPhotos.length === 0) {
        grid.innerHTML = `
            <div class="photo-card">
                <div class="photo-placeholder">💑</div>
                <span>Foto Berdua #1</span>
            </div>
            <div class="photo-card">
                <div class="photo-placeholder">🌸</div>
                <span>Momen Spesial #2</span>
            </div>
        `;
        return;
    }

    savedPhotos.forEach(photo => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.innerHTML = `
            <img src="${photo.src}" alt="Kenangan Berdua">
            <span>${photo.caption}</span>
            <button class="delete-photo-btn" title="Hapus Foto"><i class="fa-solid fa-trash"></i></button>
        `;
        card.querySelector('.delete-photo-btn').onclick = () => {
            const updated = savedPhotos.filter(p => p.id !== photo.id);
            localStorage.setItem('mylovelygirl_photos', JSON.stringify(updated));
            renderPhotoGallery();
        };
        grid.appendChild(card);
    });
}

// ================= STAGE 3 -> STAGE 4 (CLOSING SCREEN) =================
document.getElementById('to-closing-btn').addEventListener('click', (e) => {
    triggerHeartBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);
    createAmbientParticles(65); // Intensify flower & heart rain
    switchScreen('stage-closing');
});

document.getElementById('closing-love-btn').addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    triggerHeartBurst(rect.left + rect.width / 2, rect.top);
});

document.getElementById('restart-all-btn').addEventListener('click', () => {
    createAmbientParticles(28);
    switchScreen('stage-intro');
});
