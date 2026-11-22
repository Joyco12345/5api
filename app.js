const stranicy = ["domashnyaya", "istoriya", "risovanie", "vychisleniya"];

const nazvaniyaStranic = {
  domashnyaya: "Главная",
  istoriya: "История браузера",
  risovanie: "Графика и анимация",
  vychisleniya: "Web Workers"
};

let imyaTekushcheyStranicy = "domashnyaya";
let stranicyNazad = ["domashnyaya"];
let stranicyVpered = [];
let poseshchennyeStranitsy = [];

const knopkaNazad = document.querySelector("#knopka-nazad");
const knopkaVpered = document.querySelector("#knopka-vpered");
const nadpisStranicy = document.querySelector("#tekushchaya-stranica");

const knopkaProSmotrennyh = document.querySelector("#knopka-pro-smotrennyh");
const knopkaOchistit = document.querySelector("#knopka-ochistit");
const soobshchenieIstorii = document.querySelector("#soobshchenie-istorii");
const spisokIstoriya = document.querySelector("#spisok-istoriya");
const tekstPolozheniya = document.querySelector("#tekst-polozheniya");
const podskazkaUkazateli = document.querySelector("#podskazka-ukazateli");

const holst = document.querySelector("#holst");
const kontekstHolsta = holst.getContext("2d");

const vyborCveta = document.querySelector("#vybor-cveta");
const polzunokTolshchina = document.querySelector("#polzunok-tolshchina");
const polzunokSkorost = document.querySelector("#polzunok-skorost");
const polzunokGravitaciya = document.querySelector("#polzunok-gravitaciya");
const knopkaPauza = document.querySelector("#knopka-pauza");
const knopkaOchistkaHolsta = document.querySelector("#knopka-ochistka-holsta");
const knopkaDobavitChasticu = document.querySelector("#knopka-dobavit-chasticu");
const knopkaProvodnik = document.querySelector("#knopka-provodnik");
const soobshchenieHolsta = document.querySelector("#soobshchenie-holsta");
const schetchikChastic = document.querySelector("#schetchik-chastic");

const polePredel = document.querySelector("#pole-predel");
const knopkaZapustit = document.querySelector("#knopka-zapustit");
const knopkaOstanovit = document.querySelector("#knopka-ostanovit");
const polosaProgressa = document.querySelector("#polosa-progressa");
const soobshchenieVorkera = document.querySelector("#soobshchenie-vorkera");
const oshibkaVorkera = document.querySelector("#oshibka-vorkera");
const blokRezultata = document.querySelector("#blok-rezultata");
const znachenieKolichestvo = document.querySelector("#znachenie-kolichestvo");
const znachenieVremya = document.querySelector("#znachenie-vremya");
const znacheniePoslednee = document.querySelector("#znachenie-poslednee");
const knopkaProverka = document.querySelector("#knopka-proverka");
const soobshchenieProverki = document.querySelector("#soobshchenie-proverki");

let risuemSeichas = false;
let chasticy = [];
let pauzaAnimacii = false;
let posledneeVremyaKadra = 0;
let provodnikVklyuchen = false;
let liniiNaHolste = [];


const palitraChastic = ["#4fa3e3", "#e0705f", "#6cc070", "#e3b341", "#a58cf0", "#48b8a8"];

let vorkerDlyaVychisleniy = null;
let vychisleniyaIdut = false;
let kolichestvoNazhatiy = 0;
let animaciyaZapushchena = false;

function uznatStranicu() {
  const znachenie = window.location.hash.replace("#", "").trim();

  if (znachenie === "") {
    return "domashnyaya";
  }

  if (stranicy.indexOf(znachenie) === -1) {
    return null;
  }

  return znachenie;
}

function pokazatStranicu() {
  const vseElementy = document.querySelectorAll(".stranica");

  vseElementy.forEach(function (element) {
    const imyaElementa = element.id.replace("stranica-", "");

    if (imyaElementa === imyaTekushcheyStranicy) {
      element.classList.add("aktualnaya-stranica");
    } else {
      element.classList.remove("aktualnaya-stranica");
    }
  });

  nadpisStranicy.textContent = "Текущая страница: " + nazvaniyaStranic[imyaTekushcheyStranicy];
  document.title = nazvaniyaStranic[imyaTekushcheyStranicy] + " | HTML5 API";
}

