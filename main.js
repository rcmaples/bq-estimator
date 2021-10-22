var costPerTb = 5.0;
var pattern = /\d+(.\d+)?\s[a-zA-Z]+/g;
var textField = document.querySelectorAll(
  'query-validation-status div .cfc-truncated-text'
);
var usageStatementDiv;
if (textField) {
  for (i = 0; i < textField.length; i++) {
    if (textField[i].innerText.includes('B when run')) {
      usageStatementDiv = textField[i];
    }
  }
}

var usageText = usageStatementDiv.innerText;
var dataUsed = usageText.match(pattern);
var dataValue = dataUsed[0].split(' ')[0];
var denomination = dataUsed[0].split(' ')[1];

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
var costFloat = dataValue * costPerTb;
var estimatedCost = +(Math.round(costFloat + 'e+2') + 'e-2');
var style = '';

if (estimatedCost > 15) {
  style = 'color: red; font-weight: 500;';
}
if (estimatedCost > 5 && estimatedCost < 15) {
  style = 'color: darkorange; font-weight: 500;';
}
if (estimatedCost < 5) {
  style = 'color: green; font-weight: 500;';
}

var newDiv = document.createElement('div');
newDiv.innerHTML =
  '<span style="' +
  style +
  '">This query will cost approx. $' +
  estimatedCost.toFixed(2) +
  '.</span>';
newDiv.className = 'costs';
usageStatementDiv.appendChild(newDiv);
