const ds = require("fs");

class ZapisiModul {
    constructor(putanjaDatoteke) {
        this.putanjaDatoteke = putanjaDatoteke;
    }

    dohvatiObjekte() {
        let podaci = ds.readFileSync(this.putanjaDatoteke, "utf-8");
        let zapisi = new Array();
        let redovi = podaci.split("\r\n");

        for (let red of redovi) {
            // pazi na prazne redove
            if (red !== "") {
                let stupci = red.split("#");
                let zapis = {
                    id: stupci[0],
                    naziv: stupci[1],
                    opis: stupci[2],
                    kategorija: stupci[3],
                    datumUnosa: stupci[4]
                }
                zapisi.push(zapis);
            }
        }
        return zapisi;
    }

    stringificirajZapise(zapisi) {
        let stringZapisi = "";

        for (let zapis of zapisi) {
            stringZapisi += zapis.id + "#";
            stringZapisi += zapis.naziv + "#";
            stringZapisi += zapis.opis + "#";
            stringZapisi += zapis.kategorija + "#";
            stringZapisi += zapis.datumUnosa + "\r\n";
        }

        return stringZapisi;
    }

    dohvatiSve(kriteriji) {
        if (kriteriji === undefined) {
            kriteriji = {};
        }

        let zapisi = this.dohvatiObjekte();

        let filtriraniZapisi = new Array();

        for (let zapis of zapisi) {
            let prolazno = true;
            if (kriteriji.pojam !== undefined && kriteriji.pojam !== "") {
                let pojam = kriteriji.pojam.toLowerCase();
                let naziv = zapis.naziv.toLowerCase();
                let opis = zapis.opis.toLowerCase();

                if (naziv.indexOf(pojam) === -1 && opis.indexOf(pojam) === -1) {
                    prolazno = false;
                }
            }

            if (kriteriji.kategorija !== undefined && kriteriji.kategorija !== "") {
                if (zapis.kategorija.toLowerCase() !== kriteriji.kategorija.toLowerCase()) {
                    prolazno = false;
                }
            }

            if (prolazno === true) {
                filtriraniZapisi.push(zapis);
            }
        }

        return filtriraniZapisi;
    }

    dohvatiPoIdentifikatoru(id) {
        id = String(id);

        let zapisi = this.dohvatiObjekte();

        for (let zapis of zapisi) {
            if (zapis.id === id) {
                return zapis;
            }
        }

        return null;
    }

    dodajNovi(noviZapis) {
        let zapisi = this.dohvatiObjekte();

        let noviId = 0;
        for (let z of zapisi) {
            let idZapisa = parseInt(z.id);
            if (idZapisa > noviId) {
                noviId = idZapisa;
            }
        }
        noviId += 1;

        noviZapis.id = noviId;

        let stringNoviZapis = "";
        stringNoviZapis += (noviZapis.id + "#");
        stringNoviZapis += (noviZapis.naziv + "#");
        stringNoviZapis += (noviZapis.opis + "#");
        stringNoviZapis += (noviZapis.kategorija + "#");
        stringNoviZapis += (noviZapis.datumUnosa + "\r\n");

        let trenutniPodaci = ds.readFileSync(this.putanjaDatoteke, "utf-8");

        // provjeri ima li posljednji zapis na kraju \r\n, ako nema, onda to dodaj na početak novog zapisa
        if (trenutniPodaci.length > 0) {
            let zadnjiZnak = trenutniPodaci[trenutniPodaci.length - 1];

            if (zadnjiZnak !== "\n") {
                stringNoviZapis = "\r\n" + stringNoviZapis;
            }
        }

        ds.writeFileSync(this.putanjaDatoteke, stringNoviZapis, { encoding: "utf-8", flag: 'a+' });

        return noviZapis;
    }

    azurirajPostojeci(id, noveVrijednosti) {
        id = String(id);

        let zapisi = this.dohvatiObjekte();

        let trazeniZapis;
        for (let zapis of zapisi) {
            if (zapis.id === id) {
                trazeniZapis = zapis;
            }
        }

        if (trazeniZapis === undefined) {
            return null;
        }

        if (noveVrijednosti.naziv && noveVrijednosti.naziv !== "") {
            trazeniZapis.naziv = noveVrijednosti.naziv;
        }
        if (noveVrijednosti.opis && noveVrijednosti.opis !== "") {
            trazeniZapis.opis = noveVrijednosti.opis;
        }
        if (noveVrijednosti.kategorija && noveVrijednosti.kategorija !== "") {
            trazeniZapis.kategorija = noveVrijednosti.kategorija;
        }
        if (noveVrijednosti.datumUnosa) {
            trazeniZapis.datumUnosa = noveVrijednosti.datumUnosa;
        }

        let azuriraniZapisi = new Array();
        for (let zapis of zapisi) {
            if (zapis.id === id) {
                azuriraniZapisi.push(trazeniZapis);
            } else {
                azuriraniZapisi.push(zapis);
            }
        }


        let stringZapisi = this.stringificirajZapise(azuriraniZapisi);

        ds.writeFileSync(this.putanjaDatoteke, stringZapisi, "utf-8");

        return trazeniZapis;
    }



    ukloniPoIdentifikatoru(id) {
        id = String(id);

        let zapisi = this.dohvatiObjekte();
        let azuriraniZapisi = new Array();

        let obrisan = false;

        for (let zapis of zapisi) {
            if (zapis.id !== id) {
                azuriraniZapisi.push(zapis);
            } else {
                obrisan = true;
            }
        }

        if (obrisan === false) {
            return false;
        }

        let stringZapisi = this.stringificirajZapise(azuriraniZapisi);

        ds.writeFileSync(this.putanjaDatoteke, stringZapisi, "utf-8");

        return true;
    }
}

module.exports = ZapisiModul;