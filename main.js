let create = document.getElementById("create");
let table = document.querySelector("table")
let deleteAll = document.getElementById("deleteAll");
let cleanAll = document.querySelector(".AddClear svg");
let Reload = document.querySelector(".SearchSection svg");


let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");

let searchByTitle = document.getElementById("searchByTitle");
let searchByCategoty = document.getElementById("searchByCategoty");


let id = 0; //use by update
let KeyLocal = "key";

let items = JSON.parse(localStorage.getItem(KeyLocal) || "[]");

displayData(items);

function displayData(list = []) {
    table.innerHTML = "";
    if (list.length == 0) {
        table.innerHTML = `<p class="NoData">NO DATA</p>`;
        return;
    }

    let HtmlString = `<tr>
          <th>id</th>
          <th>title</th>
          <th>price</th>
          <th>taxes</th>
          <th>ads</th>
          <th>discount</th>
          <th>total</th>
          <th>count</th>
          <th>category</th>
          <th>update</th>
          <th>delete</th>
        </tr>`;

    list.forEach(element => {
        HtmlString +=
            `
        <tr>
          <td>${element.id}</td>
          <td>${element.title}</td>
          <td>${element.price}</td>
          <td>${element.taxes}</td>
          <td>${element.ads}</td>
          <td>${element.discount}</td>
          <td>${element.total}</td>
          <td>${element.count}</td>
          <td>${element.category}</td>
          <td><button id="update" data-id="${element.id}">update</button></td>
          <td><button id="delete" data-id="${element.id}">delete</button></td>
        </tr>
        `;
    });

    table.innerHTML = HtmlString;
    deleteAll.textContent = `DELETE ALL(${list.length})`;
}

function additem() {
    let title = document.getElementById("title");
    let price = document.getElementById("price");
    let taxes = document.getElementById("taxes");
    let ads = document.getElementById("ads");
    let discount = document.getElementById("discount");
    let count = document.getElementById("count");
    let category = document.getElementById("category");

    if (title.value == "" || price.value == "" || taxes.value == "" ||
        ads.value == "" || discount.value == "" || count.value == "" ||
        category.value == ""
    )
        return;

    let id = getNewId();
    let total = (parseFloat(price.value) + parseFloat(taxes.value) + parseFloat(ads.value) - parseFloat(discount.value));

    items.push({
        id: id, title: title.value, price: price.value, taxes: taxes.value
        , ads: ads.value, discount: discount.value, total: total, count: count.value,
        category: category.value
    })

    localStorage.setItem(KeyLocal, JSON.stringify(items));

    clean();
    displayData(items);

}

function getNewId() {

    if (items.length === 0)
        return 1;

    let maxId = items.reduce((startVal, elem) => {
        let id = elem.id;
        if (startVal > id) {
            return startVal
        } else {
            return id
        }
    }, 0);

    return maxId + 1;
}


function calucTotal() {

    if (price.value == "" || taxes.value == "" ||
        ads.value == "" || discount.value == "") {
        total.textContent = `Total: `;
        return;
    }
    let priceInput = Number(price.value);
    let taxesInput = Number(taxes.value);
    let adsInput = Number(ads.value);
    let discountInput = Number(discount.value);

    let totalOutput = (parseFloat(price.value) + parseFloat(taxes.value) + parseFloat(ads.value) - parseFloat(discount.value));
    total.textContent = `Total: ${totalOutput}`;

}


function clean() {
    title.value = "";
    price.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "";
    count.value = "";
    category.value = "";
    total.textContent = `Total: `;

    id = 0;
    create.textContent = "Create";
}



function updateItem(id) {
    let item = items.find(function (item) {
        return item.id === id;
    });

    title.value = item.title;
    price.value = item.price;
    taxes.value = item.taxes;
    ads.value = item.ads;
    discount.value = item.discount;
    count.value = item.count;
    category.value = item.category;
    let totalOutput = (parseFloat(price.value) + parseFloat(taxes.value) + parseFloat(ads.value) - parseFloat(discount.value));
    total.textContent = `Total: ${totalOutput}`;
}
function saveUpdateItem() {
    let c = items.findIndex(function (item) {
        return item.id === id;
    });

    items[c].title = title.value;
    items[c].price = price.value;
    items[c].taxes = taxes.value;
    items[c].ads = ads.value;
    items[c].discount = discount.value;
    items[c].total = (parseFloat(price.value) + parseFloat(taxes.value) + parseFloat(ads.value) - parseFloat(discount.value));
    items[c].count = count.value;
    items[c].category = category.value;

    localStorage.setItem(KeyLocal, JSON.stringify(items));

    clean();

    displayData(items);
}

function deleteItem(id) {
    let index = items.findIndex(function (item) {
        return item.id === Number(id)
    });

    if (index !== -1) {
        items.splice(index, 1);
        localStorage.setItem(KeyLocal, JSON.stringify(items));
        clean();
        displayData(items);
    }
}


table.addEventListener("click", (e) => {
    if (e.target.id === "update") {
        id = Number(e.target.dataset.id);
        create.textContent = "Save";
        updateItem(id);
    } else if (e.target.id === "delete") {
        deleteItem(e.target.dataset.id);
    }
});

cleanAll.addEventListener("click", (e) => {
    clean();
});

create.addEventListener("click", (e) => {
    if (id === 0)
        additem();
    else
        saveUpdateItem();
});

deleteAll.addEventListener("click", (e) => {
    localStorage.clear();
    items = [];
    displayData(items);
});

price.addEventListener("input", calucTotal);
taxes.addEventListener("input", calucTotal);
ads.addEventListener("input", calucTotal);
discount.addEventListener("input", calucTotal);

function getTextSearch() {
    const input = document.getElementById("search");
    return input ? input.value.trim() : "";
}

searchByCategoty.addEventListener("click", () => {
    const textSearch = getTextSearch();
    if (!textSearch) {
        console.log("لا يوجد نص للبحث");
        return;
    }
    const list = items.filter(item =>
        item.category.toLowerCase().includes(textSearch.toLowerCase())
    );
    displayData(list);
});
searchByTitle.addEventListener("click", (e) => {
    const textSearch = getTextSearch();
    if (!textSearch) {
        console.log("لا يوجد نص للبحث");
        return;
    }
    const list = items.filter(item =>
        item.title.toLowerCase().includes(textSearch.toLowerCase())
    );
    displayData(list);
});
Reload.addEventListener("click", (e) => {
    document.getElementById("search").value = "";
    displayData(items);
});