const USERS_ENDPOINT = "https://dummyjson.com/users?limit=30";

const SELECTED_IDS = [1, 3, 15, 25, 26, 27, 29];
const TOP_SELECTOR_IDS = [29, 27, 25, 1, 3];

const LOCAL_IMAGES = {
  1: "images/image1.webp",
  3: "images/image3.webp",
  15: "images/image15.webp",
  25: "images/image25.webp",
  26: "images/image26.webp",
  27: "images/image27.webp",
  29: "images/image29.webp",
};

const TALENT_TYPES = {
  1: ["Creator", "Model"],
  3: ["Actor"],
  15: ["Model"],
  25: ["Model"],
  26: ["Model"],
  27: ["Influencer", "Creator"],
  29: ["Model"],
};

const listEl = document.querySelector("#creatorGrid");
const topSelectorsEl = document.querySelector("#topSelectorsGrid");

const toggleFiltersBtn = document.querySelector("#toggleFilters");
const filterOverlay = document.querySelector("#filterOverlay");
const closeFilterBtn = document.querySelector("#closeFilterBtn");
const filterForm = document.querySelector("#filterForm");
const clearFiltersBtn = document.querySelector("#clearFiltersBtn");

const ageRange = document.querySelector("#ageRange");
const ageValue = document.querySelector("#ageValue");

const heightRange = document.querySelector("#heightRange");
const heightValue = document.querySelector("#heightValue");

const hairColorSelect = document.querySelector("#hairColorSelect");
const eyeColorSelect = document.querySelector("#eyeColorSelect");
const hairTypeSelect = document.querySelector("#hairTypeSelect");
const weightSelect = document.querySelector("#weightSelect");
const locationInput = document.querySelector("#locationInput");

let allData = [];
let filteredData = [];

init();

function init() {
  bindEvents();
  closeFilters();
  getData();
}

function bindEvents() {
  toggleFiltersBtn?.addEventListener("click", toggleFilters);
  closeFilterBtn?.addEventListener("click", closeFilters);
  clearFiltersBtn?.addEventListener("click", clearFilters);

  filterForm?.addEventListener("submit", onSubmitFilters);

  filterOverlay?.addEventListener("click", (e) => {
    if (e.target === filterOverlay) closeFilters();
  });

  ageRange?.addEventListener("input", updateAgeValue);
  heightRange?.addEventListener("input", updateHeightValue);
}

function setExpanded(btn, isOpen) {
  btn?.setAttribute("aria-expanded", String(isOpen));
}

function openFilters() {
  if (!filterOverlay) return;

  filterOverlay.classList.add("active");
  filterOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setExpanded(toggleFiltersBtn, true);
}

function closeFilters() {
  if (!filterOverlay) return;

  filterOverlay.classList.remove("active");
  filterOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  setExpanded(toggleFiltersBtn, false);
}

function toggleFilters(e) {
  e?.stopPropagation();

  const willOpen = !filterOverlay.classList.contains("active");

  if (willOpen) {
    openFilters();
  } else {
    closeFilters();
  }
}

function updateAgeValue() {
  if (!ageRange || !ageValue) return;
  ageValue.textContent = ageRange.value;
}

function updateHeightValue() {
  if (!heightRange || !heightValue) return;
  heightValue.textContent = `${heightRange.value} cm`;
}

function onSubmitFilters(e) {
  e.preventDefault();
  render();
  closeFilters();
}

async function getData() {
  try {
    const res = await fetch(USERS_ENDPOINT);
    const data = await res.json();

    allData = (data.users ?? [])
      .filter((user) => SELECTED_IDS.includes(user.id))
      .map(normalizeCreator);

    filteredData = [...allData];

    fillFilterOptions(allData);
    renderTopSelectors(allData);
    render();
  } catch (err) {
    console.error(err);
    listEl.innerHTML = `<div class="empty-state">Could not load creators right now.</div>`;
  }
}

function normalizeCreator(user) {
  return {
    ...user,
    localImage: LOCAL_IMAGES[user.id] || user.image,
    talentTypes: TALENT_TYPES[user.id] || ["Model"],
  };
}

function render() {
  const filtered = getFilteredCreators();
  filteredData = filtered;
  showCreators(filteredData);
}

