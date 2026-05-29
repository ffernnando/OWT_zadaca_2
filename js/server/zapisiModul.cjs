const fs = require("fs");

class ZapisiModul {
    constructor(putanjaDatoteke) {
        this.putanjaDatoteke = putanjaDatoteke;
    }

    dohvatiSve(kriteriji) {
        var sadrzaj;
        var linije = new Array();
        fs.readFile(this.putanjaDatoteke, "utf-8", (greska, podaci) => {
            if (greska) {
                console.log(greska)
            } else {
                sadrzaj = podaci;
            }
        })



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