const params = new URLSearchParams(window.location.search);
const userId = params.get("id") || "1";

fetch("https://dummyjson.com/users/" + userId)
  .then((response) => response.json())
  .then((user) => {
    // FULL NAME (inkl. maiden name hvis det findes)
    let fullName = user.firstName + " " + user.lastName;

    if (user.maidenName) {
      fullName += " " + user.maidenName;
    }

    document.getElementById("name").textContent = fullName;
    document.getElementById("breadcrumb-name").textContent = fullName;

    // DETAILS
    document.getElementById("age").textContent = user.age + " year";
    document.getElementById("gender").textContent = user.gender;
    document.getElementById("height").textContent = user.height + " cm";
    document.getElementById("weight").textContent = user.weight + " kg";
    document.getElementById("eyeColor").textContent = user.eyeColor;
    document.getElementById("hairColor").textContent = user.hair.color;
    document.getElementById("hairType").textContent = user.hair.type;

    // LOCATION
    document.getElementById("city").textContent = user.address.city;
    document.getElementById("state").textContent = user.address.state;
    document.getElementById("country").textContent = user.address.country;

    // EXPERIENCE
    document.getElementById("university").textContent = user.university;
    document.getElementById("position").textContent = user.company.title;
    document.getElementById("department").textContent = user.company.department;
    document.getElementById("company").textContent = user.company.name;

    // CONTACT
    document.getElementById("email").textContent = user.email;
    document.getElementById("phone").textContent = user.phone;

    // ABOUT TEXT (dynamisk navn)
    document.getElementById("aboutText").textContent =
      fullName +
      " is a professional creator and model with experience in fashion, lifestyle, and commercial campaigns. " +
      "She has also worked as an extra in several major film productions, gaining experience on professional film sets and in front of the camera. " +
      "She is known for her natural presence, versatility, and ability to adapt to different creative concepts.";
  })
  .catch((error) => {
    console.log("Der skete en fejl:", error);
  });
