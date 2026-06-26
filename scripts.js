function validateForm() {
    var name = document.getElementById("name");
    var email = document.getElementById("email");

    if (name && email) {
        if (name.value === "" || email.value === "") {
            alert("Please fill out all required fields.");
            return false;
        }
    }
    return true;
}

function toggleDescription(id) {
    var desc = document.getElementById(id);
    if (desc) {
        if (desc.style.display === "none") {
            desc.style.display = "block";
        } else {
            desc.style.display = "none";
        }
    }
}

var blockquote = document.querySelector("blockquote");
if (blockquote) {
    blockquote.addEventListener("mouseover", function () {
        blockquote.style.backgroundColor = "#e8f4f8";
        blockquote.style.fontStyle = "italic";
    });

    blockquote.addEventListener("mouseout", function () {
        blockquote.style.backgroundColor = "";
        blockquote.style.fontStyle = "";
    });
}

// Floating back-to-top button (present on every page)
(function () {
    var fab = document.getElementById("backToTopFab");
    if (!fab) return;
    fab.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", function () {
        fab.classList.toggle("show", window.scrollY > 250);
    }, { passive: true });
})();

// In-page image viewer (lightbox) for gallery images
(function () {
    var triggers = document.querySelectorAll(".gallery a");
    if (!triggers.length) return;

    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img alt="">';
    document.body.appendChild(overlay);
    var lbImg = overlay.querySelector("img");

    function open(src, alt) {
        lbImg.src = src;
        lbImg.alt = alt || "";
        overlay.classList.add("open");
        document.body.style.overflow = "hidden";
    }
    function close() {
        overlay.classList.remove("open");
        document.body.style.overflow = "";
        lbImg.src = "";
    }

    triggers.forEach(function (a) {
        a.addEventListener("click", function (e) {
            e.preventDefault();
            var img = a.querySelector("img");
            open(a.getAttribute("href"), img ? img.alt : "");
        });
    });

    overlay.addEventListener("click", function (e) {
        if (e.target === overlay || e.target.classList.contains("lightbox-close")) close();
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && overlay.classList.contains("open")) close();
    });
})();

// Contact form: show success banner after a redirect back with ?sent=1
(function () {
    var banner = document.getElementById("formSuccess");
    if (banner && /[?&]sent=1/.test(window.location.search)) {
        banner.hidden = false;
        banner.scrollIntoView({ behavior: "smooth", block: "center" });
    }
})();
