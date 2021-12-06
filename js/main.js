// Variables
let key = ["C", "D", "E", "F", "G", "A", "B"];
let keyboardMap = [
  '1','2','3','4','5','6','7','8','9','0',
  'Q','W','E','R','T','Y','U','I','O','P',
  'A','S','D','F','G', 'H','J','J','K','L',
  'Z','X','C','V','B','N'];

let song = {
  happyBirthday: [
    "G4","G4","A4",,"G4",,'C5',,"B4",,,,
    "G4","G4","A4",,"G4",,"D5","C5",,,,
    "G4","G4","G5",,"E5",,"C5",,"B4",,"A4",,
    "F5","F5","E5",,"C5",,"D5",,"C5"],
    jingleBells: [
      'B3',,'B3',,'B3',,,,'B3',,'B3',,'B3',,,,
      'B3',,'D4',,'G3',,'A3','B3',,,,,,
      'C4',,'C4',,'C4',,,,'C4','C4',,'B3',,'B3',,,,
      'B3','B3','B3',,'A3',,'A3',,'B3',,'A3',,,,'D4'
    ],
    superMario: [
      "E4","E4","E4",
      "C4","E4","G4","G3",
      "C4","G4","E3",
      "A3","B3",'A#3',"A3",
      'G3','E4','G4','A4',
      'F4','G4','E4','C4','D4','B3',
    ],
    aladdin: [
      'B3','A3','C4','B3','G3','D3',
      'B3',,'A3','C4',,'B3',,'G3','B3',,'A3',
      'A3','G3','B3',,'A3','F#3','A3','G3','F#3',
      'G3','E3','F#3','A3','G3',,'D3',
    ]
}
let control_option = document.querySelectorAll('.control_option');

// Events
document.addEventListener("keyup",(e) => {
  pressKey("mouseup",e)
});

document.addEventListener("keydown",(e) => {
  if (e.repeat) {
    return;
  }
  pressKey("mousedown",e)
});

document.querySelector(".play").addEventListener("click" , () => {
  playSong(song[document.querySelector(".list_song").value], document.querySelector(".list_tempo").value);
  document.querySelector(".play").disabled = true;
})

// Functions
let createKey = (type, note, octave) => {
  let key = document.createElement("button");
  key.className = `p_key key-${type}`;
  key.dataset.letterNotes = type === "white" ? note + octave : note + "#" + octave;
  key.dataset.letterNotesFilesName = type === "white" ? note + octave : note + "s" + octave;
  key.textContent = key.dataset.letterNotes;
  key.addEventListener("mousedown", () => {
    playSound(key);
    key.classList.add("playing");
  });
  key.addEventListener("mouseup", () => {
    key.classList.remove("playing");
  })
  return key;
};

let pressKey = (mouseEvent , e) => {
  let key = e.code.substr(-1,1);
  let shiftK = e.shiftKey;
  let seletor;
  if (shiftK) {
    seletor = `[data-keyboard="⇧+${key}"]`
  } else {
    seletor = `[data-keyboard="${key}"]`
  }
  let keyP = document.querySelector(seletor);
  console.log(seletor,document.querySelector(seletor));
  if (keyP !== null) {
    let event = new Event(mouseEvent);
    keyP.dispatchEvent(event)
  }
}

let initKey = () => {
  for (let j = 1; j <= 5; j++) {
    for (let i = 0; i < 7; i++) {
      let keys = createKey("white", key[i], j);
      keys.dataset.keyboard = keyboardMap[i + [j - 1] * 7];
      document.querySelector(".keyboard").appendChild(keys);
      createKey("white", key[i], j).dataset.keyboard = keyboardMap[i + [j - 1] * 7]
      if (i !== 2 && i !== 6) {
        let keys = createKey("black", key[i], j);
        keys.dataset.keyboard = '⇧+' + keyboardMap[i + [j - 1] * 7];
        let empty = document.createElement("div");
        empty.classList.add("empty");
        document.querySelector(".keyboard").appendChild(empty);
        empty.appendChild(keys);
      }
    }
  }
};

let playSound = (key) => {
  let audio = document.createElement("audio");
  audio.src = "./sounds/" + key.dataset.letterNotesFilesName + ".mp3";
  audio.play().then(() => audio.remove());
};

let playSong = (song,tempo = 2) => {
  let num = 0;
  let eventD = new Event("mousedown");
  let eventU = new Event("mouseup");
  let btn;

  let interval = setInterval(() => {
    if (num <= song.length) {
      if (song[num] !== undefined) {
        if (btn) {
          btn.dispatchEvent(eventU);
        }
        btn = document.querySelector(`[data-letter-notes="${song[num]}"]`);
        btn.dispatchEvent(eventD);
        } 
      num++
    } else {
      btn.dispatchEvent(eventU);
      document.querySelector(".play").disabled = false;
      clearInterval(interval)
    }
  },100 * tempo)
}

control_option.forEach((input) => {
  input.addEventListener("input",() => {
    let keys = document.querySelectorAll(".p_key");
    let type ;
    keys.forEach((key) => {
      if (input.id === "Letter Notes") {
        type = 'letterNotes';
      } else if (input.id === "Keyborad") {
        type = 'keyboard';
      } else {
        type = ""
      }
      key.textContent = key.dataset[type]
    })
  })
})

initKey();