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
            // pazi na prazne redove :)
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

        /* zapisi.forEach(zapis => {
            console.log('------------------------ ZAPIS ------------------------');
            for (const key in zapis) {
                console.log(`${key}: ${zapis[key]}`);
            }
        }); */

        console.log('KRITERIJI: ');
        for (let key in kriteriji) {
            console.log(`${key}: ${kriteriji[key]}`);
        }

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

            /*
            ------------------ KRIVO -> TREBA MALO ČITATI UPUTE ŠEFE ---------------------------
            if (kriteriji.naziv !== undefined && kriteriji.naziv !== "") {
                if (!zapis.naziv.toLowerCase().includes(kriteriji.naziv.toLowerCase())) {
                    prolazno = false;
                }
            }

            if (kriteriji.opis !== undefined && kriteriji.opis !== "") {
                if (!zapis.opis.toLowerCase().includes(kriteriji.opis.toLowerCase())) {
                    prolazno = false;
                }
            }*/

            if (kriteriji.kategorija !== undefined && kriteriji.kategorija !== "") {
                if (zapis.kategorija.toLowerCase() !== kriteriji.kategorija.toLowerCase()) {
                    prolazno = false;
                }
            }

            if (prolazno === true) {
                filtriraniZapisi.push(zapis);
            }
        }

        /* for (let k in filtriraniZapisi) {
            console.log(`${k}: ${filtriraniZapisi[k]}`);
        } */

        return filtriraniZapisi;



        // kriteriji mogu biti za filtriranje po nazivu ili opisu ili kategoriji (ili datumu unosa??)
        //1#Kurija Calinec#Kurija u naselju Calinec povezana je s povijesnim razvojem maruseveckog kraja.#kurija#2026-04-19
        // id#naziv#opis#kategorija#datumUnosa
        /*
            objekt kriteriji
            kriteriji {
                naziv: "",
                opis: "",
                kategorija: ""
            };

            U svakom slučaju trebaš prvo dohvatiti sve iz .csv datoteke i parsirati tak da napraviš da bude 1 linija = 1 objekt
            Dakle, prvo ideš po separatoru '\n' da dobiješ redove/linije koji će kasnije postati objektima
            Potom za svaku liniju iz nekog arrayja gradiš novi objekt tipa zapis ili kaj već tako da podijeliš po znaku "#" i
            svaki taj dijelić linije pohraniš u odgovarajuće svojstvo objekta, pri čemu ga, naravno, prvo parsiraš u odgovrajući tip podataka

            Onda na neku foru provjeravaš je li koji kriterij postvaljen i primjenjuješ odgovarajuće filtere na rezultate
            U biti samo redom ideš if (kriteriji.naziv !== null && kriteriji.naziv !== "") rezultati.filtrirajPoNazivu(naziv)
                if (kriteriji.opis !== null && kriteriji.opis !== "") rezultati.filtrirajPoOpisu(opis)
                if (kriteriji.kategorija !== null && kriteriji.kategorija !== "") rezultati.filtrirajPoKategoriji(kategorija)
            Te sve filtracije su zasebne pomoćne funkcije            
        */

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

        console.log("Stringificirani novi zapis: " + stringNoviZapis);

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
        console.log(`Stringificiran popis svih zapisa:\n${stringZapisi}`);

        ds.writeFileSync(this.putanjaDatoteke, stringZapisi, "utf-8");

        /*  1. dohvati sve i pretvori u objekte
            2. pronađi objekt s odgovarajućim id-jem
            3. prepravi objekt tak da mu postavi nove vrijednosti za svojstva koja već da su bila odabrana (slično ko s kriterijima nekaj)
            4. zamijeni stari traženi objekt novim-izmijenjenim objektom
            5. stringificiraj sve zapise skupa
            6. pohrani u csv
        */

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
        console.log(`Stringificiran popis svih zapisa:\n${stringZapisi}`);

        ds.writeFileSync(this.putanjaDatoteke, stringZapisi, "utf-8");

        return true;
        /*  1. dohvati sve i pretvori u objekte
            2. napravi novu praznu listu
            3. iteriraj kroz početnu listu i pushaj svaki objekt iz nje na novu listu osim onog s traženim id-jem
            4. stringificiraj sve zapise nove liste
            5. pohrani u csv
        */
    }
}

module.exports = ZapisiModul;