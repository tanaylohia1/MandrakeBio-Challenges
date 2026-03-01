/**
 * Challenges Hub - Shared JavaScript
 * Countdown timers, animations, and utilities
 */

// AIDEV-SECTION: Countdown Timer Functionality

/**
 * Initialize countdown for challenge page (Days/Hours/Minutes/Seconds boxes)
 * @param {string} deadlineStr - ISO date string (e.g., "2026-03-31T23:59:59Z")
 * @param {string} elementId - ID of the countdown container
 */
function initCountdown(deadlineStr, elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;

    const deadline = new Date(deadlineStr);

    function update() {
        const now = new Date();
        const diff = deadline - now;

        if (diff <= 0) {
            container.innerHTML = '<div class="countdown-expired">Challenge Ended</div>';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Update each countdown value using data attributes
        const daysEl = container.querySelector('[data-days]');
        const hoursEl = container.querySelector('[data-hours]');
        const minutesEl = container.querySelector('[data-minutes]');
        const secondsEl = container.querySelector('[data-seconds]');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

        // Add urgency class if less than 7 days
        if (days < 7) {
            container.classList.add('ending-soon');
        }
    }

    update();
    setInterval(update, 1000);
}

/**
 * Calculate and display countdown to a deadline
 * @param {string} deadlineStr - ISO date string or date string (e.g., "2026-03-31")
 * @param {HTMLElement} element - DOM element to update with countdown
 */
function updateCountdown(deadlineStr, element) {
    const deadline = new Date(deadlineStr + 'T23:59:59');
    const now = new Date();
    const diff = deadline - now;

    if (diff <= 0) {
        element.textContent = 'Closed';
        element.classList.add('expired');
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
        element.textContent = `${days}d ${hours}h remaining`;
    } else if (hours > 0) {
        element.textContent = `${hours}h ${minutes}m remaining`;
    } else {
        element.textContent = `${minutes}m remaining`;
    }
}

/**
 * Initialize all countdown timers on the page
 * Looks for elements with data-deadline attribute
 */
function initCountdowns() {
    const countdownElements = document.querySelectorAll('[data-deadline]');

    countdownElements.forEach(el => {
        const deadline = el.getAttribute('data-deadline');
        updateCountdown(deadline, el);
    });

    // Update every minute
    setInterval(() => {
        countdownElements.forEach(el => {
            const deadline = el.getAttribute('data-deadline');
            updateCountdown(deadline, el);
        });
    }, 60000);
}

// AIDEV-SECTION: Animation Utilities
/**
 * Intersection Observer for fade-in animations
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with .animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// AIDEV-SECTION: Navigation
/**
 * Handle navigation scroll behavior
 */
function initNavigation() {
    const nav = document.querySelector('.nav-header');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// AIDEV-SECTION: Utility Functions
/**
 * Format date for display
 * @param {string} dateStr - Date string
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format currency for prizes
 * @param {number} amount - Amount in dollars
 * @returns {string} Formatted currency string
 */
function formatPrize(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// AIDEV-SECTION: FAQ Accordion
/**
 * Initialize FAQ accordion functionality
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');

        if (!question || !answer) return;

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close all other FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                    if (otherIcon) otherIcon.textContent = '+';
                }
            });

            // Toggle current FAQ
            if (isOpen) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
                if (icon) icon.textContent = '+';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                if (icon) icon.textContent = '−';
            }
        });
    });
}

// AIDEV-SECTION: Initialization
/**
 * Initialize all functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    initCountdowns();
    initScrollAnimations();
    initNavigation();
    initFAQ();

    console.log('Challenges hub initialized');
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateCountdown,
        initCountdowns,
        formatDate,
        formatPrize
    };
}