function obnovitKnopki() {
  if (stranicyNazad.length > 1) {
    knopkaNazad.disabled = false;
  } else {
    knopkaNazad.disabled = true;
  }

  if (stranicyVpered.length > 0) {
    knopkaVpered.disabled = false;
  } else {
    knopkaVpered.disabled = true;
  }
}

function obnovitVid() {
  pokazatStranicu();
  obnovitKnopki();
  pokazatSpisokIstorii();
  pokazatPolozhenie();
}

function sohranitPoseshchennye() {
  try {
    sessionStorage.setItem("poseshchennye-stranitsy", JSON.stringify(poseshchennyeStranitsy));
  } catch (oshibka) {}
}

function zapomnitsStranicu(imyaStranicy) {
  if (poseshchennyeStranitsy.indexOf(imyaStranicy) === -1) {
    poseshchennyeStranitsy.push(imyaStranicy);
    sohranitPoseshchennye();
  }
}

function zagruzitPoseshchennye() {
  try {
    const sohranennye = JSON.parse(sessionStorage.getItem("poseshchennye-stranitsy"));

    if (Array.isArray(sohranennye) && sohranennye.length > 0) {
      poseshchennyeStranitsy = sohranennye.filter(function (imya) {
        return stranicy.indexOf(imya) !== -1;
      });
    }
  } catch (oshibka) {}

  if (poseshchennyeStranitsy.length === 0) {
    poseshchennyeStranitsy = [imyaTekushcheyStranicy];
    sohranitPoseshchennye();
  }
}

function pokazatSpisokIstorii() {
  spisokIstoriya.innerHTML = "";

  poseshchennyeStranitsy.forEach(function (imyaStranicy) {
    const punktSpiska = document.createElement("li");
    punktSpiska.textContent = nazvaniyaStranic[imyaStranicy];

    if (imyaStranicy === imyaTekushcheyStranicy) {
      punktSpiska.classList.add("tekushchaya");
      punktSpiska.textContent = punktSpiska.textContent + " (открыта сейчас)";
    }

    spisokIstoriya.appendChild(punktSpiska);
  });
}

function pokazatPolozhenie() {
  let nazvanie = nazvaniyaStranic[imyaTekushcheyStranicy];

  tekstPolozheniya.textContent = "Открыта страница: " + nazvanie +
    ", назад можно шагов: " + (stranicyNazad.length - 1) +
    ", вперед можно шагов: " + stranicyVpered.length + ".";

  podskazkaUkazateli.textContent = "Длина истории браузера: " + window.history.length +
    ", в адресе: " + (window.location.hash || "#domashnyaya");
}

function poluchitSostoyanieIstorii() {
  return {
    stack: stranicyNazad.concat(stranicyVpered),
    ukazatel: stranicyNazad.length - 1
  };
}

function zapisatSostoyanieIstorii(stack, ukazatel, zamenit) {
  const parametry = {
    stranica: stack[ukazatel],
    stack: stack.slice(),
    ukazatel: ukazatel
  };

  if (zamenit === true) {
    window.history.replaceState(parametry, "", "#" + parametry.stranica);
  } else {
    window.history.pushState(parametry, "", "#" + parametry.stranica);
  }
}

function primenitSostoyanieIstorii(parametry) {
  if (parametry === null || typeof parametry !== "object" ||
      Array.isArray(parametry.stack) === false || parametry.stack.length === 0) {
    return false;
  }

  let ukazatel = parametry.ukazatel;

  if (typeof ukazatel !== "number" || ukazatel < 0 || ukazatel >= parametry.stack.length) {
    ukazatel = parametry.stack.length - 1;
  }

  stranicyNazad = parametry.stack.slice(0, ukazatel + 1);
  stranicyVpered = parametry.stack.slice(ukazatel + 1);
  imyaTekushcheyStranicy = stranicyNazad[ukazatel];

  zapomnitsStranicu(imyaTekushcheyStranicy);
  obnovitVid();
  return true;
}

function pereytiNaStranicu(imyaStranicy) {
  if (imyaStranicy === imyaTekushcheyStranicy) {
    return;
  }

  const tekushchee = poluchitSostoyanieIstorii();
  const novyyUkazatel = tekushchee.ukazatel + 1;
  const novyyStack = tekushchee.stack.slice(0, novyyUkazatel);

  novyyStack.push(imyaStranicy);

  zapisatSostoyanieIstorii(novyyStack, tekushchee.ukazatel, true);
  zapisatSostoyanieIstorii(novyyStack, novyyUkazatel, false);
  primenitSostoyanieIstorii({ stack: novyyStack, ukazatel: novyyUkazatel });
  soobshchenieIstorii.textContent = "";
}

