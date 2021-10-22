const costPerTb = 5.0;
let pattern = /\d+(.\d+)?\s[a-zA-Z]+/g;
let textField = document.querySelectorAll(
  'query-validation-status div .cfc-truncated-text'
);
let usageStatementDiv;
if (textField) {
  for (i = 0; i < textField.length; i++) {
    if (textField[i].innerText.includes('B when run')) {
      usageStatementDiv = textField[i];
    }
  }
}

let usageText = usageStatementDiv.innerText;
let dataUsed = usageText.match(pattern);

let dataValue = dataUsed[0].split(' ')[0];
let denomination = dataUsed[0].split(' ')[1];

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
let costFloat = dataValue * costPerTb;
let estimatedCost = +(Math.round(costFloat + 'e+2') + 'e-2');

let newDiv = document.createElement('div');
newDiv.innerText = `This query will cost approx. $${estimatedCost}.`;
newDiv.className = 'costs';
usageStatementDiv.appendChild(newDiv);
