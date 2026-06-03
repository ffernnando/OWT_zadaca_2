window.addEventListener("load", pripremiValidacijuObrasca);

function pripremiValidacijuObrasca() {
  let obrazac = document.getElementById("obrazac_prijedloga");

  if (obrazac !== null) {
    obrazac.addEventListener("submit", provjeriObrazac);
  }
}

function provjeriObrazac(dogadaj) {
  let ispravno = true;

  let naziv = document.getElementById("input_naziv");
  let email = document.getElementById("input_mail");
  let godina = document.getElementById("input_godina");
  let datum = document.getElementById("input_datum");
  let opis = document.getElementById("tekst_opis");
  let stanje = document.getElementById("range_stanje");
  let koordinate = document.getElementById("tekst_koordinate");

  ocistiGreske();

  // Provjera naziva - je li prazan i barem 3 znaka
  if (tekstJePrazan(naziv.value)) {
    postaviGresku(naziv, "greska_naziv", "Naziv lokaliteta mora biti unesen.");
    ispravno = false;
  } else if (naziv.value.length < 3) {
    postaviGresku(naziv, "greska_naziv", "Naziv lokaliteta mora sadržavati 3 ili više znaka.");
    ispravno = false;
  }

  // Provjera emaila - je li prazan i u ispravnome formatu
  if (tekstJePrazan(email.value)) {
    postaviGresku(email, "greska_mail", "Email adresa mora biti unesena.");
    ispravno = false;
  } else if (emailJeNeispravan(email.value)) {
    postaviGresku(email, "greska_mail", "Email adresa mora biti u formatu ime@domena.hr.");
    ispravno = false;
  }

  // Provjera unesene godine nastanka objekta - mora biti unesena i između 0. godine i trenutne godine
  if (tekstJePrazan(godina.value)) {
    postaviGresku(godina, "greska_godina", "Godina nastanka mora biti unesena.");
    ispravno = false;
  } else {
    let godinaBroj = parseInt(godina.value);
    let danas = new Date();
    let trenutnaGodina = danas.getFullYear();

    if (godinaBroj < 0 || godinaBroj > trenutnaGodina) {
      postaviGresku(godina, "greska_godina", "Godina nastanka mora biti između 0. godine i trenutne godine.");
      ispravno = false;
    }
  }

  // Provjera unesenog datuma posjeta objektu - mora biti unesen i manji od današnjeg datuma (ne može se zabilježiti budući dolazak)
  if (tekstJePrazan(datum.value)) {
    postaviGresku(datum, "greska_datum", "Datum posjeta mora biti unesen.");
    ispravno = false;
  } else {
    let danas = new Date();
    let datumPosjeta = new Date(datum.value);

    if (datumPosjeta > danas) {
      postaviGresku(datum, "greska_datum", "Datum posjeta ne smije biti u budućnosti.");
      ispravno = false;
    }
  }

  // Provjera je li odabrana jedna od ponuđenih vrsta objekata.
  if (nijeOdabranaVrsta()) {
    let grupaVrsta = document.getElementById("radio_grupa_vrsta");
    postaviGresku(grupaVrsta, "greska_vrsta", "Potrebno je odabrati vrstu objekta.");
    ispravno = false;
  }

  // Provjera je li odabran bar jedan od ponuđenih stilova.
  if (nijeOdabranStil()) {
    let grupaStil = document.getElementById("stil_gradnje_grupa");
    postaviGresku(grupaStil, "greska_stil", "Potrebno je odabrati barem jedan stil gradnje.");
    ispravno = false;
  }

  // Provjera je li unesen tekst opisa lokaliteta i duljine barem 30 znakova
  if (tekstJePrazan(opis.value)) {
    postaviGresku(opis, "greska_opis", "Opis lokaliteta mora biti unesen.");
    ispravno = false;
  } else if (opis.value.length < 30) {
    postaviGresku(opis, "greska_opis", "Opis lokaliteta mora imati barem 30 znakova.");
    ispravno = false;
  }

  // Provjera jesu li koordinate unesene i je li njihov format ispravan
  if (!tekstJePrazan(koordinate.value)) {
    if (koordinateNeispravne(koordinate.value)) {
      postaviGresku(koordinate, "greska_koordinate", "Koordinate moraju biti u formatu: 46.123, 16.123.");
      ispravno = false;
    }
  }

  //  1. Odnos između polja: Datum posjeta ne može biti prije godine nastanka objekta.
  if (!tekstJePrazan(godina.value) && !tekstJePrazan(datum.value)) {
    let godinaBroj = parseInt(godina.value);
    let dijeloviDatuma = datum.value.split("-");
    let godinaPosjeta = parseInt(dijeloviDatuma[0]);

    if (godinaPosjeta < godinaBroj) {
      postaviGresku(datum, "greska_datum", "Datum posjeta ne može biti prije godine nastanka objekta.");
      ispravno = false;
    }
  }

  // 2. Odnos između polja: Ako je objekt loše očuvan, tada opis mora biti detaljniji (nije dovoljno npr: "Sve super očuvano, top, sve preporuke.", treba se napomenuti zašto je zaslužio pripadnost takvoj kategoriju).
  if (!tekstJePrazan(opis.value) && parseInt(stanje.value) <= 3 && opis.value.length < 60) {
    postaviGresku(opis, "greska_opis", "Za loše očuvan objekt potrebno je napisati opis od barem 60 znakova.");
    ispravno = false;
  }

  // 3. Odnos između polja: Ako je vrsta utvrda, godina nastanka ne bi trebala biti nakon 1900.
  if (odabranaVrijednostVrste() === "utvrda" && !tekstJePrazan(godina.value)) {
    let godinaBroj = parseInt(godina.value);

    if (godinaBroj > 1900) {
      postaviGresku(godina, "greska_godina", "Ako je vrsta objekta utvrda, godina nastanka treba biti 1900. ili starija.");
      ispravno = false;
    }
  }

  if (ispravno === false) {
    dogadaj.preventDefault();
  }
}

