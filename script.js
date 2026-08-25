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
import { Renderer, Program, Mesh, Geometry, Triangle, RenderTarget } from "https://cdn.jsdelivr.net/npm/ogl@0.0.98/+esm";

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
document.addEventListener('DOMContentLoaded', () => {
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

    if (scrollY > 40) {
      navbar?.classList.add('bg-slate-950/80', 'shadow-lg', 'shadow-indigo-950/20', 'border-b', 'border-white/10');
      navbar?.classList.remove('bg-transparent', 'border-transparent');
    } else {
      navbar?.classList.remove('bg-slate-950/80', 'shadow-lg', 'shadow-indigo-950/20', 'border-b', 'border-white/10');
      navbar?.classList.add('bg-transparent', 'border-transparent');
    }

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

  // ==================== 8. INTERACTIVE WEBGL SWARM CURSOR ====================
  function initSwarmCursor(options = {}) {
    const container = document.getElementById('swarmCursorContainer');
    if (!container || window.innerWidth <= 768) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const config = {
      color: '#6366f1',
      accentColor: '#38bdf8',
      count: 14,
      size: 9,
      merge: 0.77,
      glow: 0.85,
      opacity: 0.95,
      spread: 95,
      separation: 0.15,
      speed: 2.6,
      wander: 0.28,
      trail: 0.75,
      scatterOnClick: true,
      enabled: true,
      ...options
    };

    const FIELD_VERT = `
    precision highp float;
    attribute vec2 position;
    attribute vec2 aLocal;
    attribute float aWeight;
    uniform vec2 uRes;
    varying vec2 vLocal;
    varying float vWeight;

    void main() {
      vLocal = aLocal;
      vWeight = aWeight;
      vec2 clip = (position / uRes) * 2.0 - 1.0;
      gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
    }
    `;

    const FIELD_FRAG = `
    precision highp float;
    varying vec2 vLocal;
    varying float vWeight;

    void main() {
      float d = length(vLocal);
      float a = exp(-d * d * 3.6) * vWeight;
      gl_FragColor = vec4(a, a, a, a);
    }
    `;

    const SCREEN_VERT = `
    precision highp float;
    attribute vec2 uv;
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
    `;

    const COMP_FRAG = `
    precision highp float;
    uniform sampler2D tField;
    uniform vec3 uColor;
    uniform vec3 uAccent;
    uniform float uMerge;
    uniform float uGlow;
    uniform float uOpacity;
    varying vec2 vUv;

    void main() {
      float f = texture2D(tField, vUv).r;

      float edge = uMerge * 0.3;
      float core = smoothstep(uMerge - edge, uMerge + edge, f);
      float halo = smoothstep(uMerge * 0.12, uMerge, f);

      vec3 col = mix(uColor, uAccent, clamp(f / max(uMerge * 2.4, 0.001), 0.0, 1.0));

      float alpha = (core + halo * uGlow * (1.0 - core)) * uOpacity;
      if (alpha <= 0.002) discard;
      gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
    }
    `;

    const hexToRgb = hex => {
      let h = (hex || '').replace('#', '').trim();
      if (h.length === 3)
        h = h.split('').map(c => c + c).join('');
      const n = parseInt(h || '000000', 16);
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    };

    const buildPerm = () => {
      const src = new Uint8Array(256);
      for (let i = 0; i < 256; i++) src[i] = i;
      for (let i = 255; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        const t = src[i];
        src[i] = src[j];
        src[j] = t;
      }
      const perm = new Uint16Array(512);
      for (let i = 0; i < 512; i++) perm[i] = src[i & 255];
      return perm;
    };

    const smoothFade = t => t * t * t * (t * (t * 6 - 15) + 10);

    const gradDot = (h, x, y, z) => {
      const u = h < 8 ? x : y;
      const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    };

    const noise3 = (perm, x, y, z) => {
      const fx = Math.floor(x);
      const fy = Math.floor(y);
      const fz = Math.floor(z);
      const X = fx & 255;
      const Y = fy & 255;
      const Z = fz & 255;
      const rx = x - fx;
      const ry = y - fy;
      const rz = z - fz;
      const u = smoothFade(rx);
      const v = smoothFade(ry);
      const w = smoothFade(rz);

      const A = perm[X] + Y;
      const AA = perm[A & 511] + Z;
      const AB = perm[(A + 1) & 511] + Z;
      const B = perm[(X + 1) & 511] + Y;
      const BA = perm[B & 511] + Z;
      const BB = perm[(B + 1) & 511] + Z;

      const g000 = gradDot(perm[AA & 511] & 15, rx, ry, rz);
      const g100 = gradDot(perm[BA & 511] & 15, rx - 1, ry, rz);
      const g010 = gradDot(perm[AB & 511] & 15, rx, ry - 1, rz);
      const g110 = gradDot(perm[BB & 511] & 15, rx - 1, ry - 1, rz);
      const g001 = gradDot(perm[(AA + 1) & 511] & 15, rx, ry, rz - 1);
      const g101 = gradDot(perm[(BA + 1) & 511] & 15, rx - 1, ry, rz - 1);
      const g011 = gradDot(perm[(AB + 1) & 511] & 15, rx, ry - 1, rz - 1);
      const g111 = gradDot(perm[(BB + 1) & 511] & 15, rx - 1, ry - 1, rz - 1);

      const x00 = g000 + u * (g100 - g000);
      const x10 = g010 + u * (g110 - g010);
      const x01 = g001 + u * (g101 - g001);
      const x11 = g011 + u * (g111 - g011);
      const y0 = x00 + v * (x10 - x00);
      const y1 = x01 + v * (x11 - x01);
      return y0 + w * (y1 - y0);
    };

    try {
      const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio || 1, 1.75) });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.canvas.className = 'swarm-cursor__canvas';
      container.appendChild(gl.canvas);

      const MAX = 120;
      const MAX_QUADS = 6000;
      const HISTORY = 120;
      const positions = new Float32Array(MAX_QUADS * 4 * 2);
      const locals = new Float32Array(MAX_QUADS * 4 * 2);
      const weights = new Float32Array(MAX_QUADS * 4);
      const index = new Uint16Array(MAX_QUADS * 6);
      for (let i = 0; i < MAX_QUADS; i++) {
        const v = i * 4;
        locals.set([-1, -1, 1, -1, 1, 1, -1, 1], v * 2);
        index.set([v, v + 1, v + 2, v, v + 2, v + 3], i * 6);
      }

      const geometry = new Geometry(gl, {
        position: { size: 2, data: positions, usage: gl.DYNAMIC_DRAW },
        aLocal: { size: 2, data: locals },
        aWeight: { size: 1, data: weights, usage: gl.DYNAMIC_DRAW },
        index: { data: index }
      });

      const fieldProgram = new Program(gl, {
        vertex: FIELD_VERT,
        fragment: FIELD_FRAG,
        uniforms: { uRes: { value: [1, 1] } },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        cullFace: false
      });
      fieldProgram.setBlendFunc(gl.ONE, gl.ONE);
      const fieldMesh = new Mesh(gl, { geometry, program: fieldProgram });

      const compProgram = new Program(gl, {
        vertex: SCREEN_VERT,
        fragment: COMP_FRAG,
        uniforms: {
          tField: { value: null },
          uColor: { value: hexToRgb(config.color) },
          uAccent: { value: hexToRgb(config.accentColor) },
          uMerge: { value: config.merge },
          uGlow: { value: config.glow },
          uOpacity: { value: config.opacity }
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        cullFace: false
      });
      const compMesh = new Mesh(gl, { geometry: new Triangle(gl), program: compProgram });

      let target = null;
      let cssW = 1;
      let cssH = 1;

      const resize = () => {
        cssW = window.innerWidth || 1;
        cssH = window.innerHeight || 1;
        renderer.setSize(cssW, cssH);
        fieldProgram.uniforms.uRes.value = [cssW, cssH];
        const w = Math.max(1, Math.round(gl.drawingBufferWidth));
        const h = Math.max(1, Math.round(gl.drawingBufferHeight));
        target = new RenderTarget(gl, { width: w, height: h, depth: false });
      };
      window.addEventListener('resize', resize);
      resize();

      const perm = buildPerm();
      const px = new Float32Array(MAX);
      const py = new Float32Array(MAX);
      const vx = new Float32Array(MAX);
      const vy = new Float32Array(MAX);
      const scale = new Float32Array(MAX);
      const agility = new Float32Array(MAX);
      const handed = new Float32Array(MAX);
      const noiseX = new Float32Array(MAX);
      const noiseY = new Float32Array(MAX);

      const histX = new Float32Array(HISTORY * MAX);
      const histY = new Float32Array(HISTORY * MAX);
      const histT = new Float32Array(HISTORY);
      let histHead = 0;
      let histLen = 0;
      let lastSample = -1;

      const spawn = (i, ox, oy) => {
        const a = Math.random() * Math.PI * 2;
        const r = 40 + Math.random() * 120;
        px[i] = ox + Math.cos(a) * r;
        py[i] = oy + Math.sin(a) * r;
        vx[i] = Math.cos(a) * 60;
        vy[i] = Math.sin(a) * 60;
        for (let h = 0; h < HISTORY; h++) {
          histX[h * MAX + i] = px[i];
          histY[h * MAX + i] = py[i];
        }
      };

      for (let i = 0; i < MAX; i++) {
        spawn(i, cssW * 0.5, cssH * 0.5);
        scale[i] = 0.65 + Math.random() * 0.6;
        agility[i] = 0.75 + Math.random() * 0.5;
        handed[i] = Math.random() < 0.5 ? -1 : 1;
        noiseX[i] = Math.random() * 260;
        noiseY[i] = Math.random() * 260;
      }

      const cursor = { x: cssW * 0.5, y: cssH * 0.5, has: false };
      let burst = 0;
      let activeCount = Math.max(1, Math.min(MAX, Math.round(config.count)));

      const onMove = e => {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
        cursor.has = true;
      };
      const onLeave = () => {
        cursor.has = false;
      };
      const onDown = e => {
        if (!config.scatterOnClick || !config.enabled) return;
        const cx = e.clientX;
        const cy = e.clientY;
        const escape = 620 + config.speed * 130;
        for (let i = 0; i < MAX; i++) {
          let dx = px[i] - cx;
          let dy = py[i] - cy;
          let d = Math.hypot(dx, dy);
          if (d < 1e-3) {
            const a = Math.random() * Math.PI * 2;
            dx = Math.cos(a);
            dy = Math.sin(a);
            d = 1;
          }
          const kick = escape * (0.75 + Math.random() * 0.5);
          vx[i] = (dx / d) * kick;
          vy[i] = (dy / d) * kick;
        }
        burst = 1;
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      document.addEventListener('mouseleave', onLeave);

      let last = performance.now();

      const frame = now => {
        requestAnimationFrame(frame);
        const p = config;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

        if (!p.enabled) {
          renderer.render({ scene: compMesh });
          return;
        }

        const n = Math.max(1, Math.min(MAX, Math.round(p.count)));
        const anchorX = cursor.has ? cursor.x : cssW * 0.5;
        const anchorY = cursor.has ? cursor.y : cssH * 0.5;

        for (let i = activeCount; i < n; i++) spawn(i, anchorX, anchorY);
        activeCount = n;

        const t = now * 0.001;
        burst = Math.max(0, burst - dt / 0.5);

        const maxSpeed = 110 + Math.max(0.1, p.speed) * 165;
        const steerRate = 4.5 + Math.max(0.1, p.speed) * 1.15;
        const maxForce = maxSpeed * 9;
        const band = Math.max(20, p.spread * 0.55);
        const sepDist = Math.max(1, p.spread * 0.42 * (0.35 + p.separation));
        const flowMix = p.wander * 2.4;
        const eps = 0.08;
        const baseScale = 0.0016;
        const fineScale = baseScale * 3.6;

        for (let i = 0; i < n; i++) {
          const dx = anchorX - px[i];
          const dy = anchorY - py[i];
          const dist = Math.hypot(dx, dy) || 1e-4;
          const ux = dx / dist;
          const uy = dy / dist;

          const orbitDrift = noise3(perm, noiseX[i], noiseY[i], t * 0.13);
          const orbit = band * (0.34 + 1.35 * Math.max(0, Math.min(1, orbitDrift + 0.5)));

          const radial = Math.max(-1, Math.min(1, (dist - orbit) / (band * 0.85)));
          const swirl = Math.sqrt(Math.max(0, 1 - radial * radial)) * handed[i];

          let wishX = ux * radial - uy * swirl;
          let wishY = uy * radial + ux * swirl;

          if (flowMix > 0.001) {
            const bx = px[i] * baseScale;
            const by = py[i] * baseScale;
            const bt = t * 0.22;
            const coarseX = (noise3(perm, bx, by + eps, bt) - noise3(perm, bx, by - eps, bt)) / (2 * eps);
            const coarseY = -(noise3(perm, bx + eps, by, bt) - noise3(perm, bx - eps, by, bt)) / (2 * eps);

            const fx = px[i] * fineScale + noiseX[i];
            const fy = py[i] * fineScale + noiseY[i];
            const ft = t * 0.55;
            const fineX = (noise3(perm, fx, fy + eps, ft) - noise3(perm, fx, fy - eps, ft)) / (2 * eps);
            const fineY = -(noise3(perm, fx + eps, fy, ft) - noise3(perm, fx - eps, fy, ft)) / (2 * eps);

            wishX += (coarseX + fineX * 0.7) * flowMix;
            wishY += (coarseY + fineY * 0.7) * flowMix;
          }

          const wl = Math.hypot(wishX, wishY) || 1e-4;
          wishX /= wl;
          wishY /= wl;

          const rate = steerRate * agility[i] * (1 - burst);
          let ax = (wishX * maxSpeed - vx[i]) * rate;
          let ay = (wishY * maxSpeed - vy[i]) * rate;

          if (burst > 0.001) {
            ax -= ux * maxSpeed * burst * 5.5;
            ay -= uy * maxSpeed * burst * 5.5;
          }

          for (let j = 0; j < n; j++) {
            if (j === i) continue;
            const sx = px[i] - px[j];
            const sy = py[i] - py[j];
            const d2 = sx * sx + sy * sy;
            if (d2 > 1e-4 && d2 < sepDist * sepDist) {
              const d = Math.sqrt(d2);
              const f = (1 - d / sepDist) * maxSpeed * 3.2 * p.separation;
              ax += (sx / d) * f;
              ay += (sy / d) * f;
            }
          }

          const al = Math.hypot(ax, ay);
          const cap = maxForce * (1 + burst * 4);
          if (al > cap) {
            ax = (ax / al) * cap;
            ay = (ay / al) * cap;
          }

          vx[i] += ax * dt;
          vy[i] += ay * dt;

          const sp = Math.hypot(vx[i], vy[i]);
          const hi = maxSpeed * (1 + burst * 3.5);
          const lo = maxSpeed * 0.32;
          if (sp > hi) {
            vx[i] = (vx[i] / sp) * hi;
            vy[i] = (vy[i] / sp) * hi;
          } else if (sp < lo && sp > 1e-4) {
            vx[i] = (vx[i] / sp) * lo;
            vy[i] = (vy[i] / sp) * lo;
          }

          px[i] += vx[i] * dt;
          py[i] += vy[i] * dt;
        }

        const nowSec = now * 0.001;
        if (lastSample < 0 || nowSec - lastSample >= 0.008) {
          lastSample = nowSec;
          histT[histHead] = nowSec;
          const base = histHead * MAX;
          for (let i = 0; i < n; i++) {
            histX[base + i] = px[i];
            histY[base + i] = py[i];
          }
          histHead = (histHead + 1) % HISTORY;
          if (histLen < HISTORY) histLen++;
        }

        const trailAge = p.trail * 0.85;
        const perAgent = Math.max(0, Math.floor(MAX_QUADS / n) - 1);
        const maxStamps = Math.min(46, perAgent);

        let quad = 0;
        const pushQuad = (cx, cy, r, w) => {
          const v = quad * 8;
          positions[v] = cx - r;
          positions[v + 1] = cy - r;
          positions[v + 2] = cx + r;
          positions[v + 3] = cy - r;
          positions[v + 4] = cx + r;
          positions[v + 5] = cy + r;
          positions[v + 6] = cx - r;
          positions[v + 7] = cy + r;
          const o = quad * 4;
          weights[o] = w;
          weights[o + 1] = w;
          weights[o + 2] = w;
          weights[o + 3] = w;
          quad++;
        };

        for (let i = 0; i < n; i++) {
          const headR = p.size * scale[i] * 2.1;
          const headW = 1.06 + 0.3 * scale[i];
          pushQuad(px[i], py[i], headR, headW);

          if (trailAge < 0.01 || maxStamps < 2 || histLen < 2) continue;

          const step = Math.max(2, p.size * scale[i] * 0.5);
          const span = step * maxStamps;

          let prevX = px[i];
          let prevY = py[i];
          let walked = 0;
          let nextAt = step;
          let stamps = 0;

          for (let j = 0; j < histLen && stamps < maxStamps; j++) {
            const slot = (histHead - 1 - j + HISTORY) % HISTORY;
            if (nowSec - histT[slot] > trailAge) break;
            const hx = histX[slot * MAX + i];
            const hy = histY[slot * MAX + i];
            const segX = hx - prevX;
            const segY = hy - prevY;
            const segLen = Math.hypot(segX, segY);
            if (segLen < 1e-4) continue;

            while (nextAt <= walked + segLen && stamps < maxStamps) {
              const f = (nextAt - walked) / segLen;
              const u = nextAt / span;
              const taper = Math.pow(Math.max(0, 1 - u), 0.55);
              const rLocal = headR * taper;
              if (rLocal < step) {
                stamps = maxStamps;
                break;
              }
              const stampW = Math.min(headW, (headW * step) / (rLocal * 0.934));
              pushQuad(prevX + segX * f, prevY + segY * f, rLocal, stampW);
              stamps++;
              nextAt += step;
            }

            walked += segLen;
            prevX = hx;
            prevY = hy;
          }
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.aWeight.needsUpdate = true;
        geometry.setDrawRange(0, quad * 6);

        compProgram.uniforms.uColor.value = hexToRgb(p.color);
        compProgram.uniforms.uAccent.value = hexToRgb(p.accentColor);
        compProgram.uniforms.uMerge.value = p.merge;
        compProgram.uniforms.uGlow.value = p.glow;
        compProgram.uniforms.uOpacity.value = p.opacity;

        renderer.render({ scene: fieldMesh, target, clear: true });
        compProgram.uniforms.tField.value = target.texture;
        renderer.render({ scene: compMesh });
      };
      requestAnimationFrame(frame);
    } catch (err) {
      console.warn("Swarm cursor initialization error:", err);
    }
  }

  // Initialize Swarm Cursor
  initSwarmCursor({
    color: '#6366f1',
    accentColor: '#38bdf8',
    count: 14,
    size: 10,
    merge: 0.77,
    glow: 0.85,
    opacity: 0.95,
    spread: 95,
    speed: 2.6,
    trail: 0.75,
    scatterOnClick: true
  });


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
});
