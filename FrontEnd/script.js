// Récuperation API projets de l’architecte
const reponses = await fetch("http://localhost:5678/api/works");
console.log(reponses);
const works = await reponses.json();
// création des balises
/*let article = works[0];
let figureElement = document.createElement("figure");
let roomElement = document.createElement("img");
roomElement.src = article.imageUrl;
roomElement.alt = article.title;
let figcaptionElement = document.createElement("figcaption");
figcaptionElement.innerText = article.title;*/
//rattachement des balises au DOM
const gallery = document.querySelector("#gallery");
/*gallery.appendChild(figureElement);
gallery.appendChild(roomElement);
gallery.appendChild(figcaptionElement);*/

for (let work of works) {
  let figureElement = document.createElement("figure");
  let roomElement = document.createElement("img");
  roomElement.src = work.imageUrl;
  roomElement.alt = work.title;
  let figcaptionElement = document.createElement("figcaption");
  figcaptionElement.innerText = work.title;

  figureElement.appendChild(roomElement);
  figureElement.appendChild(figcaptionElement);
  gallery.appendChild(figureElement);
}
// : Réalisation du filtre des travaux
// Récupération des donnés du categorie

fetch("http://localhost:5678/api/categories")
  .then(function (response) {
    if (response.ok) {
      response.json().then(function (myJson) {
        let categories = new Set(myJson);
        console.log(myJson);
        let buttonOthers = document.createElement("button");
        buttonOthers.name = 0;
        buttonOthers.innerText = "Others";
        buttonOthers.classList.add("category");
        buttonOthers.classList.add("category_selected");
        filter.appendChild(buttonOthers);
        buttonOthers.addEventListener("click", filterWork);

        for (let category of categories) {
          let button = document.createElement("button");
          button.name = category.id;
          button.innerText = category.name;
          button.classList.add("category");
          filter.appendChild(button);
          button.addEventListener("click", filterWork);
        }
      });
    } else {
      console.log("Mauvaise réponse du réseau");
    }
  })
  .catch(function (error) {
    console.log(
      "Il y a eu un problème avec l'opération fetch : " + error.message
    );
  });

function filterWork(e) {
  fetch("http://localhost:5678/api/works")
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (myJson) {
          let filteredData =
            e.target.name == 0
              ? myJson
              : myJson.filter((model) => model.categoryId == e.target.name);
          gallery.replaceChildren();
          for (let buttoncategory of filter.children) {
            if (buttoncategory.name == e.target.name) {
              buttoncategory.classList.add("category_selected");
            } else {
              buttoncategory.classList.remove("category_selected");
            }
          }

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
        });
      } else {
        console.log("Mauvaise réponse du réseau");
      }
    })
    .catch(function (error) {
      console.log(
        "Il y a eu un problème avec l'opération fetch : " + error.message
      );
    });
}