function shagNazad() {
  if (stranicyNazad.length < 2) {
    soobshchenieIstorii.textContent = "Предыдущих записей в истории нет.";
    return;
  }

  window.history.back();
}

function shagVpered() {
  if (stranicyVpered.length === 0) {
    soobshchenieIstorii.textContent = "Следующих записей в истории нет.";
    return;
  }

  window.history.forward();
}

function obrabotatPerehodBrauzera(sobytie) {
  const staryyUkazatel = stranicyNazad.length - 1;

  if (primenitSostoyanieIstorii(sobytie.state) === true) {
    const novyyUkazatel = stranicyNazad.length - 1;

    if (novyyUkazatel < staryyUkazatel) {
      soobshchenieIstorii.textContent = "Переход назад: " + nazvaniyaStranic[imyaTekushcheyStranicy] + ".";
    } else if (novyyUkazatel > staryyUkazatel) {
      soobshchenieIstorii.textContent = "Переход вперед: " + nazvaniyaStranic[imyaTekushcheyStranicy] + ".";
    } else {
      soobshchenieIstorii.textContent = "Переход через кнопки браузера: " + nazvaniyaStranic[imyaTekushcheyStranicy] + ".";
    }

    return;
  }

  const stranicaIzAdresa = uznatStranicu();

  if (stranicaIzAdresa === null) {
    return;
  }

  const stack = [stranicaIzAdresa];

  zapisatSostoyanieIstorii(stack, 0, true);
  primenitSostoyanieIstorii({ stack: stack, ukazatel: 0 });
  soobshchenieIstorii.textContent = "Переход через кнопки браузера: " + nazvaniyaStranic[imyaTekushcheyStranicy] + ".";
}


function razmerHolsta() {
  const ramka = holst.getBoundingClientRect();
  const plotnost = window.devicePixelRatio || 1;
  const novayaShirina = Math.round(ramka.width * plotnost);
  const novayaVysota = Math.round(ramka.height * plotnost);

  if (novayaShirina === 0 || novayaVysota === 0) {
    return;
  }

  holst.width = novayaShirina;
  holst.height = novayaVysota;
}

function masshtab() {
  const ramka = holst.getBoundingClientRect();

  if (ramka.width === 0) {
    return 1;
  }

  return holst.width / ramka.width;
}

function sozdatChasticu(gotovaya) {
  if (gotovaya) {
    chasticy.push(gotovaya);
    pokazatSchetchik();
    return;
  }

  chasticy.push({
    x: holst.width * (0.15 + Math.random() * 0.7),
    y: holst.height * (0.1 + Math.random() * 0.4),
    radius: (16 + Math.random() * 22) * masshtab(),
    skorostX: (Math.random() - 0.5) * 3,
    skorostY: (Math.random() - 0.5) * 3,
    cvet: palitraChastic[Math.floor(Math.random() * palitraChastic.length)],
    forma: Math.random() < 0.5 ? "krug" : "kvadrat",
    ugol: Math.random() * Math.PI,
    vrashchenie: (Math.random() - 0.5) * 0.04,
    iskra: false,
    zhizn: 1
  });

  pokazatSchetchik();
}

function pokazatSchetchik() {
  schetchikChastic.textContent = "Объектов на холсте: " + chasticy.length +
    ", линий: " + liniiNaHolste.length;
}

function poluchitTochku(sobytie) {
  const ramka = holst.getBoundingClientRect();
  const koefficient = masshtab();

  return {
    x: (sobytie.clientX - ramka.left) * koefficient,
    y: (sobytie.clientY - ramka.top) * koefficient
  };
}

function nachatLiniyu(sobytie) {
  const tochka = poluchitTochku(sobytie);
  const novayaLiniya = [tochka];

  novayaLiniya.cvet = vyborCveta.value;
  novayaLiniya.tolshchina = Number(polzunokTolshchina.value) * masshtab();

  liniiNaHolste.push(novayaLiniya);

  risuemSeichas = true;
  soobshchenieHolsta.textContent = "Начата новая линия.";
}

