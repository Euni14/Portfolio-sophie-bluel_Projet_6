// Redirection de l'user vers les pages adapter
//Changement de text login logout
const linkLogin = document.getElementById("link-login");
linkLogin.addEventListener("click", () => {
  let verificationToken = localStorage.getItem("SessionToken");
  if (verificationToken === null || verificationToken === "") {
    document.location.href = "login.html";
  } else {
    localStorage.setItem("SessionToken", "");
    linkLogin.innerText = "Login";
  }
});
let verificationToken = localStorage.getItem("SessionToken");
console.log(linkLogin);
if (verificationToken === null || verificationToken === "") {
  linkLogin.innerText = "Login";
} else {
  linkLogin.innerText = "Logout";
}

// Récuperation API projets de l’architecte
const reponses = await fetch("http://localhost:5678/api/works");
console.log(reponses);
const works = await reponses.json();

const gallery = document.querySelector("#gallery");
for (let work of works) {
  let figureElement = document.createElement("figure");
  let imgElement = document.createElement("img");
  imgElement.src = work.imageUrl;
  imgElement.alt = work.title;
  let figcaptionElement = document.createElement("figcaption");
  figcaptionElement.innerText = work.title;
  figureElement.appendChild(imgElement);
  figureElement.appendChild(figcaptionElement);
  gallery.appendChild(figureElement);
}

// : Réalisation du filtre des travaux
// Récupération des donnés du categorie
const reponseCategories = await fetch("http://localhost:5678/api/categories");
const jsonCategories = await reponseCategories.json();
const categoryFilter = document.querySelector("#filter");
for (let jsonCategory of jsonCategories) {
  let buttonElement = document.createElement("button");
  buttonElement.innerText = jsonCategory.name;
  buttonElement.id = jsonCategory.id;
  buttonElement.classList.add("category");
  categoryFilter.appendChild(buttonElement);
}

//ajout de l'évenement au clic
const filterChidren = document.querySelector("#filter").children;
for (let filterChild of filterChidren) {
  let categoryId = filterChild.id;
  filterChild.addEventListener("click", () => filterWork(categoryId));
}

async function filterWork(categoryId) {
  let worksFilters = await fetch("http://localhost:5678/api/works");
  let workFilter = await worksFilters.json();

  let filteredData =
    categoryId === "0"
      ? workFilter
      : workFilter.filter((work) => work.categoryId == categoryId);

  for (let buttoncategory of filterChidren) {
    if (buttoncategory.id == categoryId) {
      buttoncategory.classList.add("category_selected");
    } else {
      buttoncategory.classList.remove("category_selected");
    }
  }

  gallery.replaceChildren();

  for (let work of filteredData) {
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    let figcaption = document.createElement("figcaption");
    figcaption.innerText = work.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
}
