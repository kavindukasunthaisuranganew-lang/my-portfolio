/**
 * Freelance Graphic Designer & Content Creator Portfolio
 * Interactive Functionality & UX Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- Project Details Data for Modal Lightbox ---
  const projectsData = {
    1: {
      title: 'Lumina Creative Studio',
      subtitle: 'Luxury Brand Identity & Editorial Packaging System',
      category: 'Branding',
      image: 'assets/images/project1.jpg',
      client: 'Lumina Studios, London',
      timeline: '4 Weeks',
      tools: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Cinema 4D'],
      description: 'A comprehensive brand identity overhaul for a boutique creative consultancy. Developed bespoke typographic hierarchy, iridescent holographic foil finishes on matte black stationery, luxury packaging architecture, and full brand guideline manuals.',
      deliverables: ['Full Brand Book & Guidelines', 'Stationery & Packaging Suite', 'Social Media Asset Templates', 'Custom Vector Iconography'],
      stats: '120% Increase in client brand perception score'
    },
    2: {
      title: 'Apex Crypto & SaaS Dashboard',
      subtitle: 'Next-Generation FinTech & Analytics Platform UI/UX',
      category: 'UI/UX',
      image: 'assets/images/project2.jpg',
      client: 'Apex Global Financial',
      timeline: '6 Weeks',
      tools: ['Figma', 'FigJam', 'Protopie', 'After Effects'],
      description: 'End-to-end design of an ultra-modern multi-asset cryptocurrency trading and SaaS analytics interface. Designed responsive dashboard widgets, real-time telemetry charts, dark glassmorphism design language, and seamless companion mobile iOS/Android apps.',
      deliverables: ['Design System with 180+ Components', 'Desktop Web App High-Fi Prototypes', 'iOS & Android Native Mobile Screens', 'Interactive Micro-Animations'],
      stats: '48% Reduction in user onboarding drop-off'
    },
    3: {
      title: 'Neo-Chrome Static Series',
      subtitle: '3D Kinetic Typographic Artwork & Campaign Posters',
      category: 'Graphics',
      image: 'assets/images/project3.jpg',
      client: 'Synergetic Future Fest',
      timeline: '3 Weeks',
      tools: ['Blender', 'Adobe Photoshop', 'Illustrator', 'Midjourney'],
      description: 'An experimental 3D poster art series blending iridescent fluid chrome physics, kinetic typography, and cyber-synth aesthetics. Created for a prominent digital art and music festival spanning both print billboards and animated digital displays.',
      deliverables: ['Set of 8 High-Res Vector/3D Posters', 'Social Media Animated Motion Clips', 'Print-Ready Large Format Billboards', 'NFT & Digital Collectibles Art'],
      stats: 'Over 2.4M Impressions across social media'
    },
    4: {
      title: 'Vortex Creative AI',
      subtitle: 'Next-Gen Brand Architecture & Identity System',
      category: 'Branding',
      image: 'assets/images/project4.jpg',
      client: 'Vortex Artificial Intelligence Inc.',
      timeline: '5 Weeks',
      tools: ['Illustrator', 'Figma', 'Keynote', 'Photoshop'],
      description: 'Complete visual identity system and strategic brand architecture for a cutting-edge artificial intelligence creative platform. Centered around a glowing cyan Mobius symbol that represents continuous computational intelligence and human collaboration.',
      deliverables: ['Core Logo & Responsive Marks', 'Comprehensive Style Guide (64 pages)', 'Corporate Stationery & Merch Design', 'Pitch Deck & Marketing Templates'],
      stats: '$4.5M Series A funding pitch visual deck'
    },
    5: {
      title: 'Nexus Mobile Studio',
      subtitle: 'AI Video Creator & Multi-Track Audio Timeline App',
      category: 'UI/UX',
      image: 'assets/images/project5.jpg',
      client: 'Nexus Media Lab',
      timeline: '7 Weeks',
      tools: ['Figma', 'Adobe After Effects', 'Lottie', 'Miro'],
      description: 'Designed a high-power video and audio editing smartphone app tailored specifically for mobile content creators and YouTubers. Featured intuitive gestures, AI voice synthesis timeline scrubber, sound waveform visualizers, and quick-export templates.',
      deliverables: ['Mobile UX Wireframing & User Journeys', '85+ Production App Screens', 'Haptic & Gesture Interaction Prototypes', 'App Store Screenshot Mockup Kit'],
      stats: '4.9★ App Store launch rating'
    },
    6: {
      title: 'Aetheria Holographic Showcase',
      subtitle: 'Futuristic 3D Cyberpunk Digital Media Campaign',
      category: 'Graphics',
      image: 'assets/images/project6.jpg',
      client: 'Quantum Media Agency',
      timeline: '4 Weeks',
      tools: ['Blender 3D', 'Unreal Engine 5', 'After Effects', 'Photoshop'],
      description: 'Created a futuristic cyberpunk 3D holographic digital art installation and experiential marketing showcase. Blended real-world spatial acrylic lighting with dynamic particle physics and neon holographic character visualization.',
      deliverables: ['3D Holographic Spatial Art Keyframes', 'Promotional Video Motion Graphics', 'Event Stage Visual Display Loops', 'Press Kit & Promotional Print Assets'],
      stats: 'Featured on Behance Curated Galleries'
    }
  };

  // --- Sticky Navigation & Scroll Effects ---
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Navbar glass intensity on scroll
    if (scrollY > 40) {
      navbar.classList.add('bg-slate-950/80', 'shadow-lg', 'shadow-indigo-950/20', 'border-b', 'border-white/10');
      navbar.classList.remove('bg-transparent', 'border-transparent');
    } else {
      navbar.classList.remove('bg-slate-950/80', 'shadow-lg', 'shadow-indigo-950/20', 'border-b', 'border-white/10');
      navbar.classList.add('bg-transparent', 'border-transparent');
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-4');
        backToTopBtn.classList.add('opacity-100', 'visible', 'translate-y-0');
      } else {
        backToTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-4');
        backToTopBtn.classList.remove('opacity-100', 'visible', 'translate-y-0');
      }
    }

    // Scrollspy for active nav links
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

  // --- Portfolio Filter Functionality ---
  const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update button active state
      filterButtons.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/25', 'border-indigo-500');
        b.classList.add('bg-slate-900/60', 'text-slate-400', 'border-white/10', 'hover:text-slate-200', 'hover:border-white/20');
      });

      btn.classList.remove('bg-slate-900/60', 'text-slate-400', 'border-white/10', 'hover:text-slate-200', 'hover:border-white/20');
      btn.classList.add('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/25', 'border-indigo-500');

      const filterValue = btn.getAttribute('data-filter');

      // Filter portfolio items
      portfolioCards.forEach(card => {
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
    });
  });

  // --- Project Modal Lightbox Details ---
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
  const previewButtons = document.querySelectorAll('.preview-project-btn');

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    modalImage.src = data.image;
    modalImage.alt = data.title;
    modalTitle.textContent = data.title;
    modalSubtitle.textContent = data.subtitle;
    modalCategory.textContent = data.category;
    modalDescription.textContent = data.description;
    modalClient.textContent = data.client;
    modalTimeline.textContent = data.timeline;
    modalStats.textContent = data.stats;

    // Render tools badges
    modalToolsContainer.innerHTML = '';
    data.tools.forEach(tool => {
      const badge = document.createElement('span');
      badge.className = 'px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300';
      badge.textContent = tool;
      modalToolsContainer.appendChild(badge);
    });

    // Render deliverables list
    modalDeliverablesContainer.innerHTML = '';
    data.deliverables.forEach(item => {
      const li = document.createElement('li');
      li.className = 'flex items-center gap-2 text-sm text-slate-300';
      li.innerHTML = `
        <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
        <span>${item}</span>
      `;
      modalDeliverablesContainer.appendChild(li);
    });

    projectModal.classList.remove('hidden');
    setTimeout(() => {
      projectModal.classList.add('active');
    }, 10);
    document.body.classList.add('overflow-hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  function closeProjectModal() {
    projectModal.classList.remove('active');
    setTimeout(() => {
      projectModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 300);
  }

  previewButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectId = btn.getAttribute('data-project-id');
      openProjectModal(projectId);
    });
  });

  // Also allow clicking anywhere on the card
  portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-id');
      openProjectModal(projectId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !projectModal.classList.contains('hidden')) {
      closeProjectModal();
    }
  });

  // --- Contact Form Submission & Toast ---
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(message, isSuccess = true) {
    if (!toastNotification) return;
    toastMessage.textContent = message;
    toastNotification.classList.remove('opacity-0', 'invisible', 'translate-y-5');
    toastNotification.classList.add('opacity-100', 'visible', 'translate-y-0');

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toastNotification.classList.add('opacity-0', 'invisible', 'translate-y-5');
      toastNotification.classList.remove('opacity-100', 'visible', 'translate-y-0');
    }, 4500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      // Validation
      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showToast('Please fill out all required fields.', false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showToast('Please provide a valid email address.', false);
        return;
      }

      // Simulate sending state
      const originalContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending Message...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
        contactForm.reset();
        showToast('🎉 Thank you! Your message has been sent successfully. I will get back to you within 24 hours!');
        if (window.lucide) window.lucide.createIcons();
      }, 1200);
    });
  }

  // --- Subtle Interactive Ambient Glow on Cursor (Desktop) ---
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.innerWidth > 768) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // --- Smooth Scroll for anchor links ---
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

  // Re-run Lucide icons after rendering
  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();
  }, 100);
});
