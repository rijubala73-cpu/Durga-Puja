// Sound and Video References
const flipSound = document.getElementById("flipSound");
const bgMusic = document.getElementById("bgMusic");
const introVideo = document.getElementById("introVideo");

// Overlays
const calendarOverlay = document.getElementById("calendarOverlay");
const videoOverlay = document.getElementById("videoOverlay");
const greetingOverlay = document.getElementById("greetingOverlay");

// পেজ লোড হলে স্বয়ংক্রিয়ভাবে কিছুই শুরু হবে না
document.addEventListener("DOMContentLoaded", () => {
    // শুধুমাত্র ইউজারের বাটন ক্লিকে সব শুরু হবে
});

// "আমন্ত্রণপত্র খুলতে ক্লিক করুন" বাটনে চাপ দিলে এই ফাংশনটি কল হবে
function initExperience() {
    const startBtn = document.getElementById("startBtn");
    if (startBtn) {
        startBtn.style.display = "none"; // বাটনটি লুকিয়ে ফেলা হলো
    }

    // ১. সাউন্ড ও ভিডিও প্লে করার অনুমতি (User Gesture unlock)
    flipSound.play().then(() => {
        flipSound.pause();
        flipSound.currentTime = 0;
    }).catch(e => console.log("Audio permission unlocked"));

    // ২. এবার ক্যালেন্ডারের পাতা উল্টানো এবং সাউন্ড শুরু হবে
    startCalendarAnimation();
}

// ১. ক্যালেন্ডার পাতার অ্যানিমেশন ও উল্টানোর শব্দ (১ থেকে ১০ অক্টোবর)
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

            // ১০ তারিখে পৌছালে ক্যালেন্ডার বন্ধ হয়ে ভিডিও শুরু হবে
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

// ২. ভিডিও প্লে (ভিডিওর নিজস্ব সাউন্ড সহ)
function startVideoPhase() {
    videoOverlay.classList.remove("hidden");
    introVideo.muted = false; // ভিডিওর সাউন্ড চালু
    introVideo.currentTime = 0;

    introVideo.play().catch((err) => {
        console.log("Autoplay blocked, running muted:", err);
        introVideo.muted = true;
        introVideo.play();
    });

    // ভিডিও শেষ হলে পরবর্তী ধাপে যাবে
    introVideo.onended = () => {
        endVideoPhase();
    };
}

function endVideoPhase() {
    videoOverlay.classList.add("hidden");
    startGreetingPhase();
}

// ৩. শুভেচ্ছা বার্তা, বেলুন, আতশবাজি ও ব্যাকগ্রাউন্ড মিউজিক
function startGreetingPhase() {
    greetingOverlay.classList.remove("hidden");
    
    // ব্যাকগ্রাউন্ড মিউজিক চালু (যা আর থামবে না)
    try {
        bgMusic.volume = 0.8;
        bgMusic.play();
    } catch(e) {}

    // আতশবাজি ও বেলুন এনিমেশন
    createBalloons();
    initFireworks();

    // ৪.৫ সেকেন্ড পর শুভেচ্ছা পর্দা উঠে যাবে এবং মূল নিমন্ত্রণপত্র দৃশ্যমান হবে
    setTimeout(() => {
        greetingOverlay.classList.add("hidden");
    }, 4500);
}

// ভাসমান বেলুন অ্যানিমেশন
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

// আতশবাজি (Fireworks) অ্যানিমেশন
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

// নেভিগেশন সেকশন পরিবর্তন
function showSection(sectionId) {
    document.querySelectorAll(".content-section").forEach(sec => sec.classList.remove("active"));
    document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
    
    document.getElementById(sectionId).classList.add("active");
    if (window.event && window.event.target) {
        window.event.target.classList.add("active");
    }
}

// মতামত সেভ ও এডমিন প্যানেল
function submitFeedback(event) {
    event.preventDefault();
    const name = document.getElementById("guestName").value;
    const message = document.getElementById("guestMessage").value;

    const existingData = JSON.parse(localStorage.getItem("pujaFeedback")) || [];
    existingData.push({ name, message, date: new Date().toLocaleString("bn-BD") });
    
    localStorage.setItem("pujaFeedback", JSON.stringify(existingData));
    
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

// Disable Right Click
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Disable Keyboard Shortcuts for Inspect Element
document.addEventListener('keydown', (e) => {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
    ) {
        e.preventDefault();
    }
});
