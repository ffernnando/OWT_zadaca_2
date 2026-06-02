const express = require('express'); // na spideru: const bodyParser = require('/usr/lib64/node_modules/express');
const bodyParser = require('body-parser') // na spideru: const bodyParser = require('/usr/lib64/node_modules/body-parser');
const ZapisiModul = require('./js/server/zapisiModul.cjs');


const server = express();
const port = 12374;
const putanja = __dirname;
const zapisiModul = new ZapisiModul(putanja + '/zapisi.csv');

server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());

server.use('/dizajn', express.static(putanja + '/css'));
server.use('/resursi', express.static(putanja + '/resursi'));
server.use('/JSklijent', express.static(putanja + '/js/klijent'));


// ----------------------------- Posluživanje statičkih stranica -----------------------------
server.get('/', (zahtjev, odgovor) => {
    odgovor.redirect('/index');
});

server.get('/dokumentacija', (zahtjev, odgovor) => {
    odgovor.sendFile(putanja + '/html/dokumentacija.html');
});

server.get('/index', (zahtjev, odgovor) => {
    odgovor.sendFile(putanja + '/html/index.html');
});

server.get('/lokaliteti', (zahtjev, odgovor) => {
    odgovor.sendFile(putanja + '/html/lokaliteti.html');
});

server.get('/noviMarof', (zahtjev, odgovor) => {
    odgovor.sendFile(putanja + '/html/noviMarof.html');
});

server.get('/opcinaMarusevec', (zahtjev, odgovor) => {
    odgovor.sendFile(putanja + '/html/opcinaMarusevec.html');
});

server.get('/opcinaVinica', (zahtjev, odgovor) => {
    odgovor.sendFile(putanja + '/html/opcinaVinica.html');
});

server.get('/obrValidacija', (zahtjev, odgovor) => {
    odgovor.sendFile(putanja + '/html/prijedlozi.html');
});


// ----------------------------- Posluživanje dinamičke stranice -----------------------------
server.get('/pregled', (zahtjev, odgovor) => {
    let zapisi = zapisiModul.dohvatiSve(zahtjev.query);

    console.log('--------------------------------------- DOHVACENI ZAPISI ---------------------------------------');
    for (let zapis of zapisi) {
        for (let k in zapis) {
            console.log(`${k}: ${zapis[k]}`);
        }
    }

    odgovor.type('html');
    odgovor.send(generirajPregledZapisa(zapisi));
});

server.get('/pregled/:id', (zahtjev, odgovor) => {
    let id = zahtjev.params.id;
    let zapis = zapisiModul.dohvatiPoIdentifikatoru(id);

    console.log('--------------------------------------- DOHVACENI ZAPIS ---------------------------------------');
    if (zapis !== null) {
        for (let k in zapis) {
            console.log(`${k}: ${zapis[k]}`);
        }
    }

    odgovor.type('html');
    odgovor.send(generirajDetaljeZapisa(zapis));
});

server.post('/pregled/obrisi/:id', (zahtjev, odgovor) => {
    let id = zahtjev.params.id;

    let uspjeh = zapisiModul.ukloniPoIdentifikatoru(id);

    console.log('Uspjeh: ', uspjeh);

    odgovor.redirect('/pregled');
});


// implementirati get za jedan zapis preko id-ja


// ---------------------------------------------- REST SERVIS - /api/zapisi ----------------------------------------------
server.get('/api/zapisi', (zahtjev, odgovor) => {
    let zapisi = zapisiModul.dohvatiSve(zahtjev.query);

    odgovor.status(200);
    odgovor.type('json');
    odgovor.send(JSON.stringify(zapisi));
});

server.post('/api/zapisi', (zahtjev, odgovor) => {
    let noviZapis = zahtjev.body;
    /* FORMAT ZAPISA
        {
            "naziv":"naziv",
            "opis":"opis",
            "kategorija":"kategorija",
            "datumUnosa":"datumUnosa"
        }

    */
    odgovor.type('json');
    if (noviZapis.naziv === undefined || noviZapis.naziv === "" || noviZapis.opis === undefined || noviZapis.opis === "" || noviZapis.kategorija === undefined || noviZapis.kategorija === "" || noviZapis.datumUnosa === undefined || noviZapis.datumUnosa === "") {
        odgovor.status(400);
        odgovor.send(JSON.stringify({ greska: "Neispravni ili nepotpuni podaci za zapis." }));
    } else {
        let dodaniZapis = zapisiModul.dodajNovi(noviZapis);

        odgovor.status(201);
        odgovor.send(JSON.stringify(dodaniZapis));
    }
});

