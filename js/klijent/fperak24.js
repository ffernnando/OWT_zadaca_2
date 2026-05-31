window.addEventListener("load", pripremiNavigaciju);
window.addEventListener("load", pripremiTablicuLokaliteta);

// --------------------------------- Padajući izbornik --------------------------------- 
function pripremiNavigaciju() {
  pripremiDropdownLokaliteta();
  oznaciAktivnuPoveznicu();
}

function pripremiDropdownLokaliteta() {
  let dropdown = document.getElementById("lokaliteti_padajuci");
  let podizbornik = document.getElementById("lokaliteti_podizbornik");

  if (dropdown !== null && podizbornik !== null) {
    dropdown.addEventListener("mouseover", prikaziPodizbornik);
    dropdown.addEventListener("mouseout", sakrijPodizbornik);
  }
}

function prikaziPodizbornik() {
  let podizbornik = document.getElementById("lokaliteti_podizbornik");

  if (podizbornik !== null) {
    podizbornik.style.display = "block";
  }
}

function sakrijPodizbornik() {
  let podizbornik = document.getElementById("lokaliteti_podizbornik");

  if (podizbornik !== null) {
    podizbornik.style.display = "none";
  }
}

// --------------------------------- Označavanje aktivne poveznice --------------------------------- 
function oznaciAktivnuPoveznicu() {
  let putanja = window.location.pathname;

  if (putanja === "/" || putanja === "/index") {
    oznaciGumb("pocetna_gumb");
  } else if (putanja === "/lokaliteti") {
    oznaciGumb("lokaliteti_gumb");
  } else if (putanja === "/opcinaMarusevec") {
    oznaciGumb("lokaliteti_gumb");
    oznaciGumb("marusevec_gumb");
  } else if (putanja === "/opcinaVinica") {
    oznaciGumb("lokaliteti_gumb");
    oznaciGumb("vinica_gumb");
  } else if (putanja === "/noviMarof") {
    oznaciGumb("lokaliteti_gumb");
    oznaciGumb("novi_marof_gumb");
  } else if (putanja === "/obrValidacija") {
    oznaciGumb("prijedlozi_gumb");
  } else if (putanja.indexOf("/pregled") === 0) {
    oznaciGumb("pregled_gumb");
  } else if (putanja.indexOf("/api/zapisi") === 0) {
    oznaciGumb("api_gumb");
  } else if (putanja === "/dokumentacija") {
    oznaciGumb("dokumentacija_gumb");
  }
};

function oznaciGumb(idGumba) {
  let gumb = document.getElementById(idGumba);

  if (gumb !== null) {
    gumb.style.backgroundColor = "#5A3A2A";
    gumb.style.color = "#E4CDA5";
    gumb.style.fontWeight = "bold";
    gumb.style.borderBottom = "2px solid #E4CDA5";
  }
};

// --------------------------------- Interaktivna tablica (pretraživanje i filtriranje - /lokaliteti) --------------------------------- 
let prikazaniLokaliteti = new Array();
let sviLokaliteti = [
  {
    naziv: "Kurija Čalinec",
    poveznica: "/opcinaMarusevec#kurija_calinec",
    podrucje: "Čalinec",
    karta: "https://maps.app.goo.gl/V1aYp53mnCNQwxpm7",
    vrsta: "Kurija",
    razdoblje: "17. stoljeće",
    stanje: "Naseljeno"
  },
  {
    naziv: "Dvorac Maruševec",
    poveznica: "/opcinaMarusevec#dvorac_marusevec",
    podrucje: "Maruševec",
    karta: "https://maps.app.goo.gl/e4A4x4BRERJNU2An8",
    vrsta: "Dvorac",
    razdoblje: "16. stoljeće",
    stanje: "Održavano"
  },
  {
    naziv: "Bajnski dvori",
    poveznica: "/opcinaVinica#bajnski_dvori",
    podrucje: "Gornje Ladanje",
    karta: "https://maps.app.goo.gl/PFdmUgcEg6C6JM7x6",
    vrsta: "Dvorac",
    razdoblje: "17. stoljeće",
    stanje: "Derutno"
  },
  {
    naziv: "Stari grad Vinica",
    poveznica: "/opcinaVinica#stari_grad_vinica",
    podrucje: "Vinica",
    karta: "https://maps.app.goo.gl/ud2izvx6SJu47ane6",
    vrsta: "Utvrda",
    razdoblje: "12. stoljeće",
    stanje: "Ruševina"
  },
  {
    naziv: "Dvorac Opeka",
    poveznica: "/opcinaVinica#dvorac_opeka",
    podrucje: "Marčan",
    karta: "https://maps.app.goo.gl/NGLiYTAutrZa1SSR9",
    vrsta: "Dvorac",
    razdoblje: "18. stoljeće",
    stanje: "Nedavno obnovljeno"
  },
  {
    naziv: "Pusta Bela",
    poveznica: "/noviMarof",
    podrucje: "Bela",
    karta: "https://maps.app.goo.gl/VZ4MBVwkC6YBSzkw5",
    vrsta: "Utvrda",
    razdoblje: "12. stoljeće",
    stanje: "Ruševina"
  },
  {
    naziv: "Dvorac Bela I",
    poveznica: "/noviMarof",
    podrucje: "Bela",
    karta: "https://maps.app.goo.gl/8pW6hzuUYb8drTNZ6",
    vrsta: "Dvorac",
    razdoblje: "16. stoljeće",
    stanje: "Derutno"
  },
  {
    naziv: "Dvorac Bela II",
    poveznica: "/noviMarof",
    podrucje: "Bela",
    karta: "https://maps.app.goo.gl/6KD5oUsugDT6SENx9",
    vrsta: "Dvorac",
    razdoblje: "17. stoljeće",
    stanje: "Dobro"
  }
];

