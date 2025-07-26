// DOM Elements
const youngKratosSection = document.getElementById("youngKratosSection");
const oldKratosSection = document.getElementById("oldKratosSection");
const revengeText = document.getElementById("revengeText");
const regretText = document.getElementById("regretText");
const youngKratosInfo = document.getElementById("youngKratosInfo");
const oldKratosInfo = document.getElementById("oldKratosInfo");
const youngKratosVideo = document.getElementById("youngKratosVideo");
const oldKratosVideo = document.getElementById("oldKratosVideo");
const bgAudio = document.getElementById("bgAudio");

// Initialize the website
document.addEventListener("DOMContentLoaded", function () {
  initializeAutoplay();
  setupEventListeners();
  setupVideoLoop();
  setupVideoErrorHandling();
  optimizePerformance();
  setTimeout(addVisualEnhancements, 1000);
});

// Initialize autoplay for videos and audio - FIXED: Auto-start background audio
function initializeAutoplay() {
  // Start background audio immediately when page loads
  if (bgAudio) {
    bgAudio.volume = 0.9;

    // Auto-play background music when page loads
    const playAudio = () => {
      bgAudio.play().catch((e) => {
        console.log("Autoplay prevented, will start on first user interaction");
        // Fallback: play on first user interaction
        document.addEventListener(
          "click",
          () => {
            bgAudio.play().catch(console.log);
          },
          { once: true }
        );
      });
    };

    // Start immediately
    playAudio();
  }

  // Set video volumes
  if (youngKratosVideo) {
    youngKratosVideo.volume = 0.0;
  }

  if (oldKratosVideo) {
    oldKratosVideo.volume = 0.0;
  }
}

// Setup video looping
function setupVideoLoop() {
  const videoSettings = {
    young: {
      startTime: 0,
      endTime: null,
    },
    old: {
      startTime: 0,
      endTime: null,
    },
  };

  // Young Kratos video loop
  if (youngKratosVideo) {
    youngKratosVideo.addEventListener("timeupdate", function () {
      if (
        videoSettings.young.endTime &&
        this.currentTime >= videoSettings.young.endTime
      ) {
        this.currentTime = videoSettings.young.startTime;
      }
    });

    youngKratosVideo.addEventListener("loadeddata", function () {
      this.currentTime = videoSettings.young.startTime;
    });
  }

  // Old Kratos video loop
  if (oldKratosVideo) {
    oldKratosVideo.addEventListener("timeupdate", function () {
      if (
        videoSettings.old.endTime &&
        this.currentTime >= videoSettings.old.endTime
      ) {
        this.currentTime = videoSettings.old.startTime;
      }
    });

    oldKratosVideo.addEventListener("loadeddata", function () {
      this.currentTime = videoSettings.old.startTime;
    });
  }
}

// Setup event listeners
function setupEventListeners() {
  // Young Kratos section clicks
  youngKratosSection.addEventListener("click", function (e) {
    e.preventDefault();
    showInfo("young");
  });

  // Old Kratos section clicks
  oldKratosSection.addEventListener("click", function (e) {
    e.preventDefault();
    showInfo("old");
  });

  // Specific text clicks for better UX
  revengeText.addEventListener("click", function (e) {
    e.stopPropagation();
    showInfo("young");
  });

  regretText.addEventListener("click", function (e) {
    e.stopPropagation();
    showInfo("old");
  });

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeInfo();
    } else if (e.key === "1" || e.key === "ArrowLeft") {
      showInfo("young");
    } else if (e.key === "2" || e.key === "ArrowRight") {
      showInfo("old");
    }
  });

  // Smooth hover effects
  youngKratosSection.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.02)";
    this.style.transition = "transform 0.3s ease";
  });

  youngKratosSection.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
  });

  oldKratosSection.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.02)";
    this.style.transition = "transform 0.3s ease";
  });

  oldKratosSection.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
  });

  // Prevent video controls from triggering section clicks
  youngKratosVideo.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  oldKratosVideo.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}

