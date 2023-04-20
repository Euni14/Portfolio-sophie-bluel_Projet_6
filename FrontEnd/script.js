// Redirection de l'user vers les pages adapter
//Changement de text login logout
// Gerer l'apparition de la bande noire
const linkLogin = document.getElementById("link-login");
const strip = document.getElementById("strip");
const stripImg = document.getElementById("strip-img");
const stripUser = document.getElementById("strip-user");
const striProject = document.getElementById("strip-project");
const categoryFilter = document.querySelector("#filter");

linkLogin.addEventListener("click", () => {
  let verificationToken = localStorage.getItem("SessionToken");
  if (verificationToken === null || verificationToken === "") {
    document.location.href = "login.html";
  } /* deconnexion*/ else {
    localStorage.setItem("SessionToken", "");
    linkLogin.innerText = "Login";
    stripImg.classList.add("displaynone");
    stripUser.classList.add("displaynone");
    striProject.classList.add("displaynone");
    strip.classList.add("displaynone");
    categoryFilter.classList.remove("visibilityhidden");
  }
});
// au chargement de la page index verification de l'autenthification
let verificationToken = localStorage.getItem("SessionToken");
if (verificationToken === null || verificationToken === "") {
  stripImg.classList.add("displaynone"); //mode tout utilisateur
  stripUser.classList.add("displaynone");
  striProject.classList.add("displaynone");
  strip.classList.add("displaynone");
  categoryFilter.classList.remove("visibilityhidden");
  linkLogin.innerText = "Login";
} else {
  //mode autenthifiée
  linkLogin.innerText = "Logout";
  strip.classList.remove("displaynone");
  stripImg.classList.remove("displaynone");
  stripUser.classList.remove("displaynone");
  striProject.classList.remove("displaynone");
  categoryFilter.classList.add("visibilityhidden");
}

// Récuperation API projets de l’architecte
const reponses = await fetch("http://localhost:5678/api/works");
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
for (const jsonCategory of jsonCategories) {
  const buttonElement = document.createElement("button");
  buttonElement.innerText = jsonCategory.name;
  buttonElement.id = jsonCategory.id;
  buttonElement.classList.add("category");
  categoryFilter.appendChild(buttonElement);
}

//ajout de l'évenement au clic
const filterChidren = document.querySelector("#filter").children;
for (let filterChild of filterChidren) {
  let buttonId = filterChild.id;
  filterChild.addEventListener("click", () => filterWork(buttonId));
}

