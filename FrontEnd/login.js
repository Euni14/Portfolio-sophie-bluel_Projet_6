//Authentification de l’utilisateur
document.getElementById("submit").addEventListener("click", function (e) {
  e.preventDefault(); // évenement par défaut du boutton (se connecter) non appliquer
  authentication();
});

async function authentication() {
  let username = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  document.getElementById("errormessage").innerText = "";
  document.getElementById("errormessage").style.display = "none";
  let user = {
    email: username,
    password: password,
  };

  let response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  });

  if (response.ok) {
    let result = await response.json();
    localStorage.setItem("SessionToken", result.token); //stockage du token d'authentification
    document.location.href = "index.html";
  } else if (response.status == 401) {
    document.getElementById("errormessage").style.display = "block";
    document.getElementById("errormessage").innerText =
      "mot de passe incorrect";
  } else if (response.status == 404) {
    document.getElementById("errormessage").style.display = "block";
    document.getElementById("errormessage").innerText =
      "utilisateur introuvable";
  } else {
    document.getElementById("errormessage").style.display = "block";
    document.getElementById("errormessage").innerText =
      "Mauvaise réponse du réseau";
  }
}
