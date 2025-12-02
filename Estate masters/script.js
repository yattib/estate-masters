// ----------------------------
// PROPERTY DATA + UTILITIES
// ----------------------------
const rawProps = JSON.parse(JSON.stringify(PROPS_DATA));

function formatKsh(n) {
  return n.toLocaleString("en-KE");
}

// Get URL parameters for filtering
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// ----------------------------
// FEATURED GRID RENDER
// ----------------------------
function renderFeatured() {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;

  const featured = rawProps.filter((p) => p.featured);

  featured.forEach((p) => {
    const div = document.createElement("div");
    div.className = "card property-card";
    div.innerHTML = `
      <div class="property-image" style="background-image: url('${
        p.image
      }'); background-size: cover; background-position: center;">
        <div class="featured-badge">Featured</div>
        <div class="property-type-badge">${p.type}</div>
      </div>
      <div class="property-content">
        <h4 style="margin:0">${p.title}</h4>
        <div class="property-price">KSH ${formatKsh(
          p.price
        )}<span style="font-size:12px; color:var(--muted); font-weight:400">${
      p.category === "sale" ? "/= Total" : "/= Monthly"
    }</span></div>
        <div class="muted">${p.location}</div>
        <p class="muted" style="font-size:13px; margin:8px 0">${p.desc}</p>
        <div class="meta">
          <span>${p.beds} bed${p.beds !== 1 ? "s" : ""}</span>
          <a href="properties.html?category=${
            p.category
          }" class="btn-secondary btn-small">View</a>
        </div>
      </div>`;
    grid.appendChild(div);
  });
}

// ----------------------------
// HAMBURGER + MOBILE MENU (FIXED FOR ALL PAGES)
// ----------------------------
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      mobileMenu.classList.toggle("open");
    });

    // Close when any mobile link is clicked
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("active");
      });
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("active");
      }
    });
  }
}

// ----------------------------
// MOBILE DROPDOWN LOGIC
// ----------------------------
function initMobileDropdown() {
  const mobileDropdownToggles = document.querySelectorAll(
    ".mobile-dropdown-toggle"
  );

  mobileDropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const parent = toggle.closest(".mobile-dropdown");
      const menu = parent.querySelector(".mobile-dropdown-menu");

      const isOpen = parent.classList.contains("open");

      // Close ALL dropdowns first
      document.querySelectorAll(".mobile-dropdown").forEach((dd) => {
        dd.classList.remove("open");
        dd.querySelector(".mobile-dropdown-menu").style.maxHeight = null;
      });

      // Toggle current
      if (!isOpen) {
        parent.classList.add("open");
        menu.style.maxHeight = menu.scrollHeight + "px";
      } else {
        parent.classList.remove("open");
        menu.style.maxHeight = null;
      }
    });
  });
}

// ----------------------------
// PROPERTY LISTING FILTERS
// ----------------------------
function renderResults(list) {
  const grid = document.getElementById("resultsGrid");
  const count = document.getElementById("resultsCount");
  if (!grid || !count) return;

  grid.innerHTML = "";
  count.textContent = list.length + " listing" + (list.length !== 1 ? "s" : "");

  if (list.length === 0) {
    grid.innerHTML = `
      <p class="muted" style="grid-column:1/-1; text-align:center; padding:40px">
        No properties match your filters. Try clearing your search criteria or 
        <a href="contact.html" style="color:var(--accent)">contact us</a> for help.
      </p>`;
    return;
  }

  list.forEach((p) => {
    const div = document.createElement("div");
    div.className = "card property-card";

    // Format amenities as badges
    const amenitiesBadges =
      p.amenities && p.amenities.length > 0
        ? p.amenities
            .slice(0, 3)
            .map((a) => `<span class="amenity-badge">${a}</span>`)
            .join("")
        : "";

    // Virtual tour button if available
    const virtualTourBtn = p.virtualTour
      ? `<button class="btn-outline btn-small" onclick="showVirtualTour('${p.id}'); return false"><i class="bi bi-play-circle"></i> Tour</button>`
      : "";

    // Brochure download button
    const brochureBtn = p.brochure
      ? `<a href="${p.brochure}" download class="btn-outline btn-small"><i class="bi bi-download"></i> Brochure</a>`
      : "";

    // Format price with currency
    const priceDisplay = formatKsh(p.price);
    const priceLabel = p.category === "sale" ? "/= Total" : "/= Monthly";

    div.innerHTML = `
      <div class="property-image" style="background-image: url('${
        p.image
      }'); background-size: cover; background-position: center; height: 200px; border-radius: 8px 8px 0 0;">
        ${p.featured ? '<div class="featured-badge">Featured</div>' : ""}
        <div class="property-type-badge">${p.type}</div>
      </div>
      
      <div class="property-content">
        <h4 style="margin:0; color:var(--black)">${p.title}</h4>
        
        <div class="property-price" style="font-size:18px; font-weight:700; color:var(--accent); margin:8px 0">
          KSH ${priceDisplay}<span style="font-size:12px; color:var(--muted); font-weight:400">${priceLabel}</span>
        </div>
        
        <div class="property-meta" style="display:flex; gap:16px; color:var(--muted); font-size:13px; margin:12px 0">
          <span><i class="bi bi-geo-alt"></i> ${p.location}</span>
          ${
            p.beds > 0
              ? `<span><i class="bi bi-door-closed"></i> ${p.beds} bed${
                  p.beds !== 1 ? "s" : ""
                }</span>`
              : ""
          }
          ${
            p.baths
              ? `<span><i class="bi bi-droplet"></i> ${p.baths} bath${
                  p.baths !== 1 ? "s" : ""
                }</span>`
              : ""
          }
          ${
            p.sqft
              ? `<span><i class="bi bi-rulers"></i> ${p.sqft} sqft</span>`
              : ""
          }
        </div>
        
        <p class="muted" style="font-size:13px; margin:12px 0; line-height:1.5">${
          p.desc
        }</p>
        
        ${
          amenitiesBadges
            ? `<div class="amenities" style="display:flex; gap:6px; flex-wrap:wrap; margin:12px 0">${amenitiesBadges}</div>`
            : ""
        }
        
        <div class="property-actions" style="display:flex; gap:8px; margin-top:16px; flex-wrap:wrap">
          <button class="btn-primary btn-small" onclick="requestViewing('${
            p.title
          }'); return false">
            Request Viewing
          </button>
          ${virtualTourBtn}
          ${brochureBtn}
          <a href="https://maps.google.com/?q=${encodeURIComponent(
            p.location
          )}" target="_blank" class="btn-outline btn-small">
            <i class="bi bi-map"></i> Map
          </a>
        </div>
        
        <div class="property-contact" style="background:#f9fafb; padding:12px; border-radius:6px; margin-top:12px; font-size:12px; color:var(--muted)">
          <strong style="color:var(--black)">Contact:</strong> 0723544198 | info@estatemasters.co.ke
        </div>
      </div>`;
    grid.appendChild(div);
  });
}