function prodolzhitLiniyu(sobytie) {
  const tochka = poluchitTochku(sobytie);

  if (risuemSeichas === false) {
    return;
  }

  const liniya = liniiNaHolste[liniiNaHolste.length - 1];
  const proshlaya = liniya[liniya.length - 1];

  liniya.push(tochka);

  const rasstoyanie = Math.sqrt(
    (tochka.x - proshlaya.x) * (tochka.x - proshlaya.x) +
    (tochka.y - proshlaya.y) * (tochka.y - proshlaya.y)
  );

  if (provodnikVklyuchen === true && rasstoyanie > 8 * masshtab()) {
    otpravitIskru(proshlaya, tochka);
  }
}

function zakonchitLiniyu() {
  if (risuemSeichas === true) {
    soobshchenieHolsta.textContent = "Линия добавлена на холст.";
    pokazatSchetchik();
  }

  risuemSeichas = false;
}

function otpravitIskru(otkuda, kuda) {
  const ugly = Math.atan2(kuda.y - otkuda.y, kuda.x - otkuda.x);

  chasticy.push({
    iskra: true,
    x: otkuda.x,
    y: otkuda.y,
    radius: (2 + Math.random() * 4) * masshtab(),
    skorostX: Math.cos(ugly) * 3 + (Math.random() - 0.5) * 3,
    skorostY: Math.sin(ugly) * 3 + (Math.random() - 0.5) * 3,
    zhizn: 1,
    cvet: vyborCveta.value,
    forma: "iskra",
    ugol: 0,
    vrashchenie: 0
  });
}

function dvigatChasticy(mnozhitel) {
  const sila = Number(polzunokGravitaciya.value) / 100;

  chasticy.forEach(function (chastica) {
    if (chastica.iskra === true) {
      chastica.x = chastica.x + chastica.skorostX * mnozhitel;
      chastica.y = chastica.y + chastica.skorostY * mnozhitel;
      chastica.skorostY = chastica.skorostY + 0.12 * mnozhitel;
      chastica.zhizn = chastica.zhizn - 0.035 * mnozhitel;

      if (chastica.zhizn < 0) {
        chastica.zhizn = 0;
      }

      return;
    }

    chastica.skorostY = chastica.skorostY + sila * mnozhitel;
    chastica.x = chastica.x + chastica.skorostX * mnozhitel;
    chastica.y = chastica.y + chastica.skorostY * mnozhitel;
    chastica.ugol = chastica.ugol + chastica.vrashchenie * mnozhitel;

    if (chastica.x - chastica.radius < 0) {
      chastica.x = chastica.radius;
      chastica.skorostX = Math.abs(chastica.skorostX) * 0.92;
    }

    if (chastica.x + chastica.radius > holst.width) {
      chastica.x = holst.width - chastica.radius;
      chastica.skorostX = -Math.abs(chastica.skorostX) * 0.92;
    }

    if (chastica.y - chastica.radius < 0) {
      chastica.y = chastica.radius;
      chastica.skorostY = Math.abs(chastica.skorostY) * 0.92;
    }

    if (chastica.y + chastica.radius > holst.height) {
      chastica.y = holst.height - chastica.radius;
      chastica.skorostY = -Math.abs(chastica.skorostY) * 0.86;
    }
  });
}

function ubratUmeravshie() {
  const zhivye = [];

  chasticy.forEach(function (chastica) {
    if (chastica.iskra === true && chastica.zhizn <= 0) {
      return;
    }

    zhivye.push(chastica);
  });

  chasticy = zhivye;
}

function pririsovatFon() {
  kontekstHolsta.fillStyle = "#1b2430";
  kontekstHolsta.fillRect(0, 0, holst.width, holst.height);

  const shag = 40 * masshtab();

  kontekstHolsta.strokeStyle = "rgba(255, 255, 255, 0.06)";
  kontekstHolsta.lineWidth = 1;
  kontekstHolsta.beginPath();

  for (let x = 0; x < holst.width; x = x + shag) {
    kontekstHolsta.moveTo(x, 0);
    kontekstHolsta.lineTo(x, holst.height);
  }

  for (let y = 0; y < holst.height; y = y + shag) {
    kontekstHolsta.moveTo(0, y);
    kontekstHolsta.lineTo(holst.width, y);
  }

  kontekstHolsta.stroke();
}

