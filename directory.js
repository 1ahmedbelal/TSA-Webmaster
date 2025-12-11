// directory.js
// Handles search + filter logic and renders resource cards

const listEl = document.getElementById("resourceList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const costFilter = document.getElementById("costFilter");
const audienceFilter = document.getElementById("audienceFilter");
const resultsCount = document.getElementById("resultsCount");

function normalize(str) {
  return (str || "").toLowerCase();
}

function resourceMatchesFilters(resource) {
  const searchTerm = normalize(searchInput.value);

  // Search filter
  const searchable =
    resource.name +
    " " +
    resource.description +
    " " +
    (resource.tags || []).join(" ");
  const matchesSearch = searchable.toLowerCase().includes(searchTerm);

  // Category filter
  const categoryVal = categoryFilter.value;
  const matchesCategory =
    categoryVal === "all" || resource.category === categoryVal;

  // Cost filter
  const costVal = costFilter.value;
  const matchesCost = costVal === "all" || resource.cost === costVal;

  // Audience filter
  const audienceVal = audienceFilter.value;
  const matchesAudience =
    audienceVal === "all" ||
    (resource.audience && resource.audience.includes(audienceVal));

  return matchesSearch && matchesCategory && matchesCost && matchesAudience;
}

function renderResources() {
  listEl.innerHTML = "";

  const filtered = RESOURCES.filter(resourceMatchesFilters);

  if (resultsCount) {
    resultsCount.textContent =
      filtered.length === 1
        ? "1 resource found"
        : `${filtered.length} resources found`;
  }

  if (!filtered.length) {
    listEl.innerHTML =
      '<p class="muted">No resources match your search. Try clearing some filters.</p>';
    return;
  }

  filtered.forEach((resource) => {
    const card = document.createElement("article");
    card.className = "card resource-card";
    card.id = resource.id;

    card.innerHTML = `
      <h3>${resource.name}</h3>
      <p class="chip-row">
        <span class="chip">${resource.category}</span>
        <span class="chip">${resource.cost}</span>
      </p>
      <p>${resource.description}</p>
      <ul class="card-details">
        <li><strong>Serves:</strong> ${resource.audience.join(", ")}</li>
        <li><strong>Area:</strong> ${resource.neighborhood}</li>
        <li><strong>Address:</strong> ${resource.address}</li>
        <li><strong>Phone:</strong> ${resource.phone}</li>
      </ul>
      <div class="card-actions">
        ${
          resource.website && resource.website !== "#"
            ? `<a href="${resource.website}" class="btn small" target="_blank" rel="noopener">Visit website</a>`
            : `<span class="muted">Website not available</span>`
        }
      </div>
    `;

    listEl.appendChild(card);
  });
}

// Event listeners
[searchInput, categoryFilter, costFilter, audienceFilter].forEach((el) => {
  if (el) {
    el.addEventListener("input", renderResources);
    el.addEventListener("change", renderResources);
  }
});

// Initial render on page load
document.addEventListener("DOMContentLoaded", renderResources);
