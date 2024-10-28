// Yanlış tahmin durumuna göre sıralı çizilecek öğeler
const hangmanParts = [
  ".base", ".pole", ".top-bar", ".rope", ".head",
  ".body", ".arm-left", ".arm-right", ".leg-left", ".leg-right"
];

// Kategori ve aşama bilgileri
const stages = [
  { level: 1, category: "meyveler", words: ["ELMA", "ARMUT", "MUZ", "KİVİ", "PORTAKAL"] },
  { level: 2, category: "hayvanlar", words: ["KEDİ", "KÖPEK", "ASLAN", "KAPLAN", "FİL"] },
    { level: 3, category: "araçlar", words: ["ARABA", "OTOBÜS", "BİSİKLET", "UÇAK", "GEMİ"] },
  { level: 4, category: "ülkeler", words: ["TÜRKİYE", "İTALYA", "İSPANYA", "JAPONYA", "BREZİLYA"] },
  { level: 5, category: "renkler", words: ["KIRMIZI", "MAVİ", "YEŞİL", "SARI", "TURUNCU"] },
  { level: 6, category: "sebzeler", words: ["DOMATES", "BİBER", "SALATALIK", "PIRASA", "ISPANAK"] },
  { level: 7, category: "sporlar", words: ["FUTBOL", "BASKETBOL", "TENİS", "YÜZME", "GOLF"] },
  { level: 8, category: "meslekler", words: ["DOKTOR", "MÜHENDİS", "ÖĞRETMEN", "POLİS", "HEMŞİRE"] },
  { level: 9, category: "çiçekler", words: ["GÜL", "PAPATYA", "MENEKŞE", "LALE", "KARANFİL"] },
  { level: 10, category: "mevsimler", words: ["İLKBAHAR", "YAZ", "SONBAHAR", "KIŞ"] }
];

let currentStageIndex = 0;
let currentWord = "";
let guessedLetters = [];
let wrongGuessCount = 0;
let score = 0;
let hintCount = 3;

// HTML öğeleri
const wordDisplay = document.getElementById("word-display");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const story = document.getElementById("story");
const levelDisplay = document.getElementById("level");
const scoreDisplay = document.getElementById("score");
const hintDisplay = document.getElementById("hint");

// Aşama başlatan fonksiyon
function startStage() {
  const stage = stages[currentStageIndex];
  currentWord = stage.words[Math.floor(Math.random() * stage.words.length)];
  guessedLetters = [];
  wrongGuessCount = 0;
  wordDisplay.innerHTML = "";
  message.textContent = "";
  story.textContent = `Kategori: ${stage.category}`;
  levelDisplay.textContent = stage.level;
  hideAllParts();
  generateWordDisplay();
  generateKeyboard();
}

// Tüm çizim elemanlarını gizler
function hideAllParts() {
  hangmanParts.forEach(part => document.querySelector(part).style.display = "none");
}

// Çizimleri adım adım gösterir
function showNextPart() {
  if (wrongGuessCount < hangmanParts.length) {
    document.querySelector(hangmanParts[wrongGuessCount]).style.display = "block";
  }
}

// Kelime görüntüsünü güncelleyen fonksiyon
function generateWordDisplay() {
  wordDisplay.innerHTML = currentWord
    .split("")
    .map(letter => guessedLetters.includes(letter) ? `<span class="letter-slot">${letter}</span>` : `<span class="letter-slot">_</span>`)
    .join("");
}

// Klavye butonlarını oluşturan fonksiyon
function generateKeyboard() {
  keyboard.innerHTML = "";
  "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("").forEach(letter => {
    const button = document.createElement("button");
    button.classList.add("key");
    button.textContent = letter;
    button.disabled = guessedLetters.includes(letter); // Eğer daha önce tahmin edildiyse buton disable olacak
    button.onclick = () => handleGuess(letter); // Tahmin fonksiyonunu çağırır
    keyboard.appendChild(button);
  });
}

// Tahmin edilen harfi işleyen fonksiyon
function handleGuess(letter) {
  guessedLetters.push(letter);
  const button = Array.from(document.querySelectorAll(".key")).find(btn => btn.textContent === letter);
  button.disabled = true;
  button.style.backgroundColor = "#FF7043"; // Yanlış tahminlerde rengi değiştir

  if (currentWord.includes(letter)) {
    generateWordDisplay();
    checkWin();
  } else {
    wrongGuessCount++;
    showNextPart();
    checkLose();
  }
}

// Oyuncunun kazanıp kazanmadığını kontrol eden fonksiyon
function checkWin() {
  if (currentWord.split("").every(letter => guessedLetters.includes(letter))) {
    message.textContent = "Tebrikler! Kazandınız 🎉";
    score += 10;  // Puan ekle
    scoreDisplay.textContent = `Puan: ${score}`;
    disableKeyboard();
    setTimeout(() => nextStage(), 1000); // Kısa bir geçiş efekti ile diğer aşamaya geç
  }
}

// Oyuncunun kaybedip kaybetmediğini kontrol eden fonksiyon
function checkLose() {
  if (wrongGuessCount >= hangmanParts.length) {
    endGame(`Üzgünüm, kaybettiniz. Kelime: ${currentWord}`);
  }
}

// Tüm klavye butonlarını devre dışı bırakan fonksiyon
function disableKeyboard() {
  document.querySelectorAll(".key").forEach(button => button.disabled = true);
}

// Sonraki aşamaya geçme fonksiyonu
function nextStage() {
  currentStageIndex++;
  if (currentStageIndex < stages.length) {
    startStage();
  } else {
    endGame("Harika! Tüm aşamaları geçtiniz! 🎉");
  }
}

// İpucu kullanma fonksiyonu
function useHint() {
  if (hintCount > 0) {
    hintCount--;
    hintDisplay.textContent = `💡 ${hintCount}`;

    // Açılmamış bir harfi bul ve tahminlere ekle
    const unrevealedLetters = currentWord.split("").filter(letter => !guessedLetters.includes(letter));
    if (unrevealedLetters.length > 0) {
      const hintLetter = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
      guessedLetters.push(hintLetter);
      generateWordDisplay();
      checkWin();
    }
  }
}

// Oyun bitiş ekranı
function endGame(messageText) {
  const endScreen = document.getElementById("end-screen");
  const endMessage = document.getElementById("end-message");
  endMessage.textContent = messageText;
  endScreen.style.display = "flex";
}

// Oyunu baştan başlatan fonksiyon
function resetGame() {
  const endScreen = document.getElementById("end-screen");
  endScreen.style.display = "none";
  currentStageIndex = 0;
  score = 0;
  hintCount = 3;
  scoreDisplay.textContent = `Puan: ${score}`;
  hintDisplay.textContent = `💡 ${hintCount}`;
  startStage();
}
window.useHint = useHint;
window.resetGame = resetGame;
// Oyunu başlatma fonksiyonunu çağırır
startStage();
