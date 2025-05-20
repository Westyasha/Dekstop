(function() {
  let zIndexCounter = 1;
  const APP_URLS = {
      calculator: 'https://westyasha.github.io/calculator/',
      bio: 'https://westyasha.online',
      links: 'https://westyasha.github.io/links/',
      'rest-api': 'https://rest-api.space/',
      'phishing-viewer': 'https://phishing-topaz.vercel.app/' // Add URL for phishing-viewer
  };
  const video = document.getElementById('background-video');
  const spotifyWidget = document.querySelector('.spotify-widget');
  const overlay = document.getElementById('overlay');
  overlay.style.opacity = 0;

  function openApp(appId) {
      const windowsContainer = document.getElementById('windows-container');
      let windowElement = document.querySelector(`[data-window-app="${appId}"]`);

      if (windowElement) {
          // Проверяем, не открыто ли уже окно
          if (!windowElement.classList.contains('open')) {
              windowElement.classList.add('open');
              windowElement.style.zIndex = zIndexCounter++;
          }
          if (!overlay.classList.contains('active')) {
              overlay.classList.add('active');
          }
          overlay.style.pointerEvents = 'auto';
          return;
      }

      const newWindow = document.createElement('div');
      newWindow.classList.add('window');
      newWindow.setAttribute('data-window-app', appId);
      newWindow.style.zIndex = zIndexCounter++;

      let header = ``;
      let content = ``;
      let iframeUrl = '';

      switch (appId) {
          case 'calculator':
              header = `<div class="window-header">
                    <div style="flex: 1;cursor:pointer;" onclick="window.open('${APP_URLS[appId]}', '_blank')">Calculator</div>
                    <div class="close-button"></div>
                  </div>`;
              iframeUrl = APP_URLS[appId];
              break;
          case 'bio':
              header = `<div class="window-header">
                   <div style="flex: 1; cursor:pointer;" onclick="window.open('${APP_URLS[appId]}', '_blank')">Profile Card</div>
                    <div class="close-button"></div>
                  </div>`;
              iframeUrl = APP_URLS[appId];
              break;
          case 'links':
              header = `<div class="window-header">
         <div style="flex: 1;cursor:pointer;" onclick="window.open('${APP_URLS[appId]}', '_blank')">Links</div>
        <div class="close-button"></div>
        </div>`;
              iframeUrl = APP_URLS[appId];
              break;
          case 'rest-api':
              header = `<div class="window-header">
                    <div style="flex: 1;cursor:pointer;" onclick="window.open('${APP_URLS[appId]}', '_blank')">Rest-api</div>
                    <div class="close-button"></div>
                  </div>`;
              iframeUrl = APP_URLS[appId];
              break;
          case 'phishing-viewer': // Add case for phishing-viewer
              header = `<div class="window-header">
                    <div style="flex: 1;cursor:pointer;" onclick="window.open('${APP_URLS[appId]}', '_blank')">Phishing Viewer</div>
                    <div class="close-button"></div>
                  </div>`;
              iframeUrl = APP_URLS[appId];
              break;
          default:
              header = `<div class="window-header">
                    <div style="flex: 1;">${appId}</div>
                    <div class="close-button"></div>
                  </div>`;
              content = `<p>Window content for ${appId}...</p>`;
      }

      newWindow.innerHTML = header + `<div class="window-content"><iframe src="${iframeUrl}" frameborder="0" style="width: 100%; height: 100%;"></iframe></div>`;
      windowsContainer.appendChild(newWindow);

      // Добавляем обработчик события click на кнопку закрытия
      const closeButton = newWindow.querySelector('.close-button');
      closeButton.addEventListener('click', () => {
          closeWindow(closeButton);
      });

      if (!overlay.classList.contains('active')) {
          overlay.classList.add('active');
      }
      overlay.style.pointerEvents = 'auto';

      const dockItem = document.querySelector(`[data-app="${appId}"]`);
      if (dockItem) {
          dockItem.classList.add('active');
          setTimeout(() => dockItem.classList.remove('active'), 100);
      }

      setTimeout(() => newWindow.classList.add('open'), 10);
  }

  function closeWindow(element) {
      const windowElement = element.closest('.window');
      windowElement.classList.remove('open');

      // Добавляем снятие класса active с dock-item
      const appId = windowElement.getAttribute('data-window-app');
      const dockItem = document.querySelector(`.dock-item[data-app="${appId}"]`);
      if (dockItem) {
          dockItem.classList.remove('active');
      }

      let hasOpenWindows = document.querySelectorAll('.window.open').length > 0;
      if (!hasOpenWindows) {
          overlay.classList.remove('active');
          overlay.style.pointerEvents = 'none';
      }
  }

  function updateDateTime() {
    fetch('https://timeapi.io/api/Time/current/zone?timeZone=Europe/Moscow')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const currentTime = new Date(data.dateTime);
            const options = {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                year: 'numeric',
                timeZone: 'Europe/Moscow' // Указываем таймзону
            };
            const formattedTime = currentTime.toLocaleString('ru-RU', options)
                .replace(',', '.'); 
            document.querySelector('.date-time').textContent = formattedTime;
        })
        .catch(error => {
            console.error('Ошибка получения времени:', error);
            document.querySelector('.date-time').textContent = 'Ошибка получения времени';
        });
}

  document.addEventListener('DOMContentLoaded', () => {
      const videoPlayer = document.getElementById('background-video');
      const backgroundImage = document.getElementById('background-image');
      const videoSource = videoPlayer.querySelector('source');

      videoSource.addEventListener('error', function() {
          console.error('Видео не удалось загрузить.');
          videoPlayer.style.display = 'none';
          backgroundImage.style.display = 'block';
      });

      videoPlayer.addEventListener('loadeddata', function() {
          videoPlayer.style.display = 'block';
          backgroundImage.style.display = 'none';
      });

      document.querySelectorAll('.dock-item').forEach(item => {
          item.addEventListener('click', () => {
              const appId = item.getAttribute('data-app');
              openApp(appId);
          });
      });

      // Добавляем обработчик клика на ссылку Spotify
      const spotifyLink = document.getElementById('spotify-link');
      spotifyLink.addEventListener('click', (event) => {
          // Здесь можно добавить дополнительную логику, если нужно
          // например, проверку, установлено ли приложение Spotify
      });

      updateDateTime();
      setInterval(updateDateTime, 1000);
      video.play();

      setTimeout(() => {
          spotifyWidget.classList.add('show');
      }, 7500);
  });
})();