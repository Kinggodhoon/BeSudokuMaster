const keyMapList = document.getElementById("keyMapList");
const commitBtn = document.getElementById('commitBtn');
const cancelBtn = document.getElementById('cancelBtn');


const state = {
  '1': null,
  '2': null,
  '3': null,
  '4': null,
  '5': null,
  '6': null,
  '7': null,
  '8': null,
  '9': null,
  'Pause': null,
  'Memo': null,
};

const data = {
  backspace: {
    key: "backspace",
    name: "Backspace",
    selectedBy: null,
  },
  tab: {
    key: "tab",
    name: "Tab",
    selectedBy: null,
  },
  enter: {
    key: "enter",
    name: "Enter",
    selectedBy: null,
  },
  shiftLeft: {
    key: "shiftLeft",
    name: "ShiftLeft",
    selectedBy: null,
  },
  shiftRight: {
    key: "shiftRight",
    name: "ShiftRight",
    selectedBy: null,
  },
  controlLeft: {
    key: "controlLeft",
    name: "ControlLeft",
    selectedBy: null,
  },
  controlRight: {
    key: "controlRight",
    name: "ControlRight",
    selectedBy: null,
  },
  altLeft: {
    key: "altLeft",
    name: "AltLeft",
    selectedBy: null,
  },
  altRight: {
    key: "altRight",
    name: "AltRight",
    selectedBy: null,
  },
  capsLock: {
    key: "capsLock",
    name: "CapsLock",
    selectedBy: null,
  },
  escape: {
    key: "escape",
    name: "Escape",
    selectedBy: null,
  },
  keyA: { key: "keyA", name: "KeyA", selectedBy: null },
  keyB: { key: "keyB", name: "KeyB", selectedBy: null },
  keyC: { key: "keyC", name: "KeyC", selectedBy: null },
  keyD: { key: "keyD", name: "KeyD", selectedBy: null },
  keyE: { key: "keyE", name: "KeyE", selectedBy: null },
  keyF: { key: "keyF", name: "KeyF", selectedBy: null },
  keyG: { key: "keyG", name: "KeyG", selectedBy: null },
  keyH: { key: "keyH", name: "KeyH", selectedBy: null },
  keyI: { key: "keyI", name: "KeyI", selectedBy: null },
  keyJ: { key: "keyJ", name: "KeyJ", selectedBy: null },
  keyK: { key: "keyK", name: "KeyK", selectedBy: null },
  keyL: { key: "keyL", name: "KeyL", selectedBy: null },
  keyM: { key: "keyM", name: "KeyM", selectedBy: null },
  keyN: { key: "keyN", name: "KeyN", selectedBy: null },
  keyO: { key: "keyO", name: "KeyO", selectedBy: null },
  keyP: { key: "keyP", name: "KeyP", selectedBy: null },
  keyQ: { key: "keyQ", name: "KeyQ", selectedBy: null },
  keyR: { key: "keyR", name: "KeyR", selectedBy: null },
  keyS: { key: "keyS", name: "KeyS", selectedBy: null },
  keyT: { key: "keyT", name: "KeyT", selectedBy: null },
  keyU: { key: "keyU", name: "KeyU", selectedBy: null },
  keyV: { key: "keyV", name: "KeyV", selectedBy: null },
  keyW: { key: "keyW", name: "KeyW", selectedBy: null },
  keyX: { key: "keyX", name: "KeyX", selectedBy: null },
  keyY: { key: "keyY", name: "KeyY", selectedBy: null },
  keyZ: { key: "keyZ", name: "KeyZ", selectedBy: null },
  semicolon: { key: "semicolon", name: "Semicolon", selectedBy: null },
  comma: { key: "comma", name: "Comma", selectedBy: null },
  period: { key: "period", name: "Period", selectedBy: null },
  slash: { key: "slash", name: "Slash", selectedBy: null },
  backquote: { key: "backquote", name: "Backquote", selectedBy: null },
  bracketLeft: { key: "bracketLeft", name: "BracketLeft", selectedBy: null },
  backslash: { key: "backslash", name: "Backslash", selectedBy: null },
  bracketRight: { key: "bracketRight", name: "BracketRight", selectedBy: null },
  quote: { key: "quote", name: "Quote", selectedBy: null },
};

