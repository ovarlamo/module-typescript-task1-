type SoundButton = HTMLButtonElement & {
  dataset: DOMStringMap & {
    audio: string;
    background: string;
  };
};

const buttons = Array.from(document.querySelectorAll<SoundButton>('.sound-button'));
const volumeControl = document.querySelector<HTMLInputElement>('#volume-control');

if (!volumeControl) {
  throw new Error('Volume control not found');
}

const audioByButton = new Map<SoundButton, HTMLAudioElement>();

for (const button of buttons) {
  const audio = new Audio(button.dataset.audio);
  audio.loop = true;
  audio.volume = Number(volumeControl.value);
  audioByButton.set(button, audio);
}

let activeButton: SoundButton | null = null;

const stopActiveSound = () => {
  if (!activeButton) {
    return;
  }

  const activeAudio = audioByButton.get(activeButton);
  if (activeAudio) {
    activeAudio.pause();
  }
  activeButton.classList.remove('active');
  activeButton = null;
};

const setBackground = (imagePath: string): void => {
  document.body.style.backgroundImage = `url('${imagePath}')`;
};

buttons.forEach((button) => {
  button.addEventListener('click', async () => {
    const selectedAudio = audioByButton.get(button);
    if (!selectedAudio) {
      return;
    }

    if (activeButton === button) {
      if (selectedAudio.paused) {
        await selectedAudio.play();
        button.classList.add('active');
      } else {
        selectedAudio.pause();
        button.classList.remove('active');
      }
      return;
    }

    stopActiveSound();
    setBackground(button.dataset.background);

    activeButton = button;
    button.classList.add('active');

    await selectedAudio.play();
  });
});

volumeControl.addEventListener('input', (event) => {
  const target = event.target as HTMLInputElement;
  const volume = Number(target.value);

  for (const audio of audioByButton.values()) {
    audio.volume = volume;
  }
});
