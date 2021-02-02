const zoneList = document.querySelector('.card-list');
const zoneTitle = document.querySelector('.zone-title');
const zoneSelect = document.querySelector('#drop-down');
const hotZone = document.querySelector('.hotZone-list');
const pageSelect = document.querySelector('.pagination');
const goTop = document.querySelector('#go-top');
let data = [];

// 撈遠端資料
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true);
xhr.send(null);

xhr.onload = function() {
    let str = JSON.parse(xhr.responseText);
    data = str.result.records;
    console.log('測試1', data, Array.isArray(data));
    updateList(zoneSelect.value); //抓出尚未切換 select 的預設 value 值 = ''，並在一開始就先將所有景點資訊顯示在頁面
}


// view, 把 "景點資料列表" 渲染到介面上
function updateList(zoneName) {
    console.log('測試2', data);
    console.log('本次呼叫的 ZoneName 名稱為: ' + zoneName);

    let str = '';

    for (let i = 0; i < data.length; i++) {
        if (zoneName === data[i].Zone || zoneName === '全部行政區' || zoneName === '') {

            // 此判斷會決定 zoneTitle(h2) 的標題顯示
            if (zoneName === data[i].Zone) {
                zoneTitle.textContent = zoneName;
            } else {
                zoneTitle.textContent = '全部行政區';
            }

            str +=
                `<li class="card-item">
                    <a href="#" class="card-header" style="background-image: url( ${data[i].Picture1} );">
                        <h4>${data[i].Name}</h4>
                        <p>${data[i].Zone}</p>
                    </a>
                    <ul class="card-body">
                        <li>
                            <img src="image/icons_clock.png">
                            <p>${data[i].Opentime}</p>
                        </li>
                        <li>
                            <img src="image/icons_pin.png">
                            <p>${data[i].Add}</p>
                        </li>
                        <li>
                            <div>
                                <img src="image/icons_phone.png">
                                <a href="tel:+${data[i].Tel}">${data[i].Tel}</a>
                            </div>
                            <div>
                                <img src="image/icons_tag.png">
                                <p class="price">${data[i].Ticketinfo}</p>
                            </div>
                        </li>
                    </ul>
                </li>`;
        }
        zoneList.innerHTML = str;
    }
}

// event, 切換下拉式列表的項目
function zoneListChange(e) {
    let totalZoneSelectValue = e.target.value;
    // console.log(thisValue);
    updateList(totalZoneSelectValue);
}
zoneSelect.addEventListener('change', zoneListChange, false);

// event, 點擊熱門區域的按鈕
hotZone.addEventListener('click', function(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'BUTTON') {
        return;
    }
    let hotZoneBtnValue = e.target.value;
    updateList(hotZoneBtnValue);
});

// event, 點擊會回到頁面最頂端
goTop.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
})

// event, 點擊頁碼
pageSelect.addEventListener('click', function(e) {
    if (e.target.nodeName !== 'A') {
        return;
    }
    e.preventDefault();
})