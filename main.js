// ---- Main "I am a ..." typewriter ----
const texts = [
  "Cyber Guy",
  "Web Developer",
  "Backend Developer",
  "Python Developer",
];

const typeSpeed = 50; // ms per character
const eraseSpeed = 50; // ms per character
const delayBetween = 500; // wait before erasing

let i = 0; // text index
let j = 0; // char index
let typing = true;

const typeDiv = document.getElementById("type");

function typeWriter() {
  if (typing) {
    if (j < texts[i].length) {
      typeDiv.textContent += texts[i].charAt(j);
      j++;
      setTimeout(typeWriter, typeSpeed);
    } else {
      typing = false;
      setTimeout(typeWriter, delayBetween);
    }
  } else {
    if (j > 0) {
      typeDiv.textContent = texts[i].substring(0, j - 1);
      j--;
      setTimeout(typeWriter, eraseSpeed);
    } else {
      typing = true;
      i = (i + 1) % texts.length;
      setTimeout(typeWriter, typeSpeed);
    }
  }
}

typeWriter(); // start main typewriter