let rabotaIdet = false;

function proveritProstoeChislo(chislo) {
  if (chislo < 2) {
    return false;
  }

  if (chislo % 2 === 0) {
    return chislo === 2;
  }

  let delitel = 3;

  while (delitel * delitel <= chislo) {
    if (chislo % delitel === 0) {
      return false;
    }

    delitel = delitel + 2;
  }

  return true;
}

function poschitatProstyeChisla(predel) {
  const vremyaNachala = Date.now();
  let kolichestvo = 0;
  let poslednee = 0;
  let shagOtcheta = Math.floor(predel / 20);

  if (shagOtcheta < 1000) {
    shagOtcheta = 1000;
  }

  for (let chislo = 2; chislo <= predel; chislo++) {
    if (rabotaIdet === false) {
      self.postMessage({ tip: "otmena" });
      return;
    }

    if (proveritProstoeChislo(chislo) === true) {
      kolichestvo = kolichestvo + 1;
      poslednee = chislo;
    }

    if (chislo % shagOtcheta === 0) {
      const procent = Math.round((chislo / predel) * 100);

      self.postMessage({
        tip: "progress",
        tekushchiy: chislo,
        predel: predel,
        procent: procent
      });
    }
  }

  self.postMessage({
    tip: "result",
    kolichestvo: kolichestvo,
    poslednee: poslednee,
    vremya: Date.now() - vremyaNachala
  });
}

self.onmessage = function (sobytie) {
  const zadanie = sobytie.data;

  if (zadanie.predel === undefined || typeof zadanie.predel !== "number") {
    self.postMessage({ tip: "oshibka", tekst: "Некорректное задание" });
    return;
  }

  rabotaIdet = true;
  poschitatProstyeChisla(Math.round(zadanie.predel));
};