async function filterWork(buttonId) {
  let worksFilters = await fetch("http://localhost:5678/api/works");
  let workFilter = await worksFilters.json();
  // verification et filtré
  let filteredData =
    buttonId === "0"
      ? workFilter
      : workFilter.filter((work) => work.categoryId == buttonId);
  // style des boutons au moments du click
  for (let buttoncategory of filterChidren) {
    if (buttoncategory.id == buttonId) {
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

// boite modale
const pagemodal = document.getElementById("pagemodal");
const CloseIcon = document.getElementById("close");

//comportement quand on click sur le lien modifier
striProject.onclick = async () => {
  pagemodal.style.display = "block";
  let pagemodalreponses = await fetch("http://localhost:5678/api/works");
  let pagemodalworks = await pagemodalreponses.json();
  // le contenu du modale
  let pagemodalgallery = document.querySelector("#modal-content-gallery");
  pagemodalgallery.replaceChildren();
  for (let work of pagemodalworks) {
    let figureElement = document.createElement("figure");

    let imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;

    let figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = "éditer";

    let iconsElement = document.createElement("div");
    iconsElement.classList.add("modal-content-gallery-img-icons");

    let trashElement = document.createElement("i");
    trashElement.classList.add("fa");
    trashElement.classList.add("fa-trash-can");
    trashElement.classList.add("modalimageicon");

    trashElement.addEventListener("click", () => {
      deletework(work.id);
    });

    let expandElement = document.createElement("i");
    expandElement.classList.add("fa");
    expandElement.classList.add("fa-arrows-up-down-left-right");
    expandElement.classList.add("modalimageicon");
    expandElement.classList.add("displaynone");

    iconsElement.appendChild(expandElement);
    iconsElement.appendChild(trashElement);
    figureElement.appendChild(iconsElement);
    figureElement.appendChild(imgElement);

    figureElement.appendChild(figcaptionElement);
    pagemodalgallery.appendChild(figureElement);
  }
};

// fermeture du modale avec le bouton X
CloseIcon.addEventListener("click", function () {
  pagemodal.style.display = "none";
});
// un click en dehors de la fenêtre modale le ferme
document.addEventListener("click", function (event) {
  if (event.target == pagemodal) {
    pagemodal.style.display = "none";
  }
});
//suppression d'1 avec l'icon projet
async function deletework(workid) {
  await fetch("http://localhost:5678/api/works/" + workid, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("SessionToken")}`,
    },
  });
  // affichage apres suppression
  let pagemodalreponses = await fetch("http://localhost:5678/api/works");
  let pagemodalworks = await pagemodalreponses.json();

  let pagemodalgallery = document.querySelector("#modal-content-gallery");
  pagemodalgallery.replaceChildren();
  for (let work of pagemodalworks) {
    let figureElement = document.createElement("figure");

    let imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;

    let figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = "éditer";

    let iconsElement = document.createElement("div");
    iconsElement.classList.add("modal-content-gallery-img-icons");

    let trashElement = document.createElement("i");
    trashElement.classList.add("fa");
    trashElement.classList.add("fa-trash-can");
    trashElement.classList.add("modalimageicon");

    trashElement.addEventListener("click", () => {
      deletework(work.id);
    });

    let expandElement = document.createElement("i");
    expandElement.classList.add("fa");
    expandElement.classList.add("fa-arrows-up-down-left-right");
    expandElement.classList.add("modalimageicon");
    expandElement.classList.add("displaynone");

    iconsElement.appendChild(expandElement);
    iconsElement.appendChild(trashElement);
    figureElement.appendChild(iconsElement);
    figureElement.appendChild(imgElement);

    figureElement.appendChild(figcaptionElement);
    pagemodalgallery.appendChild(figureElement);
  }
}
// supprimmer tous les projets
const deleteall = document.getElementById("deleteall");
deleteall.addEventListener("click", () => {
  deleteallworks();
});

async function deleteallworks() {
  let workreponses = await fetch("http://localhost:5678/api/works");
  let works = await workreponses.json();
  for (let work of works) {
    let deleteresponse = await fetch(
      "http://localhost:5678/api/works/" + work.id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("SessionToken")}`,
        },
      }
    );
  }
  //on efface le contenu
  let pagemodalgallery = document.querySelector("#modal-content-gallery");
  pagemodalgallery.replaceChildren();
}

const addphoto = document.getElementById("addphoto");
const leftarrow = document.getElementById("left");
addphoto.addEventListener("click", async () => {
  let modalcontenttwo = document.getElementById("modal-content-two");
  let modalcontentone = document.getElementById("modal-content-one");
  modalcontenttwo.classList.remove("displaynone"); //affiche le modale 2
  leftarrow.classList.remove("visibilityhidden");
  modalcontentone.classList.add("displaynone");

  let modalcategoriesselection = document.getElementById(
    "modal-categories-selection"
  );
  let reponseCategories = await fetch("http://localhost:5678/api/categories");
  let jsonCategories = await reponseCategories.json();
  modalcategoriesselection.replaceChildren();
  let optdefault = document.createElement("option");
  optdefault.value = "";
  optdefault.innerHTML = "";
  modalcategoriesselection.appendChild(optdefault);
  for (let jsonCategory of jsonCategories) {
    let opt = document.createElement("option");
    opt.value = jsonCategory.id;
    opt.innerHTML = jsonCategory.name;
    modalcategoriesselection.appendChild(opt);
  }
});
//bouton retour
left.addEventListener("click", () => {
  let modalcontenttwo = document.getElementById("modal-content-two");
  let modalcontentone = document.getElementById("modal-content-one");
  modalcontenttwo.classList.add("displaynone");
  leftarrow.classList.add("visibilityhidden");
  modalcontentone.classList.remove("displaynone");
});
// bouton ajouter photo dans modale 2
const inputfile = document.getElementById("file-image-input");
const imgadded = document.getElementById("image-added");
inputfile.addEventListener("change", showFileName);
imgadded.addEventListener("click", () => {
  imgadded.classList.remove("image-added-after");
  imgadded.src = "#";
});
function showFileName(event) {
  imgadded.src = URL.createObjectURL(inputfile.files[0]);
  imgadded.classList.add("image-added-after");
}
// ajout de projet dans la galerie
// changement du couleur du bouton valider
document
  .getElementById("file-image-input")
  .addEventListener("change", () => addworkbuttonenabled());