function pririsovatLiniyu(liniya) {
  if (liniya.length < 2) {
    return;
  }

  kontekstHolsta.beginPath();
  kontekstHolsta.moveTo(liniya[0].x, liniya[0].y);

  for (let i = 1; i < liniya.length - 1; i++) {
    const seredinaX = (liniya[i].x + liniya[i + 1].x) / 2;
    const seredinaY = (liniya[i].y + liniya[i + 1].y) / 2;

    kontekstHolsta.quadraticCurveTo(liniya[i].x, liniya[i].y, seredinaX, seredinaY);
  }

  const poslednyaya = liniya[liniya.length - 1];

  kontekstHolsta.lineTo(poslednyaya.x, poslednyaya.y);
  kontekstHolsta.strokeStyle = liniya.cvet;
  kontekstHolsta.lineWidth = liniya.tolshchina;
  kontekstHolsta.lineCap = "round";
  kontekstHolsta.lineJoin = "round";
  kontekstHolsta.stroke();
}

function pririsovatChasticu(chastica) {
  kontekstHolsta.globalAlpha = chastica.zhizn;
  kontekstHolsta.fillStyle = chastica.cvet;

  if (chastica.forma === "iskra") {
    kontekstHolsta.beginPath();
    kontekstHolsta.arc(chastica.x, chastica.y, chastica.radius * chastica.zhizn, 0, Math.PI * 2);
    kontekstHolsta.fill();
    kontekstHolsta.globalAlpha = 1;
    return;
  }

  if (chastica.forma === "kvadrat") {
    kontekstHolsta.save();
    kontekstHolsta.translate(chastica.x, chastica.y);
    kontekstHolsta.rotate(chastica.ugol);
    kontekstHolsta.fillRect(-chastica.radius, -chastica.radius, chastica.radius * 2, chastica.radius * 2);
    kontekstHolsta.restore();
    kontekstHolsta.globalAlpha = 1;
    return;
  }

  kontekstHolsta.beginPath();
  kontekstHolsta.arc(chastica.x, chastica.y, chastica.radius, 0, Math.PI * 2);
  kontekstHolsta.fill();
  kontekstHolsta.globalAlpha = 1;
}

function pririsovatSoedineniya() {
  const shary = [];
  const radius = 150 * masshtab();

  chasticy.forEach(function (chastica) {
    if (chastica.iskra !== true) {
      shary.push(chastica);
    }
  });

  for (let i = 0; i < shary.length; i++) {
    for (let j = i + 1; j < shary.length; j++) {
      const raznicaX = shary[i].x - shary[j].x;
      const raznicaY = shary[i].y - shary[j].y;
      const rasstoyanie = Math.sqrt(raznicaX * raznicaX + raznicaY * raznicaY);

      if (rasstoyanie > radius) {
        continue;
      }

      kontekstHolsta.beginPath();
      kontekstHolsta.moveTo(shary[i].x, shary[i].y);
      kontekstHolsta.lineTo(shary[j].x, shary[j].y);
      kontekstHolsta.strokeStyle = "rgba(255, 255, 255, " + (0.22 * (1 - rasstoyanie / radius)) + ")";
      kontekstHolsta.lineWidth = 1 * masshtab();
      kontekstHolsta.stroke();
    }
  }
}


function najtiChasticuPodMyshkoj(sobytie) {
  const tochka = poluchitTochku(sobytie);
  let najdennaya = null;

  chasticy.forEach(function (chastica) {
    if (chastica.iskra === true) {
      return;
    }

    const raznicaX = chastica.x - tochka.x;
    const raznicaY = chastica.y - tochka.y;
    const rasstoyanie = Math.sqrt(raznicaX * raznicaX + raznicaY * raznicaY);

    if (rasstoyanie < chastica.radius + 10 * masshtab()) {
      najdennaya = chastica;
    }
  });

  return najdennaya;
}

function uvelichitChasticu(sobytie) {
  const najdennaya = najtiChasticuPodMyshkoj(sobytie);

  if (najdennaya === null) {
    return;
  }

  najdennaya.radius = najdennaya.radius * 1.18;
  soobshchenieHolsta.textContent = "Радиус выбранного шара увеличен.";
}

