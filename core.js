
document.addEventListener('keydown', function (event) {
  chrome.storage.local.get('keymap')
    .then(({ keymap: keyMapJson }) => {
      keyMapJson.map((keyMap) => {
        // key map data does not exists
        if (event.code !== keyMap.pressedKeyCode) return;

        // Number Press Events
        if (keyMap.action === 'keydown') {
          const keyDownEvent = new KeyboardEvent('keydown', keyMap.eventArgs);

          globalThis.dispatchEvent(keyDownEvent);

          return;
        }

        // Click Menu Events
        if (keyMap.action === 'click') {
          const menuClickEvent = new Event('mousedown');
          const menuElement = document.querySelector(keyMap.eventArgs);

          menuElement.dispatchEvent(menuClickEvent);

          return;
        }

        // Pause
        const pauseClickEvent = new Event('click');
        const pauseElement = document.getElementById(keyMap.eventArgs);

        pauseElement.dispatchEvent(pauseClickEvent);

        return;
      })
    })
    .catch(error => console.error(error));
});