server.put('/api/zapisi', (zahtjev, odgovor) => {
    odgovor.type('json');
    odgovor.status(405);
    odgovor.send(JSON.stringify({ greska: "Metoda nije dopuštena za kolekciju zapisa." }));
});

server.delete('/api/zapisi', (zahtjev, odgovor) => {
    odgovor.type('json');
    odgovor.status(405);
    odgovor.send(JSON.stringify({ greska: "Metoda nije dopuštena za kolekciju zapisa." }));
});


// ---------------------------------------------- REST SERVIS - /api/zapisi/{id} ----------------------------------------------
server.get('/api/zapisi/:id', (zahtjev, odgovor) => {
    let id = zahtjev.params.id;
    let zapis = zapisiModul.dohvatiPoIdentifikatoru(id);

    odgovor.type('json');

    if (zapis === null) {
        odgovor.status(404);
        odgovor.send(JSON.stringify({ greska: "Zapis s traženim identifikatorom nije pronađen." }));
    } else {
        odgovor.status(200);
        odgovor.send(JSON.stringify(zapis));
    }
});

server.post('/api/zapisi/:id', (zahtjev, odgovor) => {
    odgovor.type('json');
    odgovor.status(405);
    odgovor.send(JSON.stringify({ greska: "Metoda nije dopuštena za pojedinačni zapis." }));
});

server.put('/api/zapisi/:id', (zahtjev, odgovor) => {
    let azuriraniZahtjev = zahtjev.body;
    let id = zahtjev.params.id;
    odgovor.type('json');

    if (azuriraniZahtjev.naziv === undefined || azuriraniZahtjev.naziv === "" || azuriraniZahtjev.opis === undefined || azuriraniZahtjev.opis === "" || azuriraniZahtjev.kategorija === undefined || azuriraniZahtjev.kategorija === "" || azuriraniZahtjev.datumUnosa === undefined || azuriraniZahtjev.datumUnosa === "") {
        odgovor.status(400);
        odgovor.send(JSON.stringify({ greska: "Neispravni podaci za ažuriranje." }));
    } else {
        let noviZahtjev = zapisiModul.azurirajPostojeci(id, azuriraniZahtjev);
        if (noviZahtjev === null) {
            odgovor.status(404);
            odgovor.send(JSON.stringify({ greska: "Zapis s traženim id-im nije pronađen za ažuriranje." }));
        } else {
            odgovor.status(200);
            odgovor.send(noviZahtjev)
        }
    }
});


server.delete('/api/zapisi/:id', (zahtjev, odgovor) => {
    let id = zahtjev.params.id;
    let rezultatBrisanja = zapisiModul.ukloniPoIdentifikatoru(id);

    odgovor.type('json');

    if (rezultatBrisanja === true) {
        odgovor.status(200);
        odgovor.send(JSON.stringify({ poruka: "Zapis je uspješno obrisan." }));
    } else {
        odgovor.status(404);
        odgovor.send(JSON.stringify({ greska: "Zapis s traženim identifikatorom nije pronađen za brisanje." }));
    }
});


// ----------------------------------------------- default response - ako se pokuša pristupiti stranici koja ne postoji i listener za port -----------------------------------------------
server.use((zahtjev, odgovor) => {
    odgovor.type('html');
    odgovor.status(404);
    odgovor.send(generiraj404Stranicu());
});
server.listen(port, () => {
    console.log(`Server pokrenut na portu: ${port}`);
});


function generiraj404Stranicu() {
    let html = "";

    html += htmlPocetak;

    html += "<section class='greska_stranica'>";
    html += "<h2>Stranica ne postoji!</h2>";
    html += "<p><a href='/index'>Povratak na početnu</a></p>";
    html += "</section>";

    html += htmlKraj;

    return html;
}

// ----------------------------------------------- POMOĆNE FUNKCIJE ZA GENERIRANJE SADRŽAJA DINAMIČKE STRANICE -----------------------------------------------
// DODAJ možda neku malu formicu za dodavanje zapisa :3?

