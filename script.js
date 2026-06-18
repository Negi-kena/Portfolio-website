// 1. DARK MODE TOGGLE
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    if (body.classList.contains("light-mode")) {
        themeToggle.textContent = "🌙";
    } else {
        themeToggle.textContent = "☀️";
    }
});

// 2. SCROLL REVEAL ANIMATION
const observerOptions = {
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, observerOptions);

document.querySelectorAll(".fade-section").forEach(section => {
    observer.observe(section);
});

// 3. CONTACT FORM VALIDATION & SUPABASE INTEGRATION
const SUPABASE_URL = "https://cpzxrdasxrrspejskrac.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_d8ons9g7SHBmVqFnj0G38g_0qiWrhZg"; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const contactForm = document.getElementById("contact-form");
const responseMsg = document.getElementById("form-response");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Stop standard page reload/alert fallback

        // Select elements and extract input fields properly by ID matching HTML
        const fullName = document.getElementById("fullName").value;
        const emailAddress = document.getElementById("emailAddress").value;
        const msgText = document.getElementById("userMessage").value;
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;

        // Reset response message element parameters
        responseMsg.classList.add("d-none"); 
        responseMsg.className = "mt-3 text-center fw-bold d-none"; 

        // UI Feedback: Disable button while pushing to DB
        btn.disabled = true;
        btn.textContent = "Sending Message...";

        try {
            const { data, error } = await supabaseClient
                .from('contact_messages') 
                .insert([{ name: fullName, email: emailAddress, message: msgText }]);
                
            if (error) throw error;
            
            // SUCCESS INLINE UI UPDATE
            responseMsg.textContent = "🚀 Message sent successfully! Check your inbox shortly.";
            responseMsg.className = "mt-3 text-center fw-bold text-success"; 
            responseMsg.classList.remove("d-none");
            
            contactForm.reset();
            
        } catch (error) {
            console.error("Form Submission Error:", error.message);
            
            // ERROR INLINE UI UPDATE
            responseMsg.textContent = "❌ Oops! Something went wrong. Please try again.";
            responseMsg.className = "mt-3 text-center fw-bold text-danger"; 
            responseMsg.classList.remove("d-none");
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });
}

// 4. SMOOTH SCROLLING FOR NAVIGATION LINKS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});