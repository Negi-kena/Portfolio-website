// 1. DARK MODE TOGGLE
// This matches the id="themeToggle" in the HTML and toggles between themes
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

themeToggle.addEventListener("click", () => {
    // Toggles the light-mode class on the body
    body.classList.toggle("light-mode");
    
    // Change the icon based on the current mode
    if (body.classList.contains("light-mode")) {
        themeToggle.textContent = "🌙"; // Moon icon for light mode (to switch back)
    } else {
        themeToggle.textContent = "☀️"; // Sun icon for dark mode
    }
});

// 2. SCROLL REVEAL ANIMATION
// This makes the sections fade in as you scroll down the page
const observerOptions = {
    threshold: 0.15 // Section triggers when 15% is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, observerOptions);

// Target all elements with the .fade-section class
document.querySelectorAll(".fade-section").forEach(section => {
    observer.observe(section);
});

// // 3. CONTACT FORM VALIDATION (Bonus Feature)
const SUPABASE_URL = "https://cpzxrdasxrrspejskrac.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_d8ons9g7SHBmVqFnj0G38g_0qiWrhZg"; 

// FIX: Changed variable name to "supabaseClient" on the left
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Target your form element
// ... existing form setup logic ...
const msgText = contactForm.querySelector('textarea[placeholder="Your Message"]').value;

// Target our new response element
const responseMsg = document.getElementById("form-response");
// Reset it on every new submit attempt
responseMsg.classList.add("d-none"); 
responseMsg.className = "mt-3 text-center fw-bold d-none"; 

btn.disabled = true;
btn.textContent = "Sending Message...";

try {
    const { data, error } = await supabaseClient
        .from('contact_messages') 
        .insert([{ name: fullName, email: emailAddress, message: msgText }]);
        
    if (error) throw error;
    
    // SUCCESS UI UPDATE (Instead of alert)
    responseMsg.textContent = "🚀 Message sent successfully! Check your inbox shortly.";
    responseMsg.className = "mt-3 text-center fw-bold text-success animate-pop"; // Green text
    responseMsg.classList.remove("d-none");
    
    contactForm.reset();
    
} catch (error) {
    console.error("Form Submission Error:", error.message);
    
    // ERROR UI UPDATE (Instead of alert)
    responseMsg.textContent = "❌ Oops! Something went wrong. Please try again.";
    responseMsg.className = "mt-3 text-center fw-bold text-danger"; // Red text
    responseMsg.classList.remove("d-none");
} finally {
    btn.disabled = false;
    btn.textContent = originalText;
}
// 4. SMOOTH SCROLLING FOR NAVIGATION LINKS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});



