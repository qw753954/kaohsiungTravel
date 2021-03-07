const zoneList = document.querySelector('.card-list');
const zoneTitle = document.querySelector('.zone-title');
const zoneSelect = document.querySelector('#drop-down');
const hotZone = document.querySelector('.hotZone-list');
const pageId = document.querySelector('#pageId');
const goTop = document.querySelector('#go-top');



// 撈遠端資料
const jsonUrl = 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json';

let jsonData = {};

fetch(jsonUrl, { method: 'get' })
    .then((response) => {
        return response.json();
    }).then((data) => {
        jsonData = data.result.records;
        console.log(jsonData);

        addOption();
        pagination(jsonData, 1);
    })


// view, 把 "各個地區選項加到 dropdown" 並渲染到介面上
function addOption() {
    // 撈出 json 中所有的 Zone 屬性值，並存進陣列中
    let zoneAry = [];
    for (let i = 0; i < jsonData.length; i++) {
        zoneAry.push(jsonData[i].Zone);
    }

    // 過濾掉重複的陣列索引值
    let filterZoneAry = zoneAry.filter(function(item, index) {
        return zoneAry.indexOf(item) == index;
    });
    console.log('已移除陣列的重複元素: ', filterZoneAry);

    // 新增到 '下拉式選單' 元件中，就不需再到 HTML 內手打每個 option 地區名稱
    let strOption = '<option value="" disabled selected>-- 請選擇行政區 --</option> <option value="">全部行政區</option>';
    for (let i = 0; i < filterZoneAry.length; i++) {
        strOption += `<option value="${filterZoneAry[i]}">${filterZoneAry[i]}</option>`;
    }
    zoneSelect.innerHTML = strOption;
}


// view, 把 "行政區景點列表" 渲染到介面上
function updateList(arr, value) {
    let ticketImg;
    let str = '';

    for (let i = 0; i < arr.length; i++) {

        if (value === arr[i].Zone) {
            zoneTitle.textContent = value;
        } else {
            zoneTitle.textContent = '全部行政區';
        }

        // 此判斷會決定 .ticket-info 的顯示
        if (arr[i].Ticketinfo !== '') {
            ticketImg = `
                <div class="ticket-info">
                    <img src="image/icons_tag.png" class="tag-Pic">
                    <p class="price">${arr[i].Ticketinfo}</p>
                </div>`;
        } else {
            ticketImg = '';
        }

        str +=
            `<li class="card-item">
                <a href="#" class="card-header" style="background-image: url( ${arr[i].Picture1} );">
                    <h4>${arr[i].Name}</h4>
                    <p>${arr[i].Zone}</p>
                </a>
                <ul class="card-body">
                    <li>
                        <img src="image/icons_clock.png">
                        <p>${arr[i].Opentime}</p>
                    </li>
                    <li>
                        <img src="image/icons_pin.png">
                        <p>${arr[i].Add}</p>
                    </li>
                    <li>
                        <div>
                            <img src="image/icons_phone.png">
                            <a href="tel:+${arr[i].Tel}">${arr[i].Tel}</a>
                        </div>
                        ${ticketImg}
                    </li>
                </ul>
            </li>`;
    }
    zoneList.innerHTML = str;
}


// event, 切換下拉式列表的項目
zoneSelect.addEventListener('change', function(e) {
    let filterData = [];
    if (e.target.value) {
        filterData = jsonData.filter(function(item) {
            return e.target.value === item.Zone;
        })
    } else {
        filterData = jsonData;
    }
    pagination(filterData, 1, e.target.value);

    console.log('下拉式選單的 e.target.value ->', e.target.value);
});


// event, 點擊熱門區域的按鈕
hotZone.addEventListener('click', function(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'BUTTON') {
        return;
    }
    let hotFilter = jsonData.filter(function(item) {
        return e.target.value === item.Zone;
    })
    pagination(hotFilter, 1, e.target.value);

    console.log('熱門按鈕的 e.target.value ->', e.target.value);
});


function pagination(jsonData, nowPage, value) {
    console.log('是否有撈到 下拉式選單 or 熱門按鈕的 value ->', value);

    console.log(nowPage);
    // 取得全部資料長度
    const dataTotal = jsonData.length;

    // 設定要顯示在畫面上的資料數量
    // 預設每一頁只顯示 6 筆資料
    const perpage = 6;

    // page 按鈕總數量公式 -> 總資料數量 除以 每一頁要顯示的資料
    // 這邊要注意，因為有可能會出現餘數，所以要無條件進位
    const pageTotal = Math.ceil(dataTotal / perpage);

    // 當前頁數，對應現在當前頁數
    let currentPage = nowPage;

    // 因為要避免當前頁數筆總頁數還要多，假設今天總頁數是 3 筆，就不可能是 4 或 5
    // 所以要在寫入一個判斷避免這種狀況。
    // 當"當前頁數"比"總頁數"大的時候，"當前頁數"就等於"總頁數"
    // 注意這一行在最前面並不是透過 nowPage 傳入賦予與 currentPage，所以才會寫這一個判斷式，但主要是預防一些無法預期的狀況，例如：nowPage 突然發神經？！
    if (currentPage > pageTotal) {
        currentPage = pageTotal;
    }

    // 由前面可知 最小數字為 6 ，所以用答案來回推公式。
    const minData = (currentPage * perpage) - perpage + 1;
    const maxData = (currentPage * perpage);

    // 先建立新陣列
    const data = [];
    // 這邊將會使用 ES6 forEach 做資料處理
    // 首先必須使用索引來判斷資料位子，所以要使用 index
    jsonData.forEach((item, index) => {
            // 獲取陣列索引，但因為索引是從 0 開始所以要 +1。
            const num = index + 1;
            // 這邊判斷式會稍微複雜一點
            // 當 num 比 minData 大且又小於 maxData 就push進去新陣列。
            if (num >= minData && num <= maxData) {
                data.push(item);
            }
        })
        // 用物件方式來傳遞資料
    const page = {
        pageTotal,
        currentPage,
        hasPage: currentPage > 1,
        hasNext: currentPage < pageTotal,
    }

    updateList(data, value);
    pageBtn(page);
}


function pageBtn(page) {
    let str = '';
    const total = page.pageTotal;

    if (page.hasPage) {
        str += `<li><a href="#" data-page="${Number(page.currentPage) - 1}" class="link">Prev</a></li>`;
    } else {
        str += `<li class="link"><span>Prev</span></li>`;
    }

    for (let i = 1; i <= total; i++) {
        if (Number(page.currentPage) === i) {
            str += `<li><a class="link active" href="#" data-page="${i}">${i}</a></li>`;
        } else {
            str += `<li><a href="#" class="link" data-page="${i}">${i}</a></li>`;
        }
    };

    if (page.hasNext) {
        str += `<li><a href="#" data-page="${Number(page.currentPage) + 1}" class="link">Next</a></li>`;
    } else {
        str += `<li class="link"><span>Next</span></li>`;
    }

    pageid.innerHTML = str;
}


function switchPage(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A') {
        return;
    }
    const page = e.target.dataset.page;
    pagination(jsonData, page);
}
pageid.addEventListener('click', switchPage);


// event, gotop 點擊會回到網頁最上方
goTop.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
})


// event, gotop 在某特定 y 軸座標顯示
document.addEventListener("scroll", function() {
    if (window.scrollY > 850) {
        goTop.style.display = "block";
    } else {
        goTop.style.display = "none";
    }
});