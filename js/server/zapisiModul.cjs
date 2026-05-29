const fs = require("fs");

class ZapisiModul {
    constructor(putanjaDatoteke) {
        this.putanjaDatoteke = putanjaDatoteke;
    }

    dohvatiSve(kriteriji) {

        let podaci = fs.readFileSync(this.putanjaDatoteke, "utf-8");
        if (kriteriji === undefined) {
            kriteriji = {};
        }

        let zapisi = new Array();
        let redovi = podaci.split("\r\n");

        for (let red of redovi) {
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
            if (kriteriji.naziv !== undefined && kriteriji.naziv !== "") {
                if (!zapis.naziv.toLowerCase().includes(kriteriji.naziv.toLowerCase())) {
                    prolazno = false;
                }
            }

            if (kriteriji.opis !== undefined && kriteriji.opis !== "") {
                if (!zapis.opis.toLowerCase().includes(kriteriji.opis.toLowerCase())) {
                    prolazno = false;
                }
            }

            if (kriteriji.kategorija !== undefined && kriteriji.kategorija !== "") {
                if (!zapis.kategorija.toLowerCase().includes(kriteriji.kategorija.toLowerCase())) {
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

    dohvatiPoIdentifikatoru() {

    }

    dodajNovi() {

    }

    azurirajPostojeci() {

    }

    ukloniPoIdentifikatoru() {

    }

}

module.exports = ZapisiModul;