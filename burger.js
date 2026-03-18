document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger");
  const nav = document.getElementById("navLinks");

  burger.addEventListener("click", () => {
    nav.classList.toggle("active");
    console.log("Burger klikket!"); // tjek i console
  });
});
