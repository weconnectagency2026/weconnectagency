const params = new URLSearchParams(window.location.search);
const userId = params.get("id") || "1";

/* IMAGES */

const PROFILE_IMAGES = {
  1: {
    hero: "images/image1.webp",
    portrait: "images/image1.2.webp",
    wide: "images/image1.3.webp",
    street: "images/image1.4.webp",
    closeup: "images/image1.5.webp",
  },
  3: {
    hero: "images/image3.webp",
    portrait: "images/image3.webp",
    wide: "images/image3.webp",
    street: "images/image3.webp",
    closeup: "images/image3.webp",
  },
  15: {
    hero: "images/image15.webp",
    portrait: "images/image15.webp",
    wide: "images/image15.webp",
    street: "images/image15.webp",
    closeup: "images/image15.webp",
  },
  25: {
    hero: "images/image25.webp",
    portrait: "images/image25.webp",
    wide: "images/image25.webp",
    street: "images/image25.webp",
    closeup: "images/image25.webp",
  },
  26: {
    hero: "images/image26.webp",
    portrait: "images/image26.webp",
    wide: "images/image26.webp",
    street: "images/image26.webp",
    closeup: "images/image26.webp",
  },
  27: {
    hero: "images/image27.webp",
    portrait: "images/image27.webp",
    wide: "images/image27.webp",
    street: "images/image27.webp",
    closeup: "images/image27.webp",
  },
  29: {
    hero: "images/image29.webp",
    portrait: "images/image29.webp",
    wide: "images/image29.webp",
    street: "images/image29.webp",
    closeup: "images/image29.webp",
  },
};

/* ABOUT TEXT  */

const ABOUT_TEXT = {
  1: "works as a creator and model focusing on fashion, lifestyle and brand collaborations. Known for natural presence and versatility in front of the camera.",
  3: "is an experienced actor with a background in film and commercial productions. Known for expressive performances and a strong on-screen presence.",
  15: "is a professional fashion model working with commercial campaigns and editorial photography. His confident look makes him ideal for menswear brands.",
  25: "is a fashion model with experience in international campaigns, studio shoots and runway productions.",
  26: "works across modeling and creative production, contributing to fashion campaigns and digital content creation.",
  27: "is an influencer and digital creator working with lifestyle and fashion brands through social media campaigns.",
  29: "is a professional model experienced in commercial advertising and editorial fashion productions.",
};

/* FETCH USER  */

fetch("https://dummyjson.com/users/" + userId)
  .then((response) => response.json())
  .then((user) => {
    /* NAME */

    let fullName = user.firstName + " " + user.lastName;

    if (user.maidenName) {
      fullName += " " + user.maidenName;
    }

    document.getElementById("name").textContent = fullName;
    document.getElementById("breadcrumb-name").textContent = fullName;

    /* DETAILS */

    document.getElementById("age").textContent = user.age + " year";
    document.getElementById("gender").textContent = user.gender;
    document.getElementById("height").textContent = user.height + " cm";
    document.getElementById("weight").textContent = user.weight + " kg";
    document.getElementById("eyeColor").textContent = user.eyeColor;
    document.getElementById("hairColor").textContent = user.hair.color;
    document.getElementById("hairType").textContent = user.hair.type;

    /* LOCATION */

    document.getElementById("city").textContent = user.address.city;
    document.getElementById("state").textContent = user.address.state;
    document.getElementById("country").textContent = user.address.country;

    /* EXPERIENCE */

    document.getElementById("university").textContent = user.university;
    document.getElementById("position").textContent = user.company.title;
    document.getElementById("department").textContent = user.company.department;
    document.getElementById("company").textContent = user.company.name;

    /* CONTACT */

    document.getElementById("email").textContent = user.email;
    document.getElementById("phone").textContent = user.phone;

    /* PRONOUNS */

    let pronoun = "They";

    if (user.gender === "male") pronoun = "He";
    if (user.gender === "female") pronoun = "She";

    /* ABOUT TEXT */

    const about =
      ABOUT_TEXT[userId] ||
      "is a professional creator working across fashion and commercial productions.";

    document.getElementById("aboutText").textContent =
      fullName +
      " " +
      about +
      " " +
      pronoun +
      " has also worked on professional productions and commercial campaigns.";

    /* IMAGES */

    const images = PROFILE_IMAGES[userId];

    if (images) {
      const fallback = images.hero;

      document.querySelector(".hero-image img").src = images.hero || fallback;
      document.querySelector(".side-portrait img").src =
        images.portrait || fallback;
      document.querySelector(".wide-image img").src = images.wide || fallback;
      document.querySelector(".street-image img").src =
        images.street || fallback;
      document.querySelector(".closeup-image img").src =
        images.closeup || fallback;
    }
  })
  .catch((error) => {
    console.log("Der skete en fejl:", error);
  });
