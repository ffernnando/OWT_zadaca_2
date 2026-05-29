const ds = require("fs");

class ZapisiModul {
    constructor(putanjaDatoteke) {
        this.putanjaDatoteke = putanjaDatoteke;
    }

    dohvatiSve(kriteriji) {
        let zapisi = [];
        let podaci = "";

        try {
            podaci = ds.readFileSync(this.putanjaDatoteke, "utf-8");
        } catch (greska) {
            console.error("Greška kod čitanja datoteke zapisi.csv");
            return zapisi;
        }

        let linije = podaci.split("\n");

        for (let i = 0; i < linije.length; i++) {
            let linija = linije[i];

            if (linija !== "") {
                let zapis = this.pretvoriRedakUZapis(linija);

                if (zapis !== null) {
                    if (this.zadovoljavaKriterije(zapis, kriteriji)) {
                        zapisi.push(zapis);
                    }
                }
            }
        }

        return zapisi;
    }

    dohvatiPoIdentifikatoru(id) {
        let zapisi = this.dohvatiSve(null);
        let trazeniId = String(id);

        for (let i = 0; i < zapisi.length; i++) {
            if (zapisi[i].id === trazeniId) {
                return zapisi[i];
            }
        }

        return null;
    }

    dodajNovi(noviZapis) {
        if (!this.provjeriZapis(noviZapis)) {
            return null;
        }

        let zapisi = this.dohvatiSve(null);
        let noviId = this.dohvatiSljedeciId(zapisi);

        let zapis = {
            id: String(noviId),
            naziv: noviZapis.naziv,
            opis: noviZapis.opis,
            kategorija: noviZapis.kategorija,
            datumUnosa: noviZapis.datumUnosa
        };

        let redak = this.pretvoriZapisURedak(zapis);

        try {
            ds.writeFileSync(this.putanjaDatoteke, redak + "\n", { flag: "a+" });
        } catch (greska) {
            console.error("Greška kod dodavanja zapisa.");
            return null;
        }

        return zapis;
    }

    azurirajPostojeci(id, noviPodaci) {
        if (!this.provjeriZapis(noviPodaci)) {
            return null;
        }

        let zapisi = this.dohvatiSve(null);
        let pronaden = false;
        let azuriraniZapis = null;

        for (let i = 0; i < zapisi.length; i++) {
            if (zapisi[i].id === String(id)) {
                zapisi[i].naziv = noviPodaci.naziv;
                zapisi[i].opis = noviPodaci.opis;
                zapisi[i].kategorija = noviPodaci.kategorija;
                zapisi[i].datumUnosa = noviPodaci.datumUnosa;

                pronaden = true;
                azuriraniZapis = zapisi[i];
            }
        }

        if (!pronaden) {
            return false;
        }

        this.spremiSve(zapisi);

        return azuriraniZapis;
    }

    ukloniPoIdentifikatoru(id) {
        let zapisi = this.dohvatiSve(null);
        let noviZapisi = [];
        let pronaden = false;

        for (let i = 0; i < zapisi.length; i++) {
            if (zapisi[i].id === String(id)) {
                pronaden = true;
            } else {
                noviZapisi.push(zapisi[i]);
            }
        }

        if (!pronaden) {
            return false;
        }

        this.spremiSve(noviZapisi);

        return true;
    }

    spremiSve(zapisi) {
        let sadrzaj = "";

        for (let i = 0; i < zapisi.length; i++) {
            sadrzaj += this.pretvoriZapisURedak(zapisi[i]);

            if (i < zapisi.length - 1) {
                sadrzaj += "\n";
            }
        }

        if (sadrzaj !== "") {
            sadrzaj += "\n";
        }

        try {
            ds.writeFileSync(this.putanjaDatoteke, sadrzaj, "utf-8");
            return true;
        } catch (greska) {
            console.error("Greška kod spremanja zapisa.");
            return false;
        }
    }

    pretvoriRedakUZapis(redak) {
        let dijelovi = redak.split("#");

        if (dijelovi.length !== 5) {
            return null;
        }

        let zapis = {
            id: dijelovi[0],
            naziv: dijelovi[1],
            opis: dijelovi[2],
            kategorija: dijelovi[3],
            datumUnosa: dijelovi[4]
        };

        return zapis;
    }

    pretvoriZapisURedak(zapis) {
        let redak = "";

        redak += zapis.id;
        redak += "#";
        redak += zapis.naziv;
        redak += "#";
        redak += zapis.opis;
        redak += "#";
        redak += zapis.kategorija;
        redak += "#";
        redak += zapis.datumUnosa;

        return redak;
    }

    zadovoljavaKriterije(zapis, kriteriji) {
        if (kriteriji == null) {
            return true;
        }

        let pojam = "";
        let kategorija = "";

        if (kriteriji.pojam != null) {
            pojam = kriteriji.pojam.toLowerCase();
        }

        if (kriteriji.kategorija != null) {
            kategorija = kriteriji.kategorija.toLowerCase();
        }

        if (pojam !== "") {
            let naziv = zapis.naziv.toLowerCase();
            let opis = zapis.opis.toLowerCase();

            if (naziv.indexOf(pojam) === -1 && opis.indexOf(pojam) === -1) {
                return false;
            }
        }

        if (kategorija !== "") {
            if (zapis.kategorija.toLowerCase() !== kategorija) {
                return false;
            }
        }

        return true;
    }

    provjeriZapis(zapis) {
        if (zapis == null) {
            return false;
        }

        if (zapis.naziv == null || zapis.opis == null || zapis.kategorija == null || zapis.datumUnosa == null) {
            return false;
        }

        if (zapis.naziv === "") {
            return false;
        }

        if (zapis.opis === "") {
            return false;
        }

        if (zapis.kategorija === "") {
            return false;
        }

        if (zapis.datumUnosa === "") {
            return false;
        }

        if (!this.provjeriDatum(zapis.datumUnosa)) {
            return false;
        }

        return true;
    }

    provjeriDatum(datum) {
        let izraz = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

        return izraz.test(datum);
    }

    dohvatiSljedeciId(zapisi) {
        let najveciId = 0;

        for (let i = 0; i < zapisi.length; i++) {
            let trenutniId = parseInt(zapisi[i].id);

            if (!isNaN(trenutniId)) {
                if (trenutniId > najveciId) {
                    najveciId = trenutniId;
                }
            }
        }

        return najveciId + 1;
    }
}

module.exports = ZapisiModul;