document.addEventListener('DOMContentLoaded', function () {
  const cellsBoard = document.querySelector('.cells-board');
  if (!cellsBoard) {
      console.error('Элемент .cells-board не найден.');
      return;
  }

  let originalState = cellsBoard.innerHTML;

  const trapsOptions = [1, 3, 5, 7];
  const trapsToStarsMapping = {
      1: 10,
      3: 5,
      5: 4,
      7: 3
  };
  let currentPresetIndex = 1; // По умолчанию выбран индекс 1 (значение 3)
  const trapsAmountElement = document.getElementById('trapsAmount');
  const prevPresetBtn = document.getElementById('prev_preset_btn');
  const nextPresetBtn = document.getElementById('next_preset_btn');

  function updateTrapsAmount() {
      if (trapsAmountElement) {
          trapsAmountElement.textContent = trapsOptions[currentPresetIndex];
      }
  }

  if (prevPresetBtn) {
      prevPresetBtn.addEventListener('click', function () {
          if (isCooldown) return; // Блокировка, если таймер активен
          if (currentPresetIndex > 0) {
              currentPresetIndex--;
              updateTrapsAmount();
          }
      });
  }
  if (nextPresetBtn) {
      nextPresetBtn.addEventListener('click', function () {
          if (isCooldown) return; // Блокировка, если таймер активен
          if (currentPresetIndex < trapsOptions.length - 1) {
              currentPresetIndex++;
              updateTrapsAmount();
          }
      });
  }
  updateTrapsAmount();

  const clickSound = document.getElementById('clickSound');
  const starSound = document.getElementById('starSound');

  const playButton = document.getElementById('playButton');
  const timerProgress = document.getElementById('timerProgress');
  const timerText = document.getElementById('timerText');
  let isCooldown = false;
  let isFirstSignal = true; // Флаг для первого сигнала

  let timerEndTime = localStorage.getItem('timerEndTime');
  if (timerEndTime) {
      timerEndTime = parseInt(timerEndTime);
      const currentTime = Date.now();
      if (currentTime < timerEndTime) {
          const timeLeft = Math.ceil((timerEndTime - currentTime) / 1000);
          startTimer(timeLeft);
      } else {
          localStorage.removeItem('timerEndTime');
      }
  }

  function startTimer(timeLeft) {
      playButton.disabled = true;
      isCooldown = true;

      // Блокируем кнопки переключения ловушек
      if (prevPresetBtn) prevPresetBtn.disabled = true;
      if (nextPresetBtn) nextPresetBtn.disabled = true;

      // Если это первый сигнал, показываем текст
      if (isFirstSignal) {
          timerText.textContent = 'Wait for the next signal...';
          isFirstSignal = false; // Сбрасываем флаг
      }

      const interval = setInterval(() => {
          timeLeft--;
          timerProgress.style.width = `${(15 - timeLeft) * (100 / 15)}%`;

          if (timeLeft <= 0) {
              clearInterval(interval);
              playButton.disabled = false;
              isCooldown = false;

              // Разблокируем кнопки переключения ловушек
              if (prevPresetBtn) prevPresetBtn.disabled = false;
              if (nextPresetBtn) nextPresetBtn.disabled = false;

              timerProgress.style.width = '0';
              timerText.textContent = 'Signal is ready!';
              localStorage.removeItem('timerEndTime');
          }
      }, 1000);

      localStorage.setItem('timerEndTime', Date.now() + timeLeft * 1000);
  }

  if (playButton) {
      playButton.addEventListener('click', function () {
          if (isCooldown) return;

          startTimer(15);

          cellsBoard.innerHTML = originalState;
          const cells = document.querySelectorAll('.cells-board .cell');

          const trapsAmount = parseInt(trapsAmountElement.textContent);
          const starsAmount = trapsToStarsMapping[trapsAmount] || 0;
          const starCells = [];

          while (starCells.length < starsAmount) {
              const randomIndex = Math.floor(Math.random() * cells.length);
              if (!starCells.includes(randomIndex)) {
                  starCells.push(randomIndex);
              }
          }

          starCells.forEach((index, i) => {
              setTimeout(() => {
                  const cell = cells[index];
                  cell.classList.add('cell-fade-out');

                  setTimeout(() => {
                      cell.innerHTML = '';
                      const newImg = document.createElement('img');
                      newImg.setAttribute('width', '40');
                      newImg.setAttribute('height', '40');
                      newImg.style.opacity = '0';
                      newImg.style.transform = 'scale(0)';
                      newImg.src = 'img/stars.svg';
                      newImg.classList.add('star-animation');
                      cell.appendChild(newImg);
                      setTimeout(() => {
                          newImg.classList.add('fade-in');
                          starSound.play();
                      }, 50);
                      cell.classList.remove('cell-fade-out');
                  }, 500);
              }, i * 650);
          });
      });
  }

  const menuButton = document.getElementById('menuButton');

  if (menuButton) {
      menuButton.addEventListener('click', function () {
          window.location.href = 'https://maxim378gaps.github.io/hall/'; // Замените на ваш URL
      });
  }

  function createStars() {
      const starsContainer = document.getElementById('stars-container');
      const starCount = 50;
      for (let i = 0; i < starCount; i++) {
          const star = document.createElement('div');
          star.classList.add('star');
          star.style.top = `${Math.random() * 100}%`;
          star.style.left = `${Math.random() * 100}%`;
          star.style.animationDelay = `${Math.random() * 2}s`;
          starsContainer.appendChild(star);
      }
  }

  createStars();
});