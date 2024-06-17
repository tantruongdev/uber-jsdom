function getEle(id) {
  return document.getElementById(id);
}

const taxiPrice = {
  uberX: {
    level1: 8000,
    level2: 12000,
    level3: 10000,
    wt: 2000,
  },
  uberSUV: {
    level1: 9000,
    level2: 14000,
    level3: 12000,
    wt: 3000,
  },
  uberBlack: {
    level1: 10000,
    level2: 16000,
    level3: 14000,
    wt: 4000,
  },
};

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function getCarType() {
  const carTypeElements = document.getElementsByName("car");
  for (let item of carTypeElements) {
    if (item.checked) {
      return item.value;
    }
  }
  alert("Vui lòng chọn loại xe");
  return null;
}

function validateDistance() {
  const distance = getEle("distance").value.trim();
  if (distance === "" || isNaN(distance) || parseFloat(distance) <= 0) {
    alert("Vui lòng nhập số Km chính xác");
    return null;
  }
  return parseFloat(distance);
}

function validateWaitingTime() {
  const waitingTime = getEle("waitingTime").value.trim();
  if (waitingTime === "" || isNaN(waitingTime) || parseFloat(waitingTime) < 0) {
    alert("Vui lòng nhập thời gian chờ chính xác");
    return null;
  }
  return parseFloat(waitingTime);
}

function calTaxiPrice(carType, distance) {
  let totalPrice = 0;
  if (distance < 1) {
    totalPrice += taxiPrice[carType].level1 * distance;
  } else if (distance >= 1 && distance < 20) {
    totalPrice += taxiPrice[carType].level1 * 1;
    totalPrice += taxiPrice[carType].level2 * (distance - 1);
  } else {
    totalPrice += taxiPrice[carType].level1 * 1;
    totalPrice += taxiPrice[carType].level2 * 19;
    totalPrice += taxiPrice[carType].level3 * (distance - 20);
  }
  return totalPrice;
}

function calWaitingTimePrice(carType, waitingTime) {
  return Math.ceil(waitingTime / 3.0) * taxiPrice[carType].wt;
}

function calPrice() {
  const carType = getCarType();
  if (!carType) return;

  const distance = validateDistance();
  if (distance === null) return;

  const waitingTime = validateWaitingTime();
  if (waitingTime === null) return;

  let totalPrice = calTaxiPrice(carType, distance);
  totalPrice += calWaitingTimePrice(carType, waitingTime);

  const bill = getEle("price");
  bill.innerHTML = formatCurrency(totalPrice.toFixed(2));
  getEle("totalPrice").style.display = "block";
}

function renderRowPrice(carType, arrayKM, tblBody) {
  for (var i = 0; i < arrayKM.length; i++) {
    var tr = document.createElement("tr");

    var tdCarType = document.createElement("td");
    var tdKMUsed = document.createElement("td");
    var tdPrice = document.createElement("td");
    var tdTotalPrice = document.createElement("td");

    console.log(arrayKM[i], taxiPrice[carType][`level${i + 1}`]);

    tdCarType.innerHTML = carType;
    tdKMUsed.innerHTML = arrayKM[i] + " km";
    tdPrice.innerHTML = taxiPrice[carType][`level${i + 1}`];
    tdTotalPrice.innerHTML = taxiPrice[carType][`level${i + 1}`] * arrayKM[i];

    tr.appendChild(tdCarType);
    tr.appendChild(tdKMUsed);
    tr.appendChild(tdPrice);
    tr.appendChild(tdTotalPrice);

    var addRow = document.getElementById(tblBody).appendChild(tr);
  }
}

function renderRowWaitingTime(carType, tblBody) {
  const waitingTime = validateWaitingTime();
  if (waitingTime === null) return;

  var waitingTimePrice = calWaitingTimePrice(carType, waitingTime);
  var tr = document.createElement("tr");

  var tdTitle = document.createElement("td");
  var tdMinutes = document.createElement("td");
  var tdPrice = document.createElement("td");
  var tdTotalPrice = document.createElement("td");

  tdTitle.innerHTML = "Thời gian chờ";
  tdMinutes.innerHTML = waitingTime + " phút";
  tdPrice.innerHTML = taxiPrice[carType][`wt`];
  tdTotalPrice.innerHTML = waitingTimePrice;

  tr.appendChild(tdTitle);
  tr.appendChild(tdMinutes);
  tr.appendChild(tdPrice);
  tr.appendChild(tdTotalPrice);

  var addRow = document.getElementById(tblBody).appendChild(tr);
}

function renderTotalBill(tblBody) {
  var rows = document.querySelectorAll("#tblBody tr td:nth-child(4)");
  // console.log(rows);
  var sum = 0;
  for (item of rows) {
    // console.log(item.innerHTML);
    sum += parseFloat(item.innerHTML);
  }
  // console.log(sum);
  var tr = document.createElement("tr");

  var tdTitle = document.createElement("td");
  tdTitle.innerHTML = "Thành tiền";
  tdTitle.setAttribute("colspan", "3");
  var tdTotal = document.createElement("td");
  tdTotal.innerHTML = formatCurrency(sum);

  tr.appendChild(tdTitle);
  tr.appendChild(tdTotal);

  tr.style.backgroundColor = "rgb(0, 175, 0)";
  document.getElementById(tblBody).appendChild(tr);
}

function getData() {
  var kq = [];
  var soKm = document.getElementById("distance").value;
  soKm = parseFloat(soKm);

  kq.push(soKm);
}
function printBill() {
  const arrayKM = [];

  const carType = getCarType();
  const distance = validateDistance();
  if (!carType || distance === null) return;

  if (distance < 1) {
    arrayKM.push(distance);
  } else if (distance >= 1 && distance < 20) {
    arrayKM.push(1, distance - 1);
  } else {
    arrayKM.push(1, 19, distance - 20);
  }

  renderRowPrice(carType, arrayKM, "tblBody");
  //
  renderRowWaitingTime(carType, "tblBody");

  renderTotalBill("tblBody");
}

getEle("totalPrice").style.display = "none";

getEle("calPrice").onclick = function () {
  const tbody = document.querySelector("table #tblBody");
  tbody.innerHTML = "";
  calPrice();
};

getEle("printBill").onclick = function () {
  printBill();
};
