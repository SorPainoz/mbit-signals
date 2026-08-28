// Web Bluetooth's requestDevice() chooser cannot attach to an action popup or a
// popup-type window, so the toolbar icon opens the control UI in a normal window
// (WebContents type "tab", where the chooser works).
chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: chrome.runtime.getURL("control.html"),
    type: "normal",
    width: 360,
    height: 520
  });
});
