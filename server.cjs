const express = require('express');
const ZapisiModul = require('./js/server/zapisiModul.cjs');


const server = express();
const port = 12374;
const putanja = __dirname;
const zapisiModul = ZapisiModul;

server.use('/dizajn', express.static(putanja + '/css'));
server.use('/resursi', express.static(putanja + '/resursi'));
server.use('/JSklijent', express.static(putanja + '/js/klijent'));

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


server.get('/pregled', (zahtjev, odgovor) => {
    let zapisi = zapisiModul.dohvatiSve(null);

    odgovor.type('html');
    odgovor.send(generirajPregledZapisa(zapisi));
});




server.use((zahtjev, odgovor) => {
    odgovor.status(404);
    odgovor.send("Stranica ne postoji! <a href='/index'>Povratak na početnu</a>");
});
server.listen(port, () => {
    console.log(`Server pokrenut na portu: ${port}`);
});

function generirajPregledZapisa(zapisi) {
    let html = "";
    
    html += "<!DOCTYPE html>";
    html += "<html lang='hr'>";
    html += "<head>";
    html += "<meta charset='UTF-8'>";
    html += "<title>Pregled zapisa</title>";
    html += "<link rel='stylesheet' href='/dizajn/fperak24.css'>";
    html += "<link rel='stylesheet' href='/dizajn/lokaliteti.css'>";
    html += "</head>";

    html += "<body>";
    html += "<header>";
    html += "<h1>Dvorci sjeverozapadne Hrvatske</h1>";
    html += "<nav>";
    html += "<a class='nav_gumb' href='/index'>Početna</a>";
    html += "<a class='nav_gumb' href='/lokaliteti'>Lokaliteti</a>";
    html += "<a class='nav_gumb' href='/opcinaMarusevec'>Maruševec</a>";
    html += "<a class='nav_gumb' href='/opcinaVinica'>Vinica</a>";
    html += "<a class='nav_gumb' href='/noviMarof'>Novi Marof</a>";
    html += "<a class='nav_gumb' href='/obrValidacija'>Prijedlozi</a>";
    html += "<a class='nav_gumb' href='/pregled'>Pregled</a>";
    html += "<a class='nav_gumb' href='/api/zapisi'>API zapisi</a>";
    html += "<a class='nav_gumb' href='/dokumentacija'>Dokumentacija</a>";
    html += "</nav>";
    html += "</header>";

    html += "<main>";
    html += "<h2>Pregled zapisa o lokalitetima</h2>";

    html += "<table>";
    html += "<caption>Zapisi iz datoteke zapisi.csv</caption>";
    html += "<thead>";
    html += "<tr>";
    html += "<th>ID</th>";
    html += "<th>Naziv</th>";
    html += "<th>Kategorija</th>";
    html += "<th>Prikaži</th>";
    html += "</tr>";

    if (zapisi.length === 0) {
        html += "<tr>";
        html += "<td colspan='4'>Nema zapisa za prikazati.</td>";
        html += "</tr>";
    } else {
        for (let i = 0; i < zapisi.length; i++) {
            html += "<tr>";
            html += "<td>" + zapisi[i].id + "</td>";
            html += "<td>" + zapisi[i].naziv + "</td>";
            html += "<td>" + zapisi[i].kategorija + "</td>";
            html += "<td><a href='/pregled/" + zapisi[i].id + "'>Prikaži</a></td>";
            html += "</tr>";
        }
    }
    
    html += "</tbody>";
    html += "</table>";

    html += "</main>";
    html += "</body>";
    html += "</html>";

    return html;

}