document
  .getElementById("title")
  .addEventListener("change", () => addworkbuttonenabled());
document
  .getElementById("modal-categories-selection")
  .addEventListener("change", () => addworkbuttonenabled());

function addworkbuttonenabled() {
  document.getElementById("error-modal").innerText = "";
  document.getElementById("error-modal").style.display = "none";
  let addworkbutton = document.getElementById("add-work");
  let inputfilevalue = document.getElementById("file-image-input").files[0];
  let inputtitlevalue = document.getElementById("title").value;
  let selectcategoryvalue = document.getElementById(
    "modal-categories-selection"
  ).value;
  if (
    inputfilevalue == undefined ||
    inputtitlevalue == "" ||
    isNaN(selectcategoryvalue) ||
    selectcategoryvalue == 0
  ) {
    addworkbutton.classList.add("button-disabled");
  } else {
    addworkbutton.disabled = false;
    addworkbutton.classList.remove("button-disabled");
  }
}

const addwork = document.getElementById("add-work");
addwork.addEventListener("click", async (event) => {
  event.preventDefault();

  let inputfilevalue = document.getElementById("file-image-input").files[0];
  let inputtitlevalue = document.getElementById("title").value;
  let selectcategoryvalue = document.getElementById(
    "modal-categories-selection"
  ).value;
  document.getElementById("error-modal").innerText = "";
  document.getElementById("error-modal").style.display = "none";
  //verifie l'existance d'un fichier image
  if (inputfilevalue == undefined) {
    document.getElementById("error-modal").style.display = "block";
    document.getElementById("error-modal").innerText =
      "* Veuillez ajouter un fichier \n";
  }
  //test taille de l'image
  if (inputfilevalue != undefined && inputfilevalue.size > 4000000) {
    document.getElementById("error-modal").style.display = "block";
    document.getElementById("error-modal").innerText =
      "* Veuillez respecter la taille du fichier \n";
  }
  //test champ titre
  if (inputtitlevalue == "") {
    document.getElementById("error-modal").style.display = "block";
    document.getElementById("error-modal").innerText =
      document.getElementById("error-modal").innerText +
      "* Veuillez renseigner le titre\n";
  }
  //test categorie
  if (isNaN(selectcategoryvalue) || selectcategoryvalue == 0) {
    document.getElementById("error-modal").style.display = "block";
    document.getElementById("error-modal").innerText =
      document.getElementById("error-modal").innerText +
      "* Veuillez entrer une categorie correcte\n";
  }

  if (
    document.getElementById("error-modal").innerText != "" ||
    addwork.disabled
  ) {
    return;
  }

  let work = {
    image: inputfilevalue,
    title: inputtitlevalue,
    category: parseInt(selectcategoryvalue),
  };
  let bodyform = new FormData();
  bodyform.append("image", inputfilevalue);
  bodyform.append("title", inputtitlevalue);
  bodyform.append("category", parseInt(selectcategoryvalue));
  let response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: bodyform,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("SessionToken")}`,
    },
  });

  if (!response.ok) {
    document.getElementById("error-modal").style.display = "block";
    document.getElementById("error-modal").innerText =
      document.getElementById("error-modal").innerText +
      "- add user with server error\n";
  }

  pagemodal.style.display = "none";
  document.getElementById("modal-content-two").classList.add("displaynone");
  imgadded.classList.remove("image-added-after");
  imgadded.src = "#";
  /* rafraichir */
  let reponses = await fetch("http://localhost:5678/api/works");

  let works = await reponses.json();

  let gallery = document.querySelector("#gallery");
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
});
