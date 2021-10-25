const costPerTB = 5.0;
const pattern = /\d+(.\d+)?\s[a-zA-Z]+/g;
const infoMsg = 'info validation icon';
const errorMsg = 'error validation icon';
const validMsg = 'valid validation icon';
let divSet = false;

function calculateCosts() {
  let usageText;
  let dataUsed;
  let dataValue;
  let denomination;
  let style;
  let textDiv = document.querySelector(
    'bq-tab-content:not(.cfc-hidden) query-validation-status div .cfc-truncated-text'
  );

  if (!!textDiv) {
    if (textDiv.innerText.includes('B when run')) {
      usageText = textDiv.innerText;
    }
  }

  if (usageText) {
    dataUsed = usageText.match(pattern);
    [dataValue, denomination] = dataUsed[0].split(' ');
  }

  switch (denomination) {
    case 'PiB':
      dataValue = dataValue * 1000;
      break;
    case 'TiB':
      dataValue = dataValue;
      break;
    case 'GiB':
      dataValue = dataValue / 1000;
      break;
    case 'MiB':
      dataValue = dataValue / 1000000;
      break;
    case 'KiB':
      dataValue = dataValue / 1000000000;
      break;
    default:
      break;
  }

  let costFloat = dataValue * costPerTB;
  let estimatedCost = +(Math.round(costFloat + 'e+2') + 'e-2');

  if (estimatedCost > 15) {
    style = 'danger';
  }

  if (estimatedCost > 5 && estimatedCost < 15) {
    style = 'warn';
  }

  if (estimatedCost < 5) {
    style = 'okay';
  }

  insertCostDiv(textDiv, estimatedCost, style);
}

function insertCostDiv(div, cost, style) {
  let newDiv = document.createElement('div');
  newDiv.className = 'costs';
  newDiv.innerHTML = `
  <span class=${style}>
  This query will cost approx. $${cost.toFixed(2)}
  </span>
  `;

  if (divSet) {
    console.log('div is set, removing and readding.');
    removeCostDiv();
    div.appendChild(newDiv);
    divSet = true;
  } else {
    console.log('div is not set, adding and setting.');
    div.appendChild(newDiv);
    divSet = true;
  }
}

function removeCostDiv() {
  let costDiv = document.querySelector('div.costs');
  if (costDiv) {
    costDiv.outerHTML = '';
    divSet = false;
  }
}

function subscriber(mutations) {
  mutations.forEach((mutation) => {
    let children = mutation.target.children;
    for (let child of children) {
      let desiredNode = child.querySelector('query-validation-status ace-icon');
      if (desiredNode.nodeName == 'ACE-ICON') {
        switch (desiredNode.ariaLabel) {
          case infoMsg:
            removeCostDiv();
            break;
          case errorMsg:
            removeCostDiv();
            break;
          case validMsg:
            calculateCosts();
            break;
          default:
            removeCostDiv();
            break;
        }
      }
    }
  });
}

let observer = new MutationObserver(subscriber);

let options = {
  childList: true,
  subtree: true,
  attributes: true,
};

function startObserver() {
  let target = 'bq-tab-panel';
  if (!document.querySelector(target)) {
    console.log('looping');
    window.setTimeout(startObserver, 500);
  } else {
    observer.observe(document.querySelector(target), options);
  }
}

startObserver();