// Pomoćna funkcija za postavljanje stila greške i odgovarajuće poruke
function postaviGresku(element, idPoruke, poruka) {
  let porukaElement = document.getElementById(idPoruke);

  element.style.border = "2px solid red";

  if (porukaElement !== null) {
    porukaElement.textContent = poruka;
  }
}

// Pomoćna funkcija kojom se greške "očiste", odnosno uklone se crveni obrubi i poruke o greškama
function ocistiGreske() {
  let polja = [
    "input_naziv",
    "input_mail",
    "input_godina",
    "input_datum",
    "tekst_opis",
    "range_stanje",
    "tekst_koordinate",
    "radio_grupa_vrsta",
    "stil_gradnje_grupa"
  ];

  for (let i = 0; i < polja.length; i++) {
    let element = document.getElementById(polja[i]);

    if (element !== null) {
      element.style.border = "";
    }
  }

  let poruke = [
    "greska_naziv",
    "greska_mail",
    "greska_godina",
    "greska_datum",
    "greska_vrsta",
    "greska_stil",
    "greska_opis",
    "greska_koordinate"
  ];

  for (let i = 0; i < poruke.length; i++) {
    let poruka = document.getElementById(poruke[i]);

    if (poruka !== null) {
      poruka.textContent = "";
    }
  }
}

// Provjera je li tekst "nepostojeći" ili ako nije, je li "prazan" (duljine nula) te ako nije, ima li ikoji "pravi" znak
function tekstJePrazan(tekst) {
  if (tekst === undefined || tekst === null) {
    return true;
  }

  if (tekst.length === 0) {
    return true;
  }

  for (let i = 0; i < tekst.length; i++) {
    if (tekst[i] !== " " && tekst[i] !== "\n" && tekst[i] !== "\t" && tekst[i] !== "\r") {
      return false;
    }
  }

  return true;
}

// Provjera formata email adrese s pomoću regexa
function emailJeNeispravan(email) {
  // ^ ... $ -> sve između znakova ^ i $
  // [x-y] -> odabire znakove između x i y (ovdje od A do Z, a do z i 0 do 9)
  // x+ -> pokriva prethodno navedeni znak x 1 ili više puta
  // {n, } -> pokriva n ili više pojava prethodno navedenog znaka
  let izraz = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (izraz.test(email)) {
    return false;
  }

  return true;
}

// Provjera formata koordinata s pomoću regexa
function koordinateNeispravne(koordinate) {
  let izraz = /^-?[0-9]+(\.[0-9]+)?,[ ]?-?[0-9]+(\.[0-9]+)?$/;

  if (izraz.test(koordinate)) {
    return false;
  }

  return true;
}

// Provjera je li se desio slučaj da nijedna od ponuđenih vrsta nije označena
function nijeOdabranaVrsta() {
  let vrste = document.getElementsByName("vrsta");

  for (let i = 0; i < vrste.length; i++) {
    if (vrste[i].checked === true) {
      return false;
    }
  }

  return true;
}

// Funkcija koja vraća vrijednost odabrane vrste.
function odabranaVrijednostVrste() {
  let vrste = document.getElementsByName("vrsta");

  for (let i = 0; i < vrste.length; i++) {
    if (vrste[i].checked === true) {
      return vrste[i].value;
    }
  }

  return "";
}

// Provjera je li se desio slučaj da nijedan od ponuđenih stilova nije odabran
function nijeOdabranStil() {
  let stilovi = document.getElementsByName("stil[]");

  for (let i = 0; i < stilovi.length; i++) {
    if (stilovi[i].checked === true) {
      return false;
    }
  }
  return true;
}