function showVirtualTour(propId) {
  const prop = rawProps.find((p) => p.id == propId);
  if (prop && prop.virtualTour) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        <h3>${prop.title} — Virtual Tour</h3>
        <iframe width="100%" height="500" src="${prop.virtualTour}" frameborder="0" allowfullscreen></iframe>
      </div>`;
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
    document.body.appendChild(modal);
  }
}

function requestViewing(title) {
  alert(
    "Thank you for your interest in " +
      title +
      "! We will contact you soon to arrange a viewing. Please fill out our contact form or call us at 0723544198."
  );
}

function applyFilters() {
  const q = document.getElementById("searchText")?.value?.toLowerCase() || "";
  const type = document.getElementById("filterType")?.value || "";
  const beds = document.getElementById("filterBeds")?.value || "";
  const maxPrice =
    Number(document.getElementById("filterMaxPrice")?.value || 0) || 0;
  const category = getUrlParam("category") || "";

  let list = rawProps.slice();

  // Filter by URL category parameter (rent, sale, featured, commercial)
  if (category) {
    if (category === "rent") {
      list = list.filter((p) => p.category === "rent");
    } else if (category === "sale") {
      list = list.filter((p) => p.category === "sale");
    } else if (category === "featured") {
      list = list.filter((p) => p.featured === true);
    } else if (category === "commercial") {
      list = list.filter((p) => p.type === "Commercial");
    }
  }

  if (q)
    list = list.filter((p) =>
      (p.title + " " + p.location + " " + p.desc).toLowerCase().includes(q)
    );

  if (type) list = list.filter((p) => p.type === type);

  if (beds) {
    if (beds === "3") list = list.filter((p) => p.beds >= 3);
    else list = list.filter((p) => String(p.beds) === beds);
  }

  if (maxPrice > 0) list = list.filter((p) => p.price <= maxPrice);

  renderResults(list);
}

function clearFilters() {
  const ids = ["searchText", "filterType", "filterBeds", "filterMaxPrice"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  applyFilters();
}

// ----------------------------
// ACTIVE NAV HIGHLIGHT
// ----------------------------
function setActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// ----------------------------
// ON PAGE LOAD
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderFeatured();
  applyFilters();
  setActiveNav();
  initMobileMenu();
  initMobileDropdown();

  const applyBtn = document.getElementById("applyFilters");
  const clearBtn = document.getElementById("clearFilters");
  const searchInput = document.getElementById("searchText");

  if (applyBtn) applyBtn.addEventListener("click", applyFilters);
  if (clearBtn) clearBtn.addEventListener("click", clearFilters);

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") applyFilters();
    });
  }

  // Real-time filter change
  document
    .querySelectorAll("#filterType, #filterBeds, #filterMaxPrice")
    .forEach((input) => input.addEventListener("change", applyFilters));
});
