const ring = document.getElementById("ring");
const RADIUS = 160;
const CENTER = 240;
const ANSWER = "ORGANKLEASHOUTTERR".split("");
const AVAILABLE_LETTERS = ANSWER; 
const WORD1 = "ORGAN";
const WORD2 = "ANKLE";
const WORD3 = "LEASH";
const WORD4 = "SHOUT";
const WORD5 = "UTTER";
const WORD6 = "ERROR";
const WORD_LIST = [WORD1, WORD2, WORD3, WORD4, WORD5, WORD6];

// Gets list of correct three letter combinations from words 
const PARTIALS_LIST = [];


// Jumbles up letters 
const LETTERS = [];
for (let a = 0; a < 18; a++) {
  let i = Math.floor(Math.random() * AVAILABLE_LETTERS.length);
  let r = AVAILABLE_LETTERS[i];
  AVAILABLE_LETTERS.splice(i, 1);
  LETTERS.push(r); 
}

let items = [];
let dragging = null;

// Create elements
LETTERS.forEach((letter, i) => {
  const el = document.createElement("div");
  el.className = "cell";
  el.textContent = letter;
  el.dataset.index = i;
  ring.appendChild(el);
  items.push(el);
});

// Position items around circle
function layout() {
  items.forEach((el, i) => {
    const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2;
    const x = CENTER + Math.cos(angle) * RADIUS - 24;
    const y = CENTER + Math.sin(angle) * RADIUS - 24;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
}

layout();
colour();

// Helpers
function angleFromCenter(x, y) {
  return Math.atan2(y - CENTER, x - CENTER);
}

function indexFromAngle(angle) {
  const a = (angle + Math.PI * 2 + Math.PI / 2) % (Math.PI * 2);
  return Math.round(a / (Math.PI * 2) * items.length) % items.length;
}

// Colour-coding https://www.123freevectors.com/color/4cafef/
function colour() {
  // Gets current order of letters 
  const this_letter_order = []; 
  items.forEach((el, i) => {
    const this_letter = el.textContent;
    this_letter_order.push(this_letter);
  });
  const this_letter_order_twice = this_letter_order + `,` + this_letter_order; 
  const this_letter_order_twice_with_commas = this_letter_order_twice.toString(); 
  const this_letter_order_twice_STRING = this_letter_order_twice_with_commas.replace(/,/g, "");
  // Checks if word is in current arrangement of letters 
  let WORDS_FOUND = 0; 
  let indices_of_words_found = [];
  let indices_of_partials_found = [];
  for (let j = 0; j < 6; j++) {
    const word = WORD_LIST[j]; 
    let firstPartial = word.slice(0,3);
    let secondPartial = word.slice(1,4); 
    let thirdPartial = word.slice(2,5); 
    const included = this_letter_order_twice_STRING.includes(word);
    const included1 = this_letter_order_twice_STRING.includes(firstPartial);
    const included2 = this_letter_order_twice_STRING.includes(secondPartial);
    const included3 = this_letter_order_twice_STRING.includes(thirdPartial);
    if (included) {
      let new_total = WORDS_FOUND++;
      const index_of_first_letter = this_letter_order_twice_STRING.indexOf(word); 
      for (k = 0; k < 5; k++) {
        const this_raw_index = index_of_first_letter + k;
        const this_index = null;
        if (this_raw_index > 17) {
          const this_index = this_raw_index - 18;
          indices_of_words_found.push(this_index);
        } else {
          indices_of_words_found.push(this_raw_index);}
      } 
    } else if (included1 || included2 || included3) {
      list_of_truth_conditions = [included1, included2, included3];
      list_of_partials = [firstPartial, secondPartial, thirdPartial];
      for (p = 0; p < 3; p++) {
        if (list_of_truth_conditions[p]) {
          const index_of_first_letter = this_letter_order_twice_STRING.indexOf(list_of_partials[p]); 
          for (k = 0; k < 3; k++) {
            const this_raw_index = index_of_first_letter + k;
            const this_index = null;
            if (this_raw_index > 17) {
              const this_index = this_raw_index - 18;
              indices_of_partials_found.push(this_index);
            } else {
              indices_of_partials_found.push(this_raw_index);
            }
          }
        }
      }
    } else {
      continue;
    }
    console.log();
    items.forEach((el, i) => {
      el.classList.remove("correct");
      el.classList.remove("warm");
      if (indices_of_words_found.includes(i)) {
        el.classList.add("correct");
      } else if (indices_of_partials_found.includes(i)) {
        el.classList.add("warm");
      }
    });
    if (WORDS_FOUND==6) {
      launchConfetti();
  }
  }
}

// Drag logic
items.forEach(el => {
  el.addEventListener("pointerdown", e => {
    dragging = el;
    el.classList.add("dragging");
    el.setPointerCapture(e.pointerId);
  });

  el.addEventListener("pointermove", e => {
    if (!dragging) return;

    const rect = ring.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.transform = `translate(${x - 24}px, ${y - 24}px)`;

    const angle = angleFromCenter(x, y);
    const newIndex = indexFromAngle(angle);
    const oldIndex = items.indexOf(el);

    if (newIndex !== oldIndex) {
      items.splice(oldIndex, 1);
      items.splice(newIndex, 0, el);
      layout();
    }
  });

  el.addEventListener("pointerup", () => {
    dragging.classList.remove("dragging");
    dragging = null;
    layout();
  });
});

addEventListener("pointerup", () => {
  colour();
});

let confettiInterval;
let running = false;

const colors = ["#e74c3c", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#e67e22"];

function launchConfetti() {
  confettiInterval = setInterval(() => {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 250 + 100;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    confetti.style.setProperty("--x", `${x}px`);
    confetti.style.setProperty("--y", `${y}px`);

    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    confetti.style.left = "50vw";
    confetti.style.top = "50vh";

    const size = Math.random() * 8 + 4;
    confetti.style.width = confetti.style.height = `${size}px`;

    confetti.style.animationDuration = `${1.2 + Math.random()}s`;

    document.body.appendChild(confetti);

    confetti.addEventListener("animationend", () => confetti.remove());
  }, 40);
}
