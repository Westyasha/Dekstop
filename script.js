let zIndexCounter = 1;
const video = document.getElementById('background-video');

function openApp(appId) {
  const windowsContainer = document.getElementById('windows-container');
  const overlay = document.getElementById('overlay');
    let windowElement = document.querySelector(`[data-window-app="${appId}"]`);

  if (windowElement) {
    windowElement.classList.add('open');
    windowElement.style.zIndex = zIndexCounter++;
    overlay.style.display = 'block';
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
          header =  `<div class="window-header">
                      <div style="flex: 1;">Calculator</div>
                      <div class="close-button" onclick="closeWindow(this)"></div>
                    </div>`;
            iframeUrl = 'https://westyasha.github.io/calculator/';
            break;
         case 'bio':
          header =  `<div class="window-header">
                      <div style="flex: 1;">Bio Profile</div>
                      <div class="close-button" onclick="closeWindow(this)"></div>
                    </div>`;
           iframeUrl = 'https://leans.fun/Westyasha';
           break;
        default:
           header =  `<div class="window-header">
                      <div style="flex: 1;">${appId}</div>
                      <div class="close-button" onclick="closeWindow(this)"></div>
                    </div>`;
            content = `<p>Window content for ${appId}...</p>`;
        }


    newWindow.innerHTML = header + `<div class="window-content"><iframe src="${iframeUrl}" frameborder="0" ></iframe></div>`;
    windowsContainer.appendChild(newWindow);
      overlay.style.display = 'block';

    const dockItem = document.querySelector(`[data-app="${appId}"]`);
    if(dockItem){
       dockItem.classList.add('active');
       setTimeout(() => dockItem.classList.remove('active'), 200);
    }
       setTimeout(() => newWindow.classList.add('open'), 10);


}

function closeWindow(element){
      element.closest('.window').classList.remove('open');
    document.getElementById('overlay').style.display = 'none';

}


document.querySelectorAll('.dock-item').forEach(item => {
  item.addEventListener('click', () => {
      const appId = item.getAttribute('data-app');
      openApp(appId);
  });
});

// Get the date and time
function updateDateTime() {
    fetch('https://api.timeapi.io/v1/time/current/utc')
        .then(response => response.json())
        .then(data => {
            const currentTime = new Date(data.dateTime);
            const options = {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            const formattedTime = currentTime.toLocaleDateString('en-US', options)
              .replace(',', '.')
              .replace(' г.', '');
              document.querySelector('.date-time').textContent = formattedTime;
        })
        .catch(error => {
            console.error('Error getting time:', error);
        });
}


updateDateTime();
setInterval(updateDateTime, 1000);
video.play();