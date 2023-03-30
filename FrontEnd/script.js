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