function narisovatKadr(tekushcheeVremya) {
  let raznica = 0;

  if (posledneeVremyaKadra !== 0) {
    raznica = Math.min(tekushcheeVremya - posledneeVremyaKadra, 40);
  }

  posledneeVremyaKadra = tekushcheeVremya;

  const mnozhitel = (raznica / 16) * (Number(polzunokSkorost.value) / 40);

  if (pauzaAnimacii === false && mnozhitel > 0) {
    dvigatChasticy(mnozhitel);
    ubratUmeravshie();
  }

  pririsovatFon();
  pririsovatSoedineniya();

  liniiNaHolste.forEach(function (liniya) {
    pririsovatLiniyu(liniya);
  });

  chasticy.forEach(function (chastica) {
    pririsovatChasticu(chastica);
  });


  requestAnimationFrame(narisovatKadr);
}

function zapustitAnimaciyu() {
  if (animaciyaZapushchena === true) {
    return;
  }

  razmerHolsta();

  if (holst.width === 300) {
    setTimeout(zapustitAnimaciyu, 50);
    return;
  }

  posledneeVremyaKadra = 0;

  for (let i = 0; i < 8; i++) {
    sozdatChasticu(null);
  }

  animaciyaZapushchena = true;
  requestAnimationFrame(narisovatKadr);
}

function perezapustitRisunok() {
  razmerHolsta();
  zapustitAnimaciyu();
}

function poluchitPredel() {
  const znachenie = Number(polePredel.value);

  if (isNaN(znachenie) || znachenie < 1000) {
    oshibkaVorkera.textContent = "Минимальное значение: 1000.";
    return null;
  }

  if (znachenie > 30000000) {
    oshibkaVorkera.textContent = "Максимальное значение: 30000000.";
    return null;
  }

  return Math.round(znachenie);
}

function pokazatRezultat(dannye) {
  blokRezultata.hidden = false;
  znachenieKolichestvo.textContent = dannye.kolichestvo;
  znachenieVremya.textContent = Math.round(dannye.vremya);
  znacheniePoslednee.textContent = dannye.poslednee;
  polosaProgressa.style.width = "100%";
  soobshchenieVorkera.textContent = "Вычисления завершены.";
}

function zakonchitVorker() {
  vychisleniyaIdut = false;

  if (vorkerDlyaVychisleniy !== null) {
    vorkerDlyaVychisleniy.terminate();
    vorkerDlyaVychisleniy = null;
  }

  knopkaZapustit.disabled = false;
  knopkaOstanovit.disabled = true;
}

function zapustitVychisleniya() {
  if (vychisleniyaIdut === true) {
    return;
  }

  oshibkaVorkera.textContent = "";

  const predel = poluchitPredel();

  if (predel === null) {
    return;
  }

  try {
    vorkerDlyaVychisleniy = new Worker("worker.js");
  } catch (oshibka) {
    oshibkaVorkera.textContent = "Не удалось запустить воркер. Откройте страницу через локальный сервер.";
    return;
  }

  vychisleniyaIdut = true;
  knopkaZapustit.disabled = true;
  knopkaOstanovit.disabled = false;
  blokRezultata.hidden = true;
  polosaProgressa.style.width = "0%";
  soobshchenieVorkera.textContent = "Воркер запущен, идут вычисления.";

  vorkerDlyaVychisleniy.onmessage = function (sobytieVorkera) {
    const dannye = sobytieVorkera.data;

    if (dannye.tip === "progress") {
      polosaProgressa.style.width = dannye.procent + "%";
      soobshchenieVorkera.textContent = "Проверено " + dannye.tekushchiy + " из " +
        dannye.predel + " чисел (" + dannye.procent + "%).";
    }

    if (dannye.tip === "result") {
      pokazatRezultat(dannye);
      zakonchitVorker();
    }

    if (dannye.tip === "otmena") {
      soobshchenieVorkera.textContent = "Вычисления остановлены.";
      zakonchitVorker();
    }

    if (dannye.tip === "oshibka") {
      oshibkaVorkera.textContent = "Ошибка в воркере: " + dannye.tekst;
      zakonchitVorker();
    }
  };

  vorkerDlyaVychisleniy.onerror = function (sobytieOshibki) {
    oshibkaVorkera.textContent = "Ошибка в воркере: " + sobytieOshibki.message;
    zakonchitVorker();
  };

  vorkerDlyaVychisleniy.postMessage({ predel: predel });
}

function ostanovitVychisleniya() {
  if (vychisleniyaIdut === false) {
    return;
  }

  zakonchitVorker();
  soobshchenieVorkera.textContent = "Вычисления остановлены.";
}

