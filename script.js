// Sound and Video References
const flipSound = document.getElementById("flipSound");
const bgMusic = document.getElementById("bgMusic");
const introVideo = document.getElementById("introVideo");

// Overlays
const calendarOverlay = document.getElementById("calendarOverlay");
const videoOverlay = document.getElementById("videoOverlay");
const greetingOverlay = document.getElementById("greetingOverlay");

// Function wey di button dey call to unlock audio & start animation
function initExperience() {
    const startBtn = document.getElementById("startBtn");
    if (startBtn) startBtn.style.display = "none";

    // Unlock browser audio restriction
    flipSound.play().then(() => {
        flipSound.pause();
        flipSound.currentTime = 0;
    }).catch(e => console.log(e));

    startCalendarAnimation();
}

// 1. Calendar Flip Logic
function startCalendarAnimation() {
    let day = 1;
    const targetDay = 10;
    const calendarDayEl = document.getElementById("calendarDay");
    const calendarCard = document.getElementById("calendarCard");

    const interval = setInterval(() => {
        try { 
            flipSound.currentTime = 0; 
            flipSound.play(); 
        } catch(e){}

        calendarCard.classList.add("flip");

        setTimeout(() => {
            day++;
            calendarDayEl.textContent = day;
            calendarCard.classList.remove("flip");

            if (day >= targetDay) {
                clearInterval(interval);
                setTimeout(() => {
                    calendarOverlay.classList.add("hidden");
                    startVideoPhase();
                }, 1000);
            }
        }, 150);
    }, 400);
}

// 2. Video Playing Phase with Sound Unmuted
function startVideoPhase() {
    videoOverlay.classList.remove("hidden");
    introVideo.muted = false; // Turn on video sound
    introVideo.currentTime = 0;

    introVideo.play().catch((err) => {
        console.log("Autoplay error:", err);
        introVideo.muted = true;
        introVideo.play();
    });

    introVideo.onended = () => {
        endVideoPhase();
    };
}

function endVideoPhase() {
    videoOverlay.classList.add("hidden");
    startGreetingPhase();
}

// 3. Greeting, Fireworks & Music Phase
function startGreetingPhase() {
    greetingOverlay.classList.remove("hidden");
    
    // Play Background Music
    try {
        bgMusic.volume = 0.8;
        bgMusic.play();
    } catch(e) {}

    // Trigger Effects
    createBalloons();
    initFireworks();

    // Hide greeting overlay after 4.5 seconds
    setTimeout(() => {
        greetingOverlay.classList.add("hidden");
    }, 4500);
}

// Floating Balloons
function createBalloons() {
    const container = document.getElementById("balloonContainer");
    const colors = ["#ff4d4d", "#ffaf40", "#fffa65", "#32ff7e", "#7d5fff", "#ff4b4b"];
    
    for (let i = 0; i < 30; i++) {
        const balloon = document.createElement("div");
        balloon.className = "balloon";
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.animationDelay = `${Math.random() * 2}s`;
        balloon.style.animationDuration = `${3 + Math.random() * 3}s`;
        container.appendChild(balloon);
    }
}

// Simple Fireworks Effect
function initFireworks() {
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ["#ff0055", "#00ddff", "#00ff66", "#ffcc00", "#ff6600"];

    function createParticle(x, y) {
        const count = 30;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: Math.random() * 0.02 + 0.015
            });
        }
    }

    // Launch random bursts
    const fireInterval = setInterval(() => {
        createParticle(
            Math.random() * canvas.width,
            Math.random() * (canvas.height * 0.6)
        );
    }, 300);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            ctx.globalAlpha = Math.max(p.alpha, 0);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();

            if (p.alpha <= 0) particles.splice(index, 1);
        });
        requestAnimationFrame(animate);
    }
    animate();

    setTimeout(() => clearInterval(fireInterval), 4000);
}

// Navigation Tab Switching
function showSection(sectionId) {
    document.querySelectorAll(".content-section").forEach(sec => sec.classList.remove("active"));
    document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
    
    document.getElementById(sectionId).classList.add("active");
    if (event && event.target) {
        event.target.classList.add("active");
    }
}

// LocalStorage Feedback Management & Admin Panel
function submitFeedback(event) {
    event.preventDefault();
    const name = document.getElementById("guestName").value;
    const message = document.getElementById("guestMessage").value;

    const existingData = JSON.parse(localStorage.getItem("pujaFeedback")) || [];
    existingData.push({ name, message, date: new Date().toLocaleString("bn-BD") });
    
    localStorage.setItem("pujaFeedback", JSON.stringify(stringify(existingData)));
    
    alert("ধন্যবাদ! আপনার শুভেচ্ছা ও বার্তাটি সফলভাবে সংরক্ষিত হয়েছে।");
    document.getElementById("feedbackForm").reset();
}

function showAdminModal() {
    document.getElementById("adminModal").classList.remove("hidden");
}

function closeAdminModal() {
    document.getElementById("adminModal").classList.add("hidden");
}

function checkAdminLogin() {
    const email = document.getElementById("adminEmail").value;
    const error = document.getElementById("loginError");
    
    if (email.trim().toLowerCase() === "rijubala73@gmail.com") {
        error.textContent = "";
        document.getElementById("adminLoginArea").classList.add("hidden");
        document.getElementById("adminDashboard").classList.remove("hidden");
        loadFeedbacks();
    } else {
        error.textContent = "ভুল ইমেইল! শুধুমাত্র অনুমোদিত এডমিন লগইন করতে পারবেন।";
    }
}

function loadFeedbacks() {
    const feedbackList = document.getElementById("feedbackList");
    const data = JSON.parse(localStorage.getItem("pujaFeedback")) || [];

    if (data.length === 0) {
        feedbackList.innerHTML = "<p>এখনো কোনো মতামত জমা পড়েনি।</p>";
        return;
    }

    feedbackList.innerHTML = data.map(item => `
        <div class="feedback-item">
            <strong>👤 ${item.name}</strong> <small>(${item.date})</small>
            <p>💬 ${item.message}</p>
        </div>
    `).join("");
}
