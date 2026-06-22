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