function getFilteredCreators() {
  const selectedTypes = getCheckedValues("type");
  const selectedGenders = getCheckedValues("gender");

  const maxAge = Number(ageRange?.value ?? 60);
  const maxHeight = Number(heightRange?.value ?? 210);
  const maxWeight = weightSelect?.value ? Number(weightSelect.value) : null;

  const selectedHairColor = (hairColorSelect?.value ?? "").trim().toLowerCase();
  const selectedEyeColor = (eyeColorSelect?.value ?? "").trim().toLowerCase();
  const selectedHairType = (hairTypeSelect?.value ?? "").trim().toLowerCase();
  const locationSearch = (locationInput?.value ?? "").trim().toLowerCase();

  return allData.filter((creator) => {
    const creatorTypes = (creator.talentTypes ?? []).map((type) =>
      type.toLowerCase(),
    );

    const creatorGender = (creator.gender ?? "").toLowerCase();
    const creatorHairColor = (creator.hair?.color ?? "").toLowerCase();
    const creatorEyeColor = (creator.eyeColor ?? "").toLowerCase();
    const creatorHairType = (creator.hair?.type ?? "").toLowerCase();
    const creatorCity = (creator.address?.city ?? "").toLowerCase();

    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.some((type) => creatorTypes.includes(type));

    const matchesGender =
      selectedGenders.length === 0 || selectedGenders.includes(creatorGender);

    const matchesAge = creator.age <= maxAge;
    const matchesHeight = creator.height <= maxHeight;
    const matchesWeight = maxWeight === null || creator.weight <= maxWeight;

    const matchesHairColor =
      !selectedHairColor || creatorHairColor.includes(selectedHairColor);

    const matchesEyeColor =
      !selectedEyeColor || creatorEyeColor.includes(selectedEyeColor);

    const matchesHairType =
      !selectedHairType || creatorHairType.includes(selectedHairType);

    const matchesLocation =
      !locationSearch || creatorCity.includes(locationSearch);

    return (
      matchesType &&
      matchesGender &&
      matchesAge &&
      matchesHeight &&
      matchesWeight &&
      matchesHairColor &&
      matchesEyeColor &&
      matchesHairType &&
      matchesLocation
    );
  });
}

function showCreators(creators) {
  if (!listEl) return;

  if (!creators.length) {
    listEl.innerHTML = `
      <div class="empty-state">
        No creators match your filters.
      </div>
    `;
    return;
  }

  listEl.innerHTML = creators.map(renderCreatorCard).join("");
}

function renderCreatorCard(creator) {
  const fullName = creatorFullName(creator);
  const typeLabel = formatTypeLabel(creator.talentTypes);

  return `
    <article class="creator-card" data-id="${creator.id}">
      <img
        src="${creator.localImage}"
        alt="${escapeHtml(fullName)}"
        loading="lazy"
      />

      <div class="card-overlay">
        <h3 class="card-name">${escapeHtml(fullName)}</h3>
        <p class="card-type">${escapeHtml(typeLabel)}</p>
      </div>
    </article>
  `;
}

function renderTopSelectors(creators) {
  if (!topSelectorsEl) return;

  const items = TOP_SELECTOR_IDS.map((id) =>
    creators.find((creator) => creator.id === id),
  ).filter(Boolean);

  topSelectorsEl.innerHTML = items.map(renderTopSelectorCard).join("");
}

function renderTopSelectorCard(creator) {
  const fullName = creatorFullName(creator);

  return `
    <article class="top-card" data-id="${creator.id}">
      <img
        src="${creator.localImage}"
        alt="${escapeHtml(fullName)}"
        loading="lazy"
      />
    </article>
  `;
}

function fillFilterOptions(creators) {
  fillSelect(
    hairColorSelect,
    uniqueValues(creators.map((creator) => creator.hair?.color)),
    "Hair Color",
  );

  fillSelect(
    eyeColorSelect,
    uniqueValues(creators.map((creator) => creator.eyeColor)),
    "Eye Color",
  );

  fillSelect(
    hairTypeSelect,
    uniqueValues(creators.map((creator) => creator.hair?.type)),
    "Hair Type",
  );
}

function fillSelect(selectEl, values, placeholder) {
  if (!selectEl) return;

  selectEl.innerHTML = `<option value="">${placeholder}</option>`;

  values.forEach((value) => {
    selectEl.insertAdjacentHTML(
      "beforeend",
      `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`,
    );
  });
}

function getCheckedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(
    (input) => input.value.toLowerCase(),
  );
}

function clearFilters() {
  filterForm?.reset();

  if (ageRange) ageRange.value = 60;
  if (ageValue) ageValue.textContent = "60";

  if (heightRange) heightRange.value = 210;
  if (heightValue) heightValue.textContent = "210 cm";

  if (hairColorSelect) hairColorSelect.value = "";
  if (eyeColorSelect) eyeColorSelect.value = "";
  if (hairTypeSelect) hairTypeSelect.value = "";
  if (weightSelect) weightSelect.value = "";
  if (locationInput) locationInput.value = "";

  render();
}

function creatorFullName(creator) {
  return [creator.firstName, creator.lastName, creator.maidenName]
    .filter(Boolean)
    .join(" ");
}

function formatTypeLabel(types = []) {
  if (!types.length) return "Model";
  return types.join(" and ");
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b)),
  );
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