let keyMapRawData = [];
let keyMapData = [];

const init = () => {
  chrome.storage.local.get('keymap')
    .then(({ keymap }) => {
      keyMapRawData = keymap;
      return keymap;
    })
    .then(initSelectedData)
    .then(renderSelectors)
    .catch((error) => console.error(error));
};

const initSelectedData = (keyMapJson) => {
  keyMapJson.forEach(({ displayCode, pressedKeyCode }) => {
    for (const keymapKey of Object.keys(data)) {
      if (keymapKey.toLowerCase() === pressedKeyCode.toLowerCase()) {
        data[keymapKey].selectedBy = displayCode;
        state[displayCode] = keymapKey;
        break;
      }
    }
  });

  return keyMapJson;
}

const renderSelectors = (keyMapJson) => {
  if (!!keyMapJson) keyMapData = keyMapJson;

  // init keymap list
  keyMapList.innerHTML = "";

  // init selected by
  keyMapData.forEach(({ displayCode }) => {
    // div for keymap selector
    const keymapWrapper = document.createElement('div');
    keymapWrapper.className = 'key-map-wrapper';

    // span for key
    const keymapNameSpan = document.createElement('span');
    keymapNameSpan.textContent = displayCode;

    // keymap dropdown
    const selector = document.createElement("select");
    selector.className = `list-group-item`;
    selector.dataset.code = displayCode;
    selector.dataset.selected = "";

    // create select options
    selector.innerHTML = `${renderOptions(
      displayCode,
    )}`;

    // mapping html
    keymapWrapper.appendChild(keymapNameSpan);
    keymapWrapper.appendChild(selector);
    keyMapList.appendChild(keymapWrapper);
  });
};

const renderOptions = (displayCode) =>
  Object.values(data)
    .map(({ name, key, selectedBy }) =>
      `<option value="${key}"
      ${selectedBy === displayCode ? "selected" : ""}
      ${selectedBy ? "disabled" : ""}
      >${name}</option>`
    )
    .join("");

const handleChange = (e) => {
  const { target } = e;
  const { value, dataset } = target;
  const { code } = dataset;

  // init prev key select
  const prevKey = state[code];
  data[prevKey].selectedBy = null;

  // new select
  target.dataset.selected = value;
  data[value].selectedBy = code;
  state[code] = value;

  commitBtn.disabled = false;

  // draw
  renderSelectors();
};

const handleCancel = (e) => {
  // init key select data
  for (const key of Object.keys(data)) {
    data[key].selectedBy = null;
  }

  // init key map list
  initSelectedData(keyMapRawData);
  renderSelectors(keyMapRawData);

  // commit button disable
  commitBtn.disabled = true;
};

const handleCommit = (e) => {
  // key map matching 
  keyMapRawData.forEach((keymapData) => {
    for (const keymapStateKey of Object.keys(state)) {
      if (keymapData.displayCode === keymapStateKey) {
        keymapData.pressedKeyCode = data[state[keymapStateKey]].name;
        break;
      }
    }
  });

  chrome.storage.local.set({ keymap: keyMapRawData })
    .then(() => {
      console.debug('Keymap Data Updated');
    });

  // init list
  commitBtn.disabled = true;
  initSelectedData(keyMapRawData);
  renderSelectors(keyMapRawData);
}

const subscribeEvents = () => {
  keyMapList.addEventListener('change', handleChange);
  cancelBtn.addEventListener('click', handleCancel);
  commitBtn.addEventListener('click', handleCommit);
};

init();
subscribeEvents();
