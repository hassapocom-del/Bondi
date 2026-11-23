// handle the header background on scroll
const header = document.querySelector("header");
const headerHeight = header.offsetHeight;
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    console.log("Scrolling to section:", sectionId);
    // نحسب ارتفاع الهيدر الحالي بعد ما ثبت (بما إنه fixed)
    const targetPosition = section.offsetTop - headerHeight;
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }
}
// handle navLinks
const navLinks = document.querySelectorAll(".nav-item a");
function setActiveLink(sectionId) {
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + sectionId) {
      link.classList.add("active");
    }
  });
}
const sections = document.querySelectorAll("section");
// On scroll, determine which section is active
window.addEventListener("scroll", () => {
  const scrollPos = window.scrollY + headerHeight;
  let currentSection = null;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
      currentSection = section.getAttribute("id");
    }
  });

  if (currentSection) {
    setActiveLink(currentSection);
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    // 1. إزالة كلاس active من جميع الروابط
    navLinks.forEach((l) => l.classList.remove("active"));
    // 2. إضافة كلاس active للرابط اللي تم الضغط عليه
    this.classList.add("active");
    // 3. استخراج id القسم والتمرير إليه
    const sectionId = this.getAttribute("href").substring(1);
    scrollToSection(sectionId);
  });
});

const searchBox = document.querySelector(".search-box");
const searchInput = searchBox.querySelector("input");
let searchTimer;

searchBox.addEventListener("click", (event) => {
  if (!event.target.closest(".search-icon")) return;

  const isActive = searchInput.classList.toggle("active");

  if (isActive) {
    searchInput.focus();
  } else {
    searchInput.blur();
  }
});

function clearSearchHighlight() {
  document.querySelectorAll(".search-match").forEach((element) => {
    element.classList.remove("search-match");
  });
}

function searchAndScroll(value) {
  clearSearchHighlight();

  const searchWord = value.trim().toLowerCase();
  if (!searchWord) return;

  const selectors =
    "h1, h2, h3, h4, h5, h6, p, li, a, button, blockquote, span";
  const matches = [...document.querySelectorAll(selectors)].filter(
    (element) => {
      return element.textContent.toLowerCase().includes(searchWord);
    },
  );

  if (matches.length === 0) return;

  const match = matches.sort(
    (first, second) =>
      first.textContent.trim().length - second.textContent.trim().length,
  )[0];

  match.classList.add("search-match");
  match.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

searchInput.addEventListener("input", () => {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(
    () => searchAndScroll(searchInput.value),
    250,
  );
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    window.clearTimeout(searchTimer);
    searchAndScroll(searchInput.value);
  }

  if (event.key === "Escape") {
    searchInput.value = "";
    searchInput.blur();
    clearSearchHighlight();
  }
});

// handle render images
let images = [];
// جلب البيانات
fetch("js/images.json")
  .then((response) => response.json())
  .then((data) => {
    images = data;
    renderImages("all");
    initTabs();
  })
  .catch((error) => console.error("Error fetching images:", error));
function renderImages(category = "all") {
  const imagesContainer = document.querySelector(".imagesContainer");
  if (!imagesContainer) return;

  imagesContainer.innerHTML = "";

  const filtered =
    category === "all"
      ? images
      : images.filter((img) => img.category === category);

  filtered.forEach((image) => {
    const Pbox = document.createElement("div");
    Pbox.className = "Pbox";
    Pbox.classList.add("col-lg-5");
    
    Pbox.innerHTML = `
          <div class="box mb-3 bg-white" data-work="${image.category}">
            <img class="img-fluid" src="${image.image}" alt="${image.category}" />
          </div>
    `;
    imagesContainer.appendChild(Pbox);
  });
}
function initTabs() {
  const categoryTabs = document.querySelectorAll(".Tabs li");
  if (categoryTabs.length === 0) return;
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      
      categoryTabs.forEach((t) => t.classList.remove("active")) ;
      this.classList.add("active");
      this.classList.add("rounded-pill");
      renderImages(this.dataset.category);
    });
  });
}
