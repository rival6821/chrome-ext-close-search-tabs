const findSearchTabs = async () => {
  return await chrome.tabs.query({
    url: [
      "https://www.bing.com/search?*",
      "https://www.google.co.kr/search?*",
      "https://search.naver.com/search.naver?*",
      "chrome://newtab/",
      "edge://newtab/",
      "about:newtab",
    ],
  });
};

const tabs = await findSearchTabs();

// tabs 없을경우

const removeTabData = (id) => {
  if (!id) return;
  const ele = document.querySelector(`li[data-id="${id}"]`);
  if (!ele) return;
  ele.remove();
};

const template = document.getElementById('li_template');
const elements = new Set();
for (const tab of tabs) {
  const element = template.content.firstElementChild.cloneNode(true);

  element.dataset.id = tab.id;
  element.querySelector('.title').textContent = tab.title;
  element.querySelector('a').addEventListener('click', async () => {
    await chrome.tabs.remove(tab.id);
    removeTabData(tab.id);
  });
  elements.add(element);
}

document.querySelector('ul').append(...elements);

document.getElementById('all_close_btn').addEventListener('click', async () => {
  const allTabs = await findSearchTabs();
  if (!allTabs) return;
  allTabs.forEach((ele) => {
    chrome.tabs.remove(ele.id);
    removeTabData(ele.id);
  });
});
