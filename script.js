const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const navLinks = document.querySelectorAll(".nav__link");
const loader = document.querySelector("[data-loader]");
const year = document.querySelector("[data-year]");
// const resumeLink = document.querySelector("[data-resume-link]");

if (window.lucide) {
    window.lucide.createIcons();
}

if (year) {
    year.textContent = new Date().getFullYear();
}

// window.addEventListener("load", () => {
//     loader?.classList.add("is-hidden");
// });

setTimeout(() => {
    loader?.classList.add("is-hidden");
}, 1700);

function setHeaderState() {
    header?.classList.toggle("is-scrolled", window.scrollY > 10);
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

function closeMenu() {
    navMenu?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");
}

navToggle?.addEventListener("click", () => {
    const isOpen = navMenu?.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", Boolean(isOpen));
});

navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

// Marquee animation-----------------------------
const track = document.querySelector("[data-marquee-track]") || document.querySelector(".slider");

if (track && !prefersReducedMotion) {
    let x = 0;
    let speed = 0.45;
    let limit = track.scrollWidth / 2;
    let isPaused = false;

    const measureTrack = () => {
        limit = track.scrollWidth / 2;
    };

    const animate = () => {
        if (!isPaused && limit > 0) {
            x -= speed;

            if (Math.abs(x) >= limit) {
                x = 0;
            }

            track.style.transform = `translate3d(${x}px, 0, 0)`;
        }

        requestAnimationFrame(animate);
    };

    track.addEventListener("mouseenter", () => {
        isPaused = true;
    });

    track.addEventListener("mouseleave", () => {
        isPaused = false;
    });

    window.addEventListener("resize", measureTrack);
    measureTrack();
    animate();
}

// Reveal animation------------------------
if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));
} else {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
}

// Counter animation-----------------------------
const counters = document.querySelectorAll("[data-count-to]");

function animateCounter(counter) {
    const target = Number(counter.dataset.countTo);
    const suffix = counter.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${Math.round(target * eased)}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    };

    requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach((counter) => counterObserver.observe(counter));
}

// Active nav highlight----------------------
const sections = [...document.querySelectorAll("main section[id]")];

if ("IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const activeId = entry.target.getAttribute("id");

            navLinks.forEach((link) => {
                link.classList.toggle(
                    "is-active",
                    link.getAttribute("href") === `#${activeId}`
                );
            });
        });
    }, {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0
    });

    sections.forEach((section) => activeObserver.observe(section));
}

// Resume link fallback scroll----------------------
// if (resumeLink) {
//     resumeLink.addEventListener("click", (event) => {
//         if (!resumeLink.hasAttribute("download")) {
//             event.preventDefault();

//             const contactForm = document.querySelector("#contact-form");

//             contactForm?.scrollIntoView({
//                 behavior: prefersReducedMotion ? "auto" : "smooth",
//                 block: "start"
//             });
//         }
//     });
// }




// Parallax effect ----------------------------
let parallaxFrame = 0;

window.addEventListener("scroll", () => {
    if (prefersReducedMotion || parallaxFrame) return;

    parallaxFrame = requestAnimationFrame(() => {
        const value = Math.min(window.scrollY / 70, 8);
        document.documentElement.style.setProperty("--hero-parallax", value.toFixed(2));
        parallaxFrame = 0;
    });
}, { passive: true });

// email---------------------------------

emailjs.init("aQMEq9lZkjpseYzyv");

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const submitBtn = form.querySelector("button[type='submit']");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    // ✅ HTML validation check
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    emailjs.sendForm(
        "service_591vjc4",
        "template_8sjfzgz",
        form
    )
    .then(() => {
        status.innerHTML = "✅ Message sent successfully!";
        form.reset();
    })
    .catch((error) => {
        status.innerHTML = "❌ Failed to send message.";
        console.log(error);
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";

        setTimeout(() => {
            status.innerHTML = "";
        }, 3000);
    });
});


// Custom Cursor
// change ----------------------------------------------
const isDesktop = window.matchMedia("(pointer: fine)").matches;

if (!isDesktop) {
    document.querySelector(".custom-cursor")?.remove();
} else {
    const cursor = document.querySelector(".custom-cursor");

    // Cursor follow mouse
    document.addEventListener("mousemove", (e) => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    });

    // Elements jinke upar hover effect chahiye
    const hoverElements = document.querySelectorAll(
        "button, .button, .btn, a, input, textarea"
    );

    hoverElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            cursor.classList.add("text-hover");
        });

        el.addEventListener("mouseleave", () => {
            cursor.classList.remove("text-hover");
        });
    });
}