function generirajDetaljeZapisa(zapis) {
    let html = "";
    html += htmlPocetak;

    html += "<section class='detalji_zapisa'>";
    html += "<h2>Detaljan prikaz odabranog zapisa</h2>";

    if (zapis === null) {
        html += "<p>Traženi zapis nije pronađen!</p>"
        html += "<p><a href='/pregled'>Povratak na pregled svih zapisa</a></p>"
    } else {
        html += "<h2>" + zapis.naziv + "</h2>";
        html += "<p style='font-weight: bold'>ID zapisa: " + zapis.id + "</p>";
        html += "<p style='font-weight: bold'>Opis: " + zapis.opis + "</p>";
        html += "<p style='font-weight: bold'>Kategorija: " + zapis.kategorija + "</p>";
        html += "<p style='font-weight: bold'>Datum unosa: " + zapis.datumUnosa + "</p>";
        html += "<p><a href='/pregled'>Povratak na pregled zapisa</a></p>";
    }

    html += "</section>";
    html += htmlKraj;

    return html;
}

function generirajPregledZapisa(zapisi) {
    let html = "";

    html += htmlPocetak;

    html += "<h2>Pregled zapisa o lokalitetima</h2>";
    html += "<p>Ovo je stranica koja dinamički pokazuje podatke smještene unutar datoteke zapisi.csv.</p>";

    html += "<h2>Pretraživanje zapisa</h2>";
    html += "<form action = '/pregled' method = 'get' >";
    html += "<label for='input_pojam'>Pojam za pretrazivanje:</label>";
    html += "<input id='input_pojam' type='text' name='pojam'><br><br>";
    html += "<label for='select_kategorija'>Kategorija: </label>";
    html += "<select id='select_kategorija' name='kategorija'>";
    html += "<option value=''>Sve</option>";
    html += "<option value='dvorac'>Dvorac</option>";
    html += "<option value='utvrda'>Utvrda</option>";
    html += "<option value='kurija'>Kurija</option>";
    html += "</select><br><br>";
    html += "<input type='submit' value='Primjeni'>";
    html += "</form>"


    html += "<section>";
    html += "<h2>Tablica zapisa</h2>";

    html += "<table id='tablica_lokaliteta'>";
    html += "<caption>Zapisi iz datoteke zapisi.csv</caption>";

    html += "<thead>";
    html += "<tr>";
    html += "<th>ID</th>";
    html += "<th>Naziv</th>";
    html += "<th>Opis</th>";
    html += "<th>Kategorija</th>";
    html += "<th>Datum unosa</th>";
    html += "<th>Prikaži</th>";
    html += "<th>Izbriši</th>"
    html += "</tr>";
    html += "</thead>";

    html += "<tbody>";

    if (zapisi.length === 0) {
        html += "<tr>";
        html += "<td colspan='7'>Nema zapisa za prikazati.</td>";
        html += "</tr>";
    } else {
        for (let i = 0; i < zapisi.length; i++) {
            if (i % 2 === 1) {
                html += "<tr class='parni_redak'>";
            } else {
                html += "<tr>";
            }

            html += "<td>" + zapisi[i].id + "</td>";
            html += "<td>" + zapisi[i].naziv + "</td>";
            html += "<td>" + zapisi[i].opis + "</td>";
            html += "<td>" + zapisi[i].kategorija + "</td>";
            html += "<td>" + zapisi[i].datumUnosa + "</td>";
            html += "<td><a href='/pregled/" + zapisi[i].id + "'>Prikaži</a></td>";
            html += "<td><form action='/pregled/obrisi/" + zapisi[i].id + "' method='post'>";
            html += "<input type='submit' value='Obriši'>"
            html += "</form></td>";
            html += "</tr>";
        }
    }

    html += "</tbody>";
    html += "</table>";

    html += "</section>";

    html += htmlKraj;

    return html;
}

// ----------------------------------------------- VARIJABLE ZA POHRANU COPY-PASTE DIJELOVA HTML-A KOJI SU ISTI NA OBJE DINAMIČKE STRANICE -----------------------------------------------