function proveritOtzivchivost() {
  kolichestvoNazhatiy = kolichestvoNazhatiy + 1;
  soobshchenieProverki.textContent = "Нажатий: " + kolichestvoNazhatiy + ". Главный поток не заблокирован.";
}

document.querySelectorAll(".razdel").forEach(function (ssylka) {
  ssylka.addEventListener("click", function (sobytie) {
    sobytie.preventDefault();
    pereytiNaStranicu(ssylka.getAttribute("href").replace("#", ""));
  });
});

knopkaNazad.addEventListener("click", shagNazad);
knopkaVpered.addEventListener("click", shagVpered);
window.addEventListener("popstate", obrabotatPerehodBrauzera);

knopkaProSmotrennyh.addEventListener("click", function () {
  pokazatSpisokIstorii();
  soobshchenieIstorii.textContent = "Список открытых страниц обновлен.";
});

knopkaOchistit.addEventListener("click", function () {
  const stack = [imyaTekushcheyStranicy];

  poseshchennyeStranitsy = [imyaTekushcheyStranicy];
  sohranitPoseshchennye();
  zapisatSostoyanieIstorii(stack, 0, true);
  primenitSostoyanieIstorii({ stack: stack, ukazatel: 0 });
  soobshchenieIstorii.textContent = "Список раздела сброшен.";
});

holst.addEventListener("mousedown", nachatLiniyu);
holst.addEventListener("mousemove", function (sobytie) {
  prodolzhitLiniyu(sobytie);
});
holst.addEventListener("mouseup", zakonchitLiniyu);
holst.addEventListener("mouseleave", function () {
  zakonchitLiniyu();
});
holst.addEventListener("dblclick", uvelichitChasticu);

knopkaPauza.addEventListener("click", function () {
  pauzaAnimacii = !pauzaAnimacii;
  knopkaPauza.textContent = pauzaAnimacii ? "Продолжить" : "Пауза";
});

knopkaOchistkaHolsta.addEventListener("click", function () {
  liniiNaHolste = [];
  chasticy = [];
  pokazatSchetchik();
  soobshchenieHolsta.textContent = "Холст очищен.";
});

knopkaDobavitChasticu.addEventListener("click", function () {
  sozdatChasticu(null);
  soobshchenieHolsta.textContent = "Добавлен новый объект.";
});

knopkaProvodnik.addEventListener("click", function () {
  provodnikVklyuchen = !provodnikVklyuchen;
  knopkaProvodnik.textContent = provodnikVklyuchen ? "Проводник: включен" : "Проводник";
  soobshchenieHolsta.textContent = provodnikVklyuchen
    ? "Режим искр включен."
    : "Режим искр выключен.";
});

knopkaZapustit.addEventListener("click", zapustitVychisleniya);
knopkaOstanovit.addEventListener("click", ostanovitVychisleniya);
knopkaProverka.addEventListener("click", proveritOtzivchivost);

window.addEventListener("resize", function () {
  razmerHolsta();
});

const stranicaIzAdresa = uznatStranicu();

if (stranicaIzAdresa !== null) {
  imyaTekushcheyStranicy = stranicaIzAdresa;
}

const sostoyaniePriZagruzke = window.history.state;
let stackPriZagruzke = [imyaTekushcheyStranicy];
let ukazatelPriZagruzke = 0;

if (sostoyaniePriZagruzke !== null && typeof sostoyaniePriZagruzke === "object" &&
    Array.isArray(sostoyaniePriZagruzke.stack) &&
    sostoyaniePriZagruzke.stack.indexOf(imyaTekushcheyStranicy) !== -1) {
  stackPriZagruzke = sostoyaniePriZagruzke.stack.slice();

  const kandidat = sostoyaniePriZagruzke.ukazatel;

  if (typeof kandidat === "number" && kandidat >= 0 &&
      kandidat < stackPriZagruzke.length &&
      stackPriZagruzke[kandidat] === imyaTekushcheyStranicy) {
    ukazatelPriZagruzke = kandidat;
  } else {
    ukazatelPriZagruzke = stackPriZagruzke.lastIndexOf(imyaTekushcheyStranicy);
  }
}

zagruzitPoseshchennye();
zapisatSostoyanieIstorii(stackPriZagruzke, ukazatelPriZagruzke, true);
primenitSostoyanieIstorii({ stack: stackPriZagruzke, ukazatel: ukazatelPriZagruzke });
setTimeout(perezapustitRisunok, 0);