// FIXED: Show information panel - stays open until user closes
function showInfo(type) {
  closeInfo(); // Close any open panels first

  const panel = type === "young" ? youngKratosInfo : oldKratosInfo;

  // Show panel with smooth animation
  panel.style.display = "flex";
  panel.style.opacity = "0";

  // Trigger animation
  setTimeout(() => {
    panel.classList.add("active");
    panel.style.opacity = "1";
  }, 10);

  // Dim main videos (keep them playing but quieter)
  youngKratosVideo.volume = 0.0;
  oldKratosVideo.volume = 0.0;

  // Lower background audio volume
  if (bgAudio) {
    bgAudio.volume = 0.6;
  }

  // Add blur effect to main content
  const mainContent = document.querySelector(".main-content");
  mainContent.style.filter = "blur(5px)";
  mainContent.style.transform = "scale(0.95)";
  mainContent.style.transition = "all 0.5s ease";
}

// FIXED: Close information panel - removes blur from videos
function closeInfo() {
  document.querySelectorAll(".info-panel").forEach((panel) => {
    panel.style.opacity = "0";
    panel.classList.remove("active");
  });

  // Restore volumes
  if (youngKratosVideo) youngKratosVideo.volume = 0.9;
  if (oldKratosVideo) oldKratosVideo.volume = 0.9;
  if (bgAudio) bgAudio.volume = 0.9;

  // Remove blur and scaling
  const mainContent = document.querySelector(".main-content");
  mainContent.style.filter = "none";
  mainContent.style.transform = "scale(1)";
}

// Handle video errors gracefully
function setupVideoErrorHandling() {
  const videos = [youngKratosVideo, oldKratosVideo];

  videos.forEach((video) => {
    if (video) {
      video.addEventListener("error", function (e) {
        console.log("Video failed to load:", e);
        const fallbackImg = document.createElement("img");
        fallbackImg.src = "path/to/fallback-image.jpg";
        fallbackImg.style.cssText = `
          width: 100%;
          height: 100%;
          object-fit: cover;
        `;
        this.parentNode.appendChild(fallbackImg);
        this.style.display = "none";
      });
    }
  });
}

// Optimize performance
function optimizePerformance() {
  // Pause videos when tab is not visible to save resources
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (youngKratosVideo) youngKratosVideo.pause();
      if (oldKratosVideo) oldKratosVideo.pause();
      if (bgAudio) bgAudio.pause();
    } else {
      if (youngKratosVideo)
        youngKratosVideo.play().catch((e) => console.log("Resume failed:", e));
      if (oldKratosVideo)
        oldKratosVideo.play().catch((e) => console.log("Resume failed:", e));
      if (bgAudio)
        bgAudio.play().catch((e) => console.log("Resume failed:", e));
    }
  });
}

// Global function for HTML onclick events
window.closeInfo = closeInfo;

// Add visual enhancements
function addVisualEnhancements() {
  // Add subtle particle effect to VS section
  const vsSection = document.querySelector(".vs-section");

  for (let i = 0; i < 15; i++) {
    const particle = document.createElement("div");
    particle.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: #FFD700;
      border-radius: 50%;
      animation: float ${3 + Math.random() * 2}s ease-in-out infinite;
      animation-delay: ${Math.random() * 2}s;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${0.3 + Math.random() * 0.4};
      box-shadow: 0 0 4px #FFD700;
    `;

    vsSection.appendChild(particle);
  }

  // Add the floating animation CSS
  const style = document.createElement("style");
  style.textContent = `
    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg); 
        opacity: 0.3; 
      }
      50% { 
        transform: translateY(-15px) rotate(180deg); 
        opacity: 0.8; 
      }
    }
  `;
  document.head.appendChild(style);
}

// Preload videos for better performance
function preloadVideos() {
  const videos = [youngKratosVideo, oldKratosVideo];

  videos.forEach((video) => {
    if (video) {
      video.preload = "auto";
    }
  });
}

// Initialize preloading
document.addEventListener("DOMContentLoaded", preloadVideos);