let filteri = new Array();

function pripremiTablicuLokaliteta() {
  let tablica = document.getElementById("tablica_lokaliteta");

  if (tablica !== null) {
    pripremiPretrazivanje();
    pripremiFiltere();
    prikazaniLokaliteti = sviLokaliteti;
  }
}


function pripremiPretrazivanje() {
  let gumbPretrazivanje = document.getElementById("gumb_pretrazivanje");

  if (gumbPretrazivanje !== null) {
    gumbPretrazivanje.addEventListener("click", primijeniPretraguIFiltre);
  }
}

function primijeniPretraguIFiltre() {
  let textPretrazivanje = document.getElementById("text_pretrazivanje");
  let pojamPretrazivanja = "";

  if (textPretrazivanje !== null) {
    pojamPretrazivanja = textPretrazivanje.value.toLowerCase();
  }

  filteri = dohvatiOdabraneFiltere();

  let rezultat = new Array();

  for (let lokalitet of sviLokaliteti) {
    let prolazno = true;

    if (pojamPretrazivanja !== "") {
      if (
        lokalitet.naziv.toLowerCase().indexOf(pojamPretrazivanja) === -1 &&
        lokalitet.podrucje.toLowerCase().indexOf(pojamPretrazivanja) === -1 &&
        lokalitet.vrsta.toLowerCase().indexOf(pojamPretrazivanja) === -1 &&
        lokalitet.razdoblje.toLowerCase().indexOf(pojamPretrazivanja) === -1 &&
        lokalitet.stanje.toLowerCase().indexOf(pojamPretrazivanja) === -1
      ) {
        prolazno = false;
      }
    }

    if (filteri.length > 0) {
      let prolaziFiltere = false;

      for (let filter of filteri) {
        if (lokalitet.vrsta.toLowerCase() === filter.toLowerCase()) {
          prolaziFiltere = true;
        }
      }

      if (prolaziFiltere === false) {
        prolazno = false;
      }
    }

    if (prolazno === true) {
      rezultat.push(lokalitet);
    }
  }

  prikazaniLokaliteti = rezultat;
  iscrtajTablicuLokaliteta(prikazaniLokaliteti);
}


function iscrtajTablicuLokaliteta(lokaliteti) {
  let tijeloTablice = document.getElementById("tijelo_tablice_lokaliteti");

  if (tijeloTablice !== null) {
    let html = "";
    if (lokaliteti.length === 0) {
      html += "<tr>" +
        "<td colspan='5'>Nema lokaliteta za prikaz</td>" +
        "</tr>";
    } else {
      for (let lokalitet of lokaliteti) {
        html += "<tr>" +
          "<td><a href='" + lokalitet.poveznica + "'>" + lokalitet.naziv + "</a></td>" +
          "<td><a href='" + lokalitet.karta + "' target='_blank'>" + lokalitet.podrucje + "</a></td>" +
          "<td>" + lokalitet.vrsta + "</td>" +
          "<td>" + lokalitet.razdoblje + "</td>" +
          "<td>" + lokalitet.stanje + "</td>" +
          "</tr>";
      }
    }
    tijeloTablice.innerHTML = html;
  }

}

function pripremiFiltere() {
  let gumbFilteri = document.getElementById("gumb_filteri");
  let mogucnostiFiltriranja = document.getElementById("grupa_filteri");

  let mogucnostiPrikazane = false;

  if (gumbFilteri !== null && mogucnostiFiltriranja !== null) {
    gumbFilteri.addEventListener("click", function () {
      if (mogucnostiPrikazane === false) {
        mogucnostiFiltriranja.style.display = "block";
        gumbFilteri.textContent = "Sakrij mogućnosti filtriranja";
        mogucnostiPrikazane = true;
      } else {
        mogucnostiFiltriranja.style.display = "none";
        gumbFilteri.textContent = "Prikaži mogućnosti filtriranja";
        mogucnostiPrikazane = false;
      }
    });
  }
}

function dohvatiOdabraneFiltere() {
  let odabraniFilteri = new Array();
  let checkboxovi = document.getElementsByName("filter_vrsta_lokaliteta");

  for (let i = 0; i < checkboxovi.length; i++) {
    if (checkboxovi[i].checked === true) {
      odabraniFilteri.push(checkboxovi[i].value);
    }
  }

  return odabraniFilteri;
}