const container = document.querySelector(".container");
const searchBar = document.querySelector("header .header-search .search");
const searchShow = document.querySelector("header .header-search");
const clear = document.querySelector("header .header-search button");
const body = document.querySelector("body");
const headerImg = document.querySelector("header img");
let filterArr = [];
fetch("data.json")
  .then((data) => data.json())
  .then((data) => {
    for (const item of data) updateUI(item);
  });

const deleteSearch = (filt) => {
  filterArr.splice(filterArr.findIndex(ele => ele === filt), 1)
  addSearchUI(filterArr)
  addSearch()
  if (filterArr.length === 0) searchShow.style.display = "none";
}

const addSearchUI = (arr) => {
  searchBar.innerHTML = ""
  for (const item of arr) {
    searchBar.innerHTML += `
    <div class="search-filter">
    <p>${item}</p>
    <button data-attr="${item}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path fill="#FFF" fill-rule="evenodd" d="M11.314 0l2.121 2.121-4.596 4.596 4.596 4.597-2.121 2.121-4.597-4.596-4.596 4.596L0 11.314l4.596-4.597L0 2.121 2.121 0l4.596 4.596L11.314 0z"/></svg></button>
    </div>
    `
  }
}
const addSearch = (filt = "") => {
  if (!filterArr.some(e => e === filt)) filterArr.push(filt);
  filterArr = filterArr.filter(e => e !== "")
  fetch("data.json")
    .then((data) => data.json())
    .then((data) => {
      container.innerHTML = "";
      for (const item of data) {
        const filter = [
          item.role,
          item.level,
          ...item.languages,
          ...item.tools,
        ];
        if (filterArr.every(item => filter.find((val) => val === item))) {
          updateUI(item);
        }
      }
    });
  searchShow.style.display = "flex";
  addSearchUI(filterArr);
};
clear.addEventListener("click", () => {
  filterArr = [];
  addSearchUI(filterArr);
  addSearch()
  searchShow.style.display = "none";

});

const isExist = (feature) => {
  return feature
    ? `<p class="feature-edge ${feature === "new!" ? "new" : "featured"
    }">${feature}</p>`
    : "";
};

const makeSelect = (arr) => {
  let table = "";
  for (const item of arr) {
    table += `<li>${item}</li>`;
  }
  return table;
};
const updateUI = ({
  company,
  logo,
  new: news,
  featured,
  position,
  role,
  level,
  postedAt,
  contract,
  location,
  languages,
  tools,
}) => {
  container.innerHTML += `
        <div class="item">
        <span class="left-hover"></span>
        <img src="${logo}">
        <div class="main-data">
            <div class="data">
                <p class="company-name">${company}</p>
                ${isExist(news ? "new!" : false)}
                ${isExist(featured ? "featured" : false)}
            </div>
            <div class="position">
            ${position}
            </div>
            <div class="detils">
                <span>${postedAt}</span>
                <span>.</span>
                <span>${contract}</span>
                <span>.</span>
                <span>${location}</span>
            </div>
        </div>
        <ul>
        ${makeSelect([role, level, ...languages, ...tools])}
        </ul>
        </div>
        `;
};
// not most efiecnt way but still learn react :(
setInterval(() => {
  Array.from(document.querySelectorAll("ul li")).forEach(ele => {
    ele.onclick = () => {
      addSearch(ele.textContent)
    }
  })
  Array.from(document.querySelectorAll(".search-filter button")).forEach(ele => {
    ele.onclick = () => {
      deleteSearch(ele.getAttribute("data-attr"))
    }
  })
}, 1000);
setInterval(() => {
  if (body.offsetWidth <= 500) {
    headerImg.src = "images/bg-header-mobile.svg"
  } else {
    headerImg.src = "images/bg-header-desktop.svg"
  }
}, 200)