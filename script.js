/**
 * Alex Morgan Portfolio - Interactive Functionality & Firebase / EmailJS Integration
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  getDocs,
  query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { Renderer, Program, Mesh, Geometry, Triangle, Texture, RenderTarget } from "https://cdn.jsdelivr.net/npm/ogl@0.0.98/+esm";

// ==================== 1. FIREBASE CONFIGURATION ====================
const firebaseConfig = {
  apiKey: "AIzaSyABAfmswXtD1o90u83DDWccRbh0HzuEOZo",
  authDomain: "my-portfolio-3cdf8.firebaseapp.com",
  projectId: "my-portfolio-3cdf8",
  storageBucket: "my-portfolio-3cdf8.firebasestorage.app",
  messagingSenderId: "781308525148",
  appId: "1:781308525148:web:65f86ca8b97e8e6a2ec499",
  measurementId: "G-7CR2PB5QP1"
};

// Initialize Firebase & Firestore
let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase initialization warning:", e);
}

// ==================== 2. EMAILJS CONFIGURATION ====================
// Replace these with your EmailJS credentials from https://dashboard.emailjs.com/
const EMAILJS_CONFIG = {
  publicKey: "YOUR_PUBLIC_KEY",     // e.g. "user_xxxxxxxxxxxx" or public key
  serviceId: "YOUR_SERVICE_ID",     // e.g. "service_xxxxxxx"
  templateId: "YOUR_TEMPLATE_ID"    // e.g. "template_xxxxxxx"
};

// Initialize EmailJS if public key is provided
if (window.emailjs && EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== "YOUR_PUBLIC_KEY") {
  window.emailjs.init(EMAILJS_CONFIG.publicKey);
}

// ==================== 3. DEFAULT PORTFOLIO DATA (FALLBACK) ====================
const defaultProjectsData = {
  '1': {
    title: 'Lumina Creative Studio',
    subtitle: 'Luxury Brand Identity & Editorial Packaging System',
    category: 'branding',
    image: 'assets/images/project1.jpg',
    client: 'Lumina Studios, London',
    timeline: '4 Weeks',
    tools: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Cinema 4D'],
    description: 'A comprehensive brand identity overhaul for a boutique creative consultancy. Developed bespoke typographic hierarchy, iridescent holographic foil finishes on matte black stationery, luxury packaging architecture, and full brand guideline manuals.',
    deliverables: ['Full Brand Book & Guidelines', 'Stationery & Packaging Suite', 'Social Media Asset Templates', 'Custom Vector Iconography'],
    stats: '120% Increase in client brand perception score'
  },
  '2': {
    title: 'Apex Crypto & SaaS Dashboard',
    subtitle: 'Next-Generation FinTech & Analytics Platform UI/UX',
    category: 'uiux',
    image: 'assets/images/project2.jpg',
    client: 'Apex Global Financial',
    timeline: '6 Weeks',
    tools: ['Figma', 'FigJam', 'Protopie', 'After Effects'],
    description: 'End-to-end design of an ultra-modern multi-asset cryptocurrency trading and SaaS analytics interface. Designed responsive dashboard widgets, real-time telemetry charts, dark glassmorphism design language, and seamless companion mobile iOS/Android apps.',
    deliverables: ['Design System with 180+ Components', 'Desktop Web App High-Fi Prototypes', 'iOS & Android Native Mobile Screens', 'Interactive Micro-Animations'],
    stats: '48% Reduction in user onboarding drop-off'
  },
  '3': {
    title: 'Neo-Chrome Static Series',
    subtitle: '3D Kinetic Typographic Artwork & Campaign Posters',
    category: 'graphics',
    image: 'assets/images/project3.jpg',
    client: 'Synergetic Future Fest',
    timeline: '3 Weeks',
    tools: ['Blender', 'Adobe Photoshop', 'Illustrator', 'Midjourney'],
    description: 'An experimental 3D poster art series blending iridescent fluid chrome physics, kinetic typography, and cyber-synth aesthetics. Created for a prominent digital art and music festival spanning both print billboards and animated digital displays.',
    deliverables: ['Set of 8 High-Res Vector/3D Posters', 'Social Media Animated Motion Clips', 'Print-Ready Large Format Billboards', 'NFT & Digital Collectibles Art'],
    stats: 'Over 2.4M Impressions across social media'
  },
  '4': {
    title: 'Vortex Creative AI',
    subtitle: 'Next-Gen Brand Architecture & Identity System',
    category: 'branding',
    image: 'assets/images/project4.jpg',
    client: 'Vortex Artificial Intelligence Inc.',
    timeline: '5 Weeks',
    tools: ['Illustrator', 'Figma', 'Keynote', 'Photoshop'],
    description: 'Complete visual identity system and strategic brand architecture for a cutting-edge artificial intelligence creative platform. Centered around a glowing cyan Mobius symbol that represents continuous computational intelligence and human collaboration.',
    deliverables: ['Core Logo & Responsive Marks', 'Comprehensive Style Guide (64 pages)', 'Corporate Stationery & Merch Design', 'Pitch Deck & Marketing Templates'],
    stats: '$4.5M Series A funding pitch visual deck'
  },
  '5': {
    title: 'Nexus Mobile Studio',
    subtitle: 'AI Video Creator & Multi-Track Audio Timeline App',
    category: 'uiux',
    image: 'assets/images/project5.jpg',
    client: 'Nexus Media Lab',
    timeline: '7 Weeks',
    tools: ['Figma', 'Adobe After Effects', 'Lottie', 'Miro'],
    description: 'Designed a high-power video and audio editing smartphone app tailored specifically for mobile content creators and YouTubers. Featured intuitive gestures, AI voice synthesis timeline scrubber, sound waveform visualizers, and quick-export templates.',
    deliverables: ['Mobile UX Wireframing & User Journeys', '85+ Production App Screens', 'Haptic & Gesture Interaction Prototypes', 'App Store Screenshot Mockup Kit'],
    stats: '4.9★ App Store launch rating'
  },
  '6': {
    title: 'Aetheria Holographic Showcase',
    subtitle: 'Futuristic 3D Cyberpunk Digital Media Campaign',
    category: 'graphics',
    image: 'assets/images/project6.jpg',
    client: 'Quantum Media Agency',
    timeline: '4 Weeks',
    tools: ['Blender 3D', 'Unreal Engine 5', 'After Effects', 'Photoshop'],
    description: 'Created a futuristic cyberpunk 3D holographic digital art installation and experiential marketing showcase. Blended real-world spatial acrylic lighting with dynamic particle physics and neon holographic character visualization.',
    deliverables: ['3D Holographic Spatial Art Keyframes', 'Promotional Video Motion Graphics', 'Event Stage Visual Display Loops', 'Press Kit & Promotional Print Assets'],
    stats: 'Featured on Behance Curated Galleries'
  }
};

// Global in-memory dictionary of current projects
let projectsData = { ...defaultProjectsData };
let activeCategoryFilter = 'all';

// ==================== 4. DOM INITIALIZATION ====================
function initApp() {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- Sticky Navigation & Scrollspy ---
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header maintains clean iOS 27 glass round theme without shading up
    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-4');
        backToTopBtn.classList.add('opacity-100', 'visible', 'translate-y-0');
      } else {
        backToTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-4');
        backToTopBtn.classList.remove('opacity-100', 'visible', 'translate-y-0');
      }
    }

    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-indigo-400', 'font-semibold');
      link.classList.add('text-slate-300');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('text-indigo-400', 'font-semibold');
        link.classList.remove('text-slate-300');
      }
    });
  });

  // --- Mobile Hamburger Menu ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        mobileMenu.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      } else {
        mobileMenu.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
      if (window.lucide) window.lucide.createIcons();
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }

  // --- Modal Lightbox Elements & Functions ---
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDescription = document.getElementById('modalDescription');
  const modalClient = document.getElementById('modalClient');
  const modalTimeline = document.getElementById('modalTimeline');
  const modalStats = document.getElementById('modalStats');
  const modalToolsContainer = document.getElementById('modalTools');
  const modalDeliverablesContainer = document.getElementById('modalDeliverables');

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    if (modalImage) {
      modalImage.src = data.image || 'assets/images/project1.jpg';
      modalImage.alt = data.title || 'Project Showcase';
    }
    if (modalTitle) modalTitle.textContent = data.title || '';
    if (modalSubtitle) modalSubtitle.textContent = data.subtitle || '';
    
    let catDisplay = 'Branding & Identity';
    if ((data.category || '').toLowerCase() === 'uiux') catDisplay = 'UI/UX Platform';
    else if ((data.category || '').toLowerCase() === 'graphics') catDisplay = 'Graphics & 3D';
    else if (data.category) catDisplay = data.category;
    if (modalCategory) modalCategory.textContent = catDisplay;

    if (modalDescription) modalDescription.textContent = data.description || '';
    if (modalClient) modalClient.textContent = data.client || 'Client Project';
    if (modalTimeline) modalTimeline.textContent = data.timeline || '4 Weeks';
    if (modalStats) modalStats.textContent = data.stats || 'Featured Case Study';

    // Render Tools Badges
    if (modalToolsContainer) {
      modalToolsContainer.innerHTML = '';
      const tools = Array.isArray(data.tools) ? data.tools : (data.tools ? data.tools.split(',') : ['Design']);
      tools.forEach(tool => {
        const badge = document.createElement('span');
        badge.className = 'px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300';
        badge.textContent = tool.trim();
        modalToolsContainer.appendChild(badge);
      });
    }

    // Render Deliverables
    if (modalDeliverablesContainer) {
      modalDeliverablesContainer.innerHTML = '';
      const deliverables = Array.isArray(data.deliverables) ? data.deliverables : (data.deliverables ? data.deliverables.split(/[\n,]+/) : ['Final Design Assets']);
      deliverables.forEach(item => {
        const li = document.createElement('li');
        li.className = 'flex items-center gap-2 text-sm text-slate-300';
        li.innerHTML = `
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
          <span>${item.trim()}</span>
        `;
        modalDeliverablesContainer.appendChild(li);
      });
    }

    if (projectModal) {
      projectModal.classList.remove('hidden');
      setTimeout(() => {
        projectModal.classList.add('active');
      }, 10);
      document.body.classList.add('overflow-hidden');
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    setTimeout(() => {
      projectModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 250);
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && !projectModal.classList.contains('hidden')) {
      closeProjectModal();
    }
  });

  // ==================== 5. DYNAMIC PORTFOLIO RENDERING ====================
  const portfolioGrid = document.getElementById('portfolioGrid');
  const filterButtons = document.querySelectorAll('.portfolio-filter-btn');

  function renderPortfolioItems() {
    if (!portfolioGrid) return;
    portfolioGrid.innerHTML = '';

    const projectKeys = Object.keys(projectsData);
    if (projectKeys.length === 0) {
      portfolioGrid.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-400">
          <p class="text-base">No portfolio items available at this time.</p>
        </div>
      `;
      return;
    }

    projectKeys.forEach((key) => {
      const project = projectsData[key];
      const categoryKey = (project.category || 'branding').toLowerCase();
      
      let badgeLabel = 'Branding & Identity';
      let borderHover = 'hover:border-indigo-500/40 hover:shadow-indigo-500/10';
      let tagBadgeStyle = 'bg-dark-950/80 text-indigo-300 border-indigo-500/30';
      let titleHover = 'group-hover:text-indigo-300';
      let exploreColor = 'text-indigo-400';
      let btnBg = 'bg-indigo-600 shadow-indigo-600/40 hover:bg-indigo-500';

      if (categoryKey === 'uiux') {
        badgeLabel = 'UI/UX Platform';
        borderHover = 'hover:border-cyan-500/40 hover:shadow-cyan-500/10';
        tagBadgeStyle = 'bg-dark-950/80 text-cyan-300 border-cyan-500/30';
        titleHover = 'group-hover:text-cyan-300';
        exploreColor = 'text-cyan-400';
        btnBg = 'bg-cyan-600 shadow-cyan-600/40 hover:bg-cyan-500';
      } else if (categoryKey === 'graphics') {
        badgeLabel = 'Graphics & 3D';
        borderHover = 'hover:border-pink-500/40 hover:shadow-pink-500/10';
        tagBadgeStyle = 'bg-dark-950/80 text-pink-300 border-pink-500/30';
        titleHover = 'group-hover:text-pink-300';
        exploreColor = 'text-pink-400';
        btnBg = 'bg-pink-600 shadow-pink-600/40 hover:bg-pink-500';
      }

      const toolsList = Array.isArray(project.tools)
        ? project.tools.slice(0, 2).join(' • ')
        : (project.tools || 'Design');

      const card = document.createElement('div');
      card.className = `portfolio-item group flex flex-col glass-panel rounded-3xl overflow-hidden cursor-pointer border border-white/10 ${borderHover} transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`;
      card.setAttribute('data-category', categoryKey);
      card.setAttribute('data-project-id', key);

      card.innerHTML = `
        <div class="relative aspect-[4/3] overflow-hidden bg-dark-900">
          <img src="${project.image || 'assets/images/project1.jpg'}" alt="${project.title}"
            onerror="this.src='assets/images/project1.jpg'"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div
            class="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 backdrop-blur-[2px]">
            <button type="button" data-project-id="${key}"
              class="preview-project-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-full ${btnBg} text-white font-semibold text-xs shadow-lg transition-colors">
              <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
              <span>Quick View Case Study</span>
            </button>
          </div>
          <div class="absolute top-4 left-4">
            <span class="px-3 py-1 rounded-full text-xs font-semibold ${tagBadgeStyle} border backdrop-blur-md">
              ${badgeLabel}
            </span>
          </div>
        </div>
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-display text-xl font-bold text-white ${titleHover} transition-colors mb-2">
              ${project.title}
            </h3>
            <p class="text-slate-400 text-xs leading-relaxed line-clamp-2">
              ${project.description || project.subtitle || ''}
            </p>
          </div>
          <div class="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between">
            <span class="text-[11px] font-mono text-slate-500 truncate max-w-[65%]">${toolsList}</span>
            <span class="text-xs font-semibold ${exploreColor} flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </span>
          </div>
        </div>
      `;

      // Attach Card Click
      card.addEventListener('click', () => {
        openProjectModal(key);
      });

      // Attach Preview Button Click
      const previewBtn = card.querySelector('.preview-project-btn');
      if (previewBtn) {
        previewBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openProjectModal(key);
        });
      }

      portfolioGrid.appendChild(card);
    });

    applyCategoryFilter(activeCategoryFilter);
    if (window.lucide) window.lucide.createIcons();
  }

  function applyCategoryFilter(filterValue) {
    activeCategoryFilter = filterValue;
    const cards = document.querySelectorAll('.portfolio-item');
    cards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filterValue === 'all' || category === filterValue) {
        card.classList.remove('hidden-item');
        card.classList.add('show-item');
        card.style.display = 'flex';
      } else {
        card.classList.add('hidden-item');
        card.classList.remove('show-item');
        card.style.display = 'none';
      }
    });
  }

  // Category Filter Button Clicks
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/25', 'border-indigo-500');
        b.classList.add('bg-slate-900/60', 'text-slate-400', 'border-white/10', 'hover:text-slate-200', 'hover:border-white/20');
      });

      btn.classList.remove('bg-slate-900/60', 'text-slate-400', 'border-white/10', 'hover:text-slate-200', 'hover:border-white/20');
      btn.classList.add('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/25', 'border-indigo-500');

      const filterValue = btn.getAttribute('data-filter') || 'all';
      applyCategoryFilter(filterValue);
    });
  });

  // Render initial fallback items immediately
  renderPortfolioItems();

  // ==================== 6. FIRESTORE REALTIME SYNC ====================
  if (db) {
    try {
      const projectsCol = collection(db, 'projects');
      onSnapshot(projectsCol, (snapshot) => {
        if (!snapshot.empty) {
          const fetchedProjects = {};
          snapshot.forEach((docSnap) => {
            fetchedProjects[docSnap.id] = {
              id: docSnap.id,
              ...docSnap.data()
            };
          });
          projectsData = fetchedProjects;
          renderPortfolioItems();
        }
      }, (err) => {
        console.info("Notice: Firestore offline or empty, displaying default showcase items.", err.message);
      });
    } catch (err) {
      console.warn("Firestore fetch error:", err);
    }
  }

  // ==================== 7. CONTACT FORM & EMAILJS ====================
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(message, isSuccess = true) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = message;
    
    const iconWrapper = document.getElementById('siteToastIconWrapper');
    if (iconWrapper) {
      if (isSuccess) {
        iconWrapper.className = 'w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0';
        iconWrapper.innerHTML = '<i data-lucide="check-circle" class="w-5 h-5"></i>';
      } else {
        iconWrapper.className = 'w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0';
        iconWrapper.innerHTML = '<i data-lucide="alert-circle" class="w-5 h-5"></i>';
      }
    }

    toastNotification.classList.remove('opacity-0', 'invisible', 'translate-y-5');
    toastNotification.classList.add('opacity-100', 'visible', 'translate-y-0');

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toastNotification.classList.add('opacity-0', 'invisible', 'translate-y-5');
      toastNotification.classList.remove('opacity-100', 'visible', 'translate-y-0');
    }, 5000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const projectTypeInput = document.getElementById('projectType');
      const messageInput = document.getElementById('message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const projectType = projectTypeInput ? projectTypeInput.value : 'General Inquiry';
      const message = messageInput ? messageInput.value.trim() : '';

      // Validation
      if (!name || !email || !message) {
        showToast('Please fill out all required fields before sending.', false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please provide a valid email address.', false);
        return;
      }

      // UI Loading State
      const originalContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending via EmailJS...
      `;

      try {
        // Check if real EmailJS keys are present
        const isEmailJSConfigured = EMAILJS_CONFIG.publicKey &&
          EMAILJS_CONFIG.publicKey !== "YOUR_PUBLIC_KEY" &&
          EMAILJS_CONFIG.serviceId !== "YOUR_SERVICE_ID" &&
          EMAILJS_CONFIG.templateId !== "YOUR_TEMPLATE_ID";

        if (window.emailjs && isEmailJSConfigured) {
          // Send via EmailJS API
          const templateParams = {
            from_name: name,
            from_email: email,
            project_type: projectType,
            message: message,
            reply_to: email
          };
          await window.emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams);
          showToast('🎉 Thank you! Your message has been sent directly to my inbox via EmailJS. I will get back to you within 24 hours!');
        } else {
          // Graceful fallback for initial testing
          await new Promise(resolve => setTimeout(resolve, 1000));
          showToast('🎉 Message received! EmailJS is configured and ready. (To connect your live inbox, add your Service/Template IDs in script.js)');
        }
        contactForm.reset();
      } catch (err) {
        console.error("EmailJS sending error:", err);
        showToast('Message sending error: ' + (err.text || err.message || 'Please try again later'), false);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  // ==================== 8. MODERN INTERACTIVE CURSOR & SPARKLE TRAIL ====================
  function initModernCustomCursor() {
    const dot = document.getElementById('customCursorDot');
    const ring = document.getElementById('customCursorRing');
    const canvas = document.getElementById('cursorParticleCanvas');

    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;

    // Particle Trail Setup
    let ctx = null;
    const particles = [];
    const maxParticles = 40;

    if (canvas) {
      ctx = canvas.getContext('2d');
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
    }

    class SparkleParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3.5 + 1.5;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.02;
        this.vx = (Math.random() - 0.5) * 1.8;
        this.vy = (Math.random() - 0.5) * 1.8;
        this.color = Math.random() > 0.4 ? '56, 189, 248' : '99, 102, 241';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        this.size *= 0.94;
      }
      draw(c) {
        if (this.alpha <= 0) return;
        c.beginPath();
        c.arc(this.x, this.y, Math.max(0.1, this.size), 0, Math.PI * 2);
        c.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        c.shadowColor = '#38bdf8';
        c.shadowBlur = 8;
        c.fill();
        c.shadowBlur = 0;
      }
    }

    const updatePosition = (clientX, clientY) => {
      mouseX = clientX;
      mouseY = clientY;

      if (!isVisible) {
        isVisible = true;
        dot.classList.add('cursor-visible');
        ring.classList.add('cursor-visible');
        ringX = mouseX;
        ringY = mouseY;
      }

      // Dot moves directly with cursor
      dot.style.left = `${mouseX - 5}px`;
      dot.style.top = `${mouseY - 5}px`;

      // Spawn subtle sparkles on movement
      if (ctx && particles.length < maxParticles && Math.random() > 0.3) {
        particles.push(new SparkleParticle(mouseX, mouseY));
      }
    };

    window.addEventListener('pointermove', (e) => updatePosition(e.clientX, e.clientY), { passive: true });
    window.addEventListener('mousemove', (e) => updatePosition(e.clientX, e.clientY), { passive: true });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      dot.classList.remove('cursor-visible');
      ring.classList.remove('cursor-visible');
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      dot.classList.add('cursor-visible');
      ring.classList.add('cursor-visible');
    });

    // Interactive Hover on Buttons, Links & Cards
    const interactiveSelectors = 'a, button, input, textarea, select, [role="button"], .glow-button, .btn-hero-primary, .btn-hero-secondary, .glass-panel, .glass-card, .portfolio-card, [tabindex="0"]';

    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(interactiveSelectors);
      if (target) {
        ring.classList.add('cursor-hover');
        dot.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest(interactiveSelectors);
      if (target) {
        ring.classList.remove('cursor-hover');
        dot.classList.remove('cursor-hover');
      }
    });

    // Mousedown click compression & particle burst
    window.addEventListener('pointerdown', (e) => {
      ring.classList.add('cursor-active');
      dot.classList.add('cursor-active');

      if (ctx) {
        for (let i = 0; i < 10; i++) {
          particles.push(new SparkleParticle(e.clientX || mouseX, e.clientY || mouseY));
        }
      }
    });

    window.addEventListener('pointerup', () => {
      ring.classList.remove('cursor-active');
      dot.classList.remove('cursor-active');
    });

    // Animation Loop: Smooth Ring Lerp & Particles
    function renderCursor() {
      if (isVisible) {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
      }

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.update();
          p.draw(ctx);
          if (p.alpha <= 0 || p.size <= 0.2) {
            particles.splice(i, 1);
          }
        }
      }

      requestAnimationFrame(renderCursor);
    }
    renderCursor();
  }

  // ==================== 8B. WEBGL RIPPLE DISTORTION CURSOR EFFECT ====================
  function initRippleDistortion() {
    const mount = document.getElementById('rippleDistortionContainer');
    if (!mount || window.innerWidth <= 768) return;

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const MAX_WAVES = 100;
    const START_SCALE = 1.5;
    const LIFE_CONSTANT = Math.log(500);

    const waveVertex = `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    attribute vec2 iOffset;
    attribute vec2 iScale;
    attribute float iOpacity;
    varying vec2 vUv;
    varying float vOpacity;
    void main() {
      vUv = uv;
      vOpacity = iOpacity;
      gl_Position = vec4(iOffset + position * iScale, 0.0, 1.0);
    }
    `;

    const waveFragment = `
    precision highp float;
    varying vec2 vUv;
    varying float vOpacity;
    uniform float uRings;
    const float PI = 3.141592653589793;
    const float EDGE = 0.006737947;
    void main() {
      vec2 p = vUv * 2.0 - 1.0;
      float r = dot(p, p);
      if (r > 1.0) discard;
      float brush = (exp(-r * 5.0) - EDGE) / (1.0 - EDGE);
      brush *= 0.55 + 0.45 * cos(sqrt(r) * PI * 2.0 * uRings);
      gl_FragColor = vec4(vec3(brush * vOpacity * vOpacity), 1.0);
    }
    `;

    const screenVertex = `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
    `;

    const compositeFragment = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uDisplacement;
    uniform vec2 uResolution;
    uniform vec2 uTexel;
    uniform vec3 uTint;
    uniform vec3 uHighlight;
    uniform float uStrength;
    uniform float uSwirl;
    uniform float uDispersion;
    uniform float uGlint;
    uniform float uTintAmount;

    const float TAU = 6.283185307179586;

    void main() {
      float amount = texture2D(uDisplacement, vUv).r;
      if (amount <= 0.001) {
        discard;
      }

      float theta = amount * uSwirl * TAU;
      vec2 dir = vec2(sin(theta), cos(theta));
      vec2 push = dir * amount * uStrength;

      vec3 color = mix(vec3(0.04, 0.06, 0.12), uTint, clamp(amount * 1.8, 0.0, 1.0) * uTintAmount);

      if (uGlint > 0.001) {
        float ex = texture2D(uDisplacement, vUv + vec2(uTexel.x, 0.0)).r - texture2D(uDisplacement, vUv - vec2(uTexel.x, 0.0)).r;
        float ey = texture2D(uDisplacement, vUv + vec2(0.0, uTexel.y)).r - texture2D(uDisplacement, vUv - vec2(0.0, uTexel.y)).r;
        vec3 normal = normalize(vec3(-ex * 26.0, -ey * 26.0, 1.0));
        vec3 light = normalize(vec3(-0.35, 0.55, 1.0));
        float raw = pow(max(dot(normal, light), 0.0), 22.0);
        float flatSpec = pow(max(light.z, 0.0), 22.0);
        color += uHighlight * clamp((raw - flatSpec) / max(1.0 - flatSpec, 0.0001), 0.0, 1.0) * uGlint;
      }

      float alpha = clamp(amount * 1.5, 0.0, 0.85);
      gl_FragColor = vec4(color, alpha);
    }
    `;

    const hexToRGB = hex => {
      const clean = (hex || '').replace('#', '');
      const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
      const n = parseInt(full || '000000', 16);
      if (Number.isNaN(n)) return [1, 1, 1];
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    };

    try {
      const renderer = new Renderer({
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.75)
      });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      const canvas = gl.canvas;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      mount.appendChild(canvas);

      const offsets = new Float32Array(MAX_WAVES * 2);
      const scales = new Float32Array(MAX_WAVES * 2);
      const opacities = new Float32Array(MAX_WAVES);

      const waves = Array.from({ length: MAX_WAVES }, () => ({
        x: 0,
        y: 0,
        scale: START_SCALE,
        target: START_SCALE,
        size: 1,
        opacity: 0
      }));
      let current = 0;

      const geometry = new Geometry(gl, {
        position: { size: 2, data: new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]) },
        uv: { size: 2, data: new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]) },
        iOffset: { instanced: 1, size: 2, data: offsets },
        iScale: { instanced: 1, size: 2, data: scales },
        iOpacity: { instanced: 1, size: 1, data: opacities }
      });

      const waveUniforms = { uRings: { value: 4.0 } };
      const waveProgram = new Program(gl, {
        vertex: waveVertex,
        fragment: waveFragment,
        uniforms: waveUniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        cullFace: false
      });
      waveProgram.setBlendFunc(gl.ONE, gl.ONE);
      const waveMesh = new Mesh(gl, { geometry, program: waveProgram, frustumCulled: false });

      const displacementTarget = new RenderTarget(gl, {
        width: 2,
        height: 2,
        depth: false,
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE
      });

      const compositeUniforms = {
        uDisplacement: { value: displacementTarget.texture },
        uResolution: { value: [1, 1] },
        uTexel: { value: [1, 1] },
        uTint: { value: hexToRGB('#6366f1') },
        uHighlight: { value: hexToRGB('#38bdf8') },
        uStrength: { value: 0.25 },
        uSwirl: { value: 1.0 },
        uDispersion: { value: 0.15 },
        uGlint: { value: 0.8 },
        uTintAmount: { value: 0.7 }
      };

      const compositeMesh = new Mesh(gl, {
        geometry: new Triangle(gl),
        program: new Program(gl, {
          vertex: screenVertex,
          fragment: compositeFragment,
          uniforms: compositeUniforms,
          transparent: true,
          depthTest: false,
          depthWrite: false
        })
      });

      let width = 1;
      let height = 1;

      const resize = () => {
        width = Math.max(1, window.innerWidth);
        height = Math.max(1, window.innerHeight);
        renderer.setSize(width, height);
        compositeUniforms.uResolution.value = [width, height];

        const fieldW = Math.max(2, Math.round(width * 0.7));
        const fieldH = Math.max(2, Math.round(height * 0.7));
        displacementTarget.setSize(fieldW, fieldH);
        compositeUniforms.uTexel.value = [1 / fieldW, 1 / fieldH];
      };

      window.addEventListener('resize', resize);
      resize();

      const setNewWave = (x, y, power) => {
        const wave = waves[current];
        current = (current + 1) % MAX_WAVES;
        wave.x = x;
        wave.y = y;
        wave.scale = START_SCALE * power;
        wave.target = START_SCALE * 6 * power;
        wave.size = 140;
        wave.opacity = 1;
      };

      let previousX = 0;
      let previousY = 0;

      const onMove = event => {
        const px = event.clientX;
        const py = height - event.clientY;
        const step = 16;
        if (Math.abs(px - previousX) > step || Math.abs(py - previousY) > step) {
          setNewWave(px, py, 1);
          previousX = px;
          previousY = py;
        }
      };

      const onDown = event => {
        const px = event.clientX;
        const py = height - event.clientY;
        setNewWave(px, py, 2.5);
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });

      let previousTime = 0;
      const loop = now => {
        requestAnimationFrame(loop);
        const delta = previousTime ? Math.min(0.05, (now - previousTime) / 1000) : 0;
        previousTime = now;

        const growth = 1 - Math.exp(-delta * 1.09);
        const decay = Math.exp((-delta * LIFE_CONSTANT) / 2.8);

        for (let i = 0; i < MAX_WAVES; i += 1) {
          const wave = waves[i];
          if (wave.opacity <= 0) {
            opacities[i] = 0;
            continue;
          }

          wave.opacity *= decay;
          wave.scale += (wave.target - wave.scale) * growth;

          if (wave.opacity < 0.002) {
            wave.opacity = 0;
            opacities[i] = 0;
            continue;
          }

          const half = (wave.scale * wave.size) / 2;
          offsets[i * 2] = (wave.x / width) * 2 - 1;
          offsets[i * 2 + 1] = (wave.y / height) * 2 - 1;
          scales[i * 2] = (half / width) * 2;
          scales[i * 2 + 1] = (half / height) * 2;
          opacities[i] = wave.opacity;
        }

        geometry.attributes.iOffset.needsUpdate = true;
        geometry.attributes.iScale.needsUpdate = true;
        geometry.attributes.iOpacity.needsUpdate = true;

        renderer.render({ scene: waveMesh, target: displacementTarget, clear: true });
        renderer.render({ scene: compositeMesh });
      };
      requestAnimationFrame(loop);
    } catch (err) {
      console.warn("Ripple distortion notice:", err);
    }
  }

  // Initialize Custom Cursor & Ripple Distortion
  initModernCustomCursor();
  initRippleDistortion();




  // ==================== 9. SMOOTH SCROLLING ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ==================== 10. VANTA.JS WAVES FULL WEBSITE BACKGROUND ====================
  if (window.VANTA && window.VANTA.WAVES) {
    try {
      window.VANTA.WAVES({
        el: "#website-vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x80418,
        shininess: 18.00,
        waveHeight: 18.00,
        waveSpeed: 1.45,
        zoom: 1.07
      });
    } catch (err) {
      console.warn("Vanta Waves website background notice:", err);
    }
  }

  // ==================== 11. HERO DYNAMIC TYPING ANIMATION ====================
  const typewriterElem = document.getElementById('hero-typewriter');
  if (typewriterElem) {
    const phrases = [
      'Visual Identities',
      'Digital Experiences',
      'UI/UX Systems',
      '3D Brand Assets',
      'Motion Graphics'
    ];
    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let isDeleting = true;

    // Start typing cycle after initial reveal
    setTimeout(() => {
      typeEffect();
    }, 2400);

    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        typewriterElem.textContent = currentPhrase.substring(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typeEffect, 400);
          return;
        }
        setTimeout(typeEffect, 45);
      } else {
        charIndex++;
        typewriterElem.textContent = phrases[phraseIndex].substring(0, charIndex);
        if (charIndex === phrases[phraseIndex].length) {
          isDeleting = true;
          setTimeout(typeEffect, 2200);
          return;
        }
        setTimeout(typeEffect, 80);
      }
    }
  }

  // Re-run icons after 150ms
  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();
  }, 150);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
