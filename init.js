const initKeyMap = () => {
  fetch("keymap.json")
    .then((response) => response.json())
    .then(configStoreChromeStorage)
    .catch((error) => console.error(error));
};

const configStoreChromeStorage = (keyMapData) => {
  chrome.storage.local.set({'keymap': keyMapData}).then(() => {
    console.debug('Be Sudoku Master Initialize Complete');
  });
}

// initialize keymap data when install chrome extension
chrome.runtime.onInstalled.addListener(() => {
  // config exists check
  chrome.storage.local.get('keymap')
    .then(({ keymap }) => {
      // already exists
      if (keymap) return;

      // not exists init keymap config data on chrome storage
      initKeyMap();
    })
    .catch((err) => console.error(err));
})