let htmlPocetak = "<!DOCTYPE html>" +
    "<html lang='hr'>" +
    "<head>" +
    "<meta charset='UTF-8'>" +
    "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
    "<link rel='stylesheet' href='/dizajn/fperak24.css'>" +
    "<link rel='stylesheet' href='/dizajn/prijedlozi.css'>" +
    "<script src='/JSklijent/fperak24.js'></script>" +
    "<title>Pregled zapisa</title>" +
    "</head>" +
    "<body>" +
    "<nav class='navigacija'>" +
    "<div id='nav_logo'>" +
    "Dvorci sjeverozapadne Hrvatske" +
    "</div>" +
    "<div id='nav_gumbi'>" +
    "<a class='nav_gumb' id='pocetna_gumb' href='/index'>Početna</a>" +
    "<div id='lokaliteti_padajuci'>" +
    "<a class='nav_gumb' id='lokaliteti_gumb' href='/lokaliteti'>Lokaliteti</a>" +
    "<div id='lokaliteti_podizbornik'>" +
    "<a class='nav_gumb' id='marusevec_gumb' href='/opcinaMarusevec'>Maruševec</a>" +
    "<a class='nav_gumb' id='vinica_gumb' href='/opcinaVinica'>Vinica</a>" +
    "<a class='nav_gumb' id='novi_marof_gumb' href='/noviMarof'>Novi Marof</a>" +
    "</div>" +
    "</div>" +
    "<a class='nav_gumb' id='prijedlozi_gumb' href='/obrValidacija'>Prijedlozi</a>" +
    "<a class='nav_gumb' id='pregled_gumb' href='/pregled'>Pregled</a>" +
    "<a class='nav_gumb' id='api_gumb' href='/api/zapisi'>API zapisi</a>" +
    "<a class='nav_gumb' id='dokumentacija_gumb' href='/dokumentacija'>Dokumentacija</a>" +
    "</div>" +
    "</nav>" +
    "<header>" +
    "<div id='zatamnjenje'>" +
    "<h1>Dvorci sjeverozapadne Hrvatske</h1>" +
    "</div>" +
    "</header>" +
    "<main>" +
    "<article>";

let htmlKraj = "</article>" +
    "</main>" +
    "<footer>" +
    "<p>" +
    "<a href='https://creativecommons.org/public-domain/cc0/' target='_blank'>&copy;</a> " +
    "2026 Dvorci i kurije sjeverozapadne Hrvatske | Kontakt: " +
    "<a href='mailto:fperak24@student.foi.hr'>fperak24@student.foi.hr</a>" +
    "</p>" +
    "<p>" +
    "<a href='/dokumentacija'>Dokumentacija</a>" +
    "</p>" +
    "</footer>" +
    "</body>" +
    "</html>";


/*
Backup zapisa ako bi slučajno brisao:
 
1#Kurija Calinec#Kurija u naselju Calinec povezana je s povijesnim razvojem maruseveckog kraja.#kurija#2026-04-19
2#Dvorac Marusevec#Dvorac Marusevec jedan je od najpoznatijih lokaliteta na podrucju opcine Marusevec.#dvorac#2026-04-20
3#Bajnski dvori#Bajnski dvori predstavljaju povijesni kompleks na podrucju Gornjeg Ladanja koji je danas u losem stanju.#dvorac#2026-04-21
4#Stari grad Vinica#Stari grad Vinica srednjovjekovna je utvrda ciji se ostaci nalaze na podrucju Vinice.#utvrda#2026-04-22
5#Dvorac Opeka#Dvorac Opeka nalazi se u Marcanu i poznat je po povezanosti s arboretumom Opeka.#dvorac#2026-04-23
6#Pusta Bela#Pusta Bela odnosi se na ostatke starije utvrde na podrucju Bele kod Novog Marofa.#utvrda#2026-04-24
7#Dvorac Bela I#Dvorac Bela I pripada skupini povijesnih lokaliteta novomarofskog podrucja.#dvorac#2026-04-25
8#Dvorac Bela II#Dvorac Bela II povezan je s plemickom bastinom Bele i sireg novomarofskog kraja.#dvorac#2026-04-26
9#Kurija Ladanje#Kurija Ladanje predstavlja primjer manjeg plemickog objekta na prostoru sjeverozapadne Hrvatske.#kurija#2026-04-27
10#Utvrda Grebengrad#Utvrda Grebengrad srednjovjekovni je lokalitet povezan s povijescu sireg novomarofskog prostora.#utvrda#2026-04-28

*/