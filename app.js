//BUDGET CONTROLLER
const budgetController = (function () {


 const Expense = function (id, description, value) {
  this.id = id;
  this.description = description;
  this.value = value;
  this.percentage = -1;
 }

 Expense.prototype.calcPercentages = function (totalIncome) {

  if (totalIncome > 0) {
   this.percentage = Math.round((this.value / totalIncome) * 100);
  } else {
   this.percentage = -1;
  }

 }


 Expense.prototype.getPercentage = function () {
  return this.percentage;
 }



 const Income = function (id, description, value) {
  this.id = id;
  this.description = description;
  this.value = value;
 }


 //An object with all incomes or expenses 
 const data = {
  allItems: {
   exp: [], //Array for every exp
   inc: [] //Array for every incom
  },
  totals: {
   exp: 0, //Total amount of expenses
   inc: 0, //Total amount of incomes 
  },
  budget: 0,
  percentage: -1
 };

 const calculateTotal = function (type) {
  let sum = 0;
  data.allItems[type].forEach(function (current) {
   sum += current.value;
  })
  data.totals[type] = sum;
 }

 return {
  addItem: function (type, des, val) {
   let newItem, ID;
   //Create new ID
   if (data.allItems[type].length > 0) {
    ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
   } else {
    ID = 0
   }
   //  Create new item basen od 'inc' or 'exp' type
   if (type === 'exp') {
    newItem = new Expense(ID, des, val);
   } else if (type === 'inc') {
    newItem = new Income(ID, des, val)
   }
   //Push it into our data structure
   data.allItems[type].push(newItem);
   //return new element
   return newItem;
  },

  deleteItem: function (type, id) {
   let ids, index;
   ids = data.allItems[type].map(function (current) {
    return current.id;
   })

   index = ids.indexOf(id);

   if (index !== -1) {
    data.allItems[type].splice(index, 1);
   }

  },

  calculateBudget: function () {

   //Calculate total income and total expense
   calculateTotal('exp');
   calculateTotal('inc');

   //Calculate the budget: income - expenses
   data.budget = data.totals.inc - data.totals.exp;

   //Calculate the percentage of income that we spent 
   if (data.totals.inc > 0) {
    data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
   } else {
    data.percentage = -1;
   }


  },

  calculatePercentages: function () {
   data.allItems.exp.forEach(function (cur) {
    cur.calcPercentages(data.totals.inc)
   })
  },


  getPercentages: function () {

   const allPerc = data.allItems.exp.map(function (cur) {

    return cur.getPercentage()

   })
   return allPerc

  },




  getBudget: function () {
   return {
    budget: data.budget,
    totalInc: data.totals.inc,
    totalExp: data.totals.exp,
    percentage: data.percentage
   }
  },

  testing: function () {
   console.log(data)
  }

 }

})()







//UI CONTROLLER
const UIController = (function () {
 //Storing querSelectors
 let DOMstrings = {
  inputType: '.add__type',
  inputDescription: '.add__description',
  inputValue: '.add__value',
  inputBtn: '.add__btn',
  incomeContainer: '.income__list',
  expensesContainer: '.expenses__list',
  budgetLabel: '.budget__value',
  incomeLabel: '.budget__income--value',
  expenseLabel: '.budget__expenses--value',
  percentageLabel: '.budget__expenses--percentage',
  container: '.container',
  expensesPercLabel: '.item__percentage',
  dateLabel: '.budget__title--month'
 };

 const formatNumber = function (num, type) {
  let numSplit, int, decimal;
  num = Math.abs(num);
  num = num.toFixed(2);
  numSplit = num.split('.');
  int = numSplit[0];
  if (int.length > 3) {
   int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
  }

  decimal = numSplit[1]

  return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + decimal

 }

 return { //We return a function, which returns values from fields
  getInput: function () {

   return {
    type: document.querySelector(DOMstrings.inputType).value, //will be either  inc or exp!
    description: document.querySelector(DOMstrings.inputDescription).value,
    value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
   }


  },

  addListItem: function (obj, type) {
   let html, newHtml, element;
   //create HTML string with placeholder

   if (type === 'inc') {
    element = DOMstrings.incomeContainer;

    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
   } else if (type === 'exp') {
    element = DOMstrings.expensesContainer;

    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
   }
   //Replace placeholder text with some data
   newHtml = html.replace('%id%', obj.id);
   newHtml = newHtml.replace('%description%', obj.description);
   newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
   //Insert the HTML into the DOM
   document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
  },


  deleteListItem: function (selectorID) {

   let el = document.getElementById(selectorID)
   el.parentNode.removeChild(el)

  },



  clearFields: function () {
   let fields, fieldsArray;

   fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

   fieldsArray = Array.prototype.slice.call(fields)

   fieldsArray.forEach(function (current) {
    current.value = '';
   })

   fieldsArray[0].focus();

  },



  displayBudget: function (obj) {
   let type
   obj.budget > 0 ? type = 'inc' : type = 'exp'
   document.querySelector(DOMstrings.budgetLabel).textContent = `${formatNumber(obj.budget,type)} $`
   document.querySelector(DOMstrings.incomeLabel).textContent = `${formatNumber(obj.totalInc,'inc')} $`;
   document.querySelector(DOMstrings.expenseLabel).textContent = `${formatNumber(obj.totalExp,'exp')} $`;

   if (obj.percentage > 0) {
    document.querySelector(DOMstrings.percentageLabel).textContent = `${obj.percentage} %`
   } else {
    document.querySelector(DOMstrings.percentageLabel).textContent = `----`
   }
  },


  displayPercentages: function (percentages) {
   let fields = [...document.querySelectorAll(DOMstrings.expensesPercLabel)];

   fields.forEach(function (current, index) {
    if (percentages[index] > 0) {
     current.textContent = `${percentages[index]} %`
    } else {
     current.textContent = `---`
    }
   })

   // const nodeListForEach = function (list, callback) {
   //  for (let i = 0; i < list.length; i++) {
   //   callback(list[i], i)
   //  }
   // }

   // nodeListForEach(fields, function (current, index) {

   //  if (percentages[index] > 0) {
   //   current.textContent = percentages[index] + '%';
   //  } else {
   //   current.textContent = '---'
   //  }
   // })


  },

  displayMonth: function () {
   let now, months, year, month, day
   now = new Date()

   month = now.getMonth();

   months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

   year = now.getFullYear();
   document.querySelector(DOMstrings.dateLabel).textContent = `${months[month]} ${year}`;
  },

  changeType: function () {

   let fields = [...document.querySelectorAll(`${DOMstrings.inputType},${DOMstrings.inputDescription},${DOMstrings.inputValue}`)]

   fields.forEach(function (cur) {
    cur.classList.toggle('red-focus')
   })
   document.querySelector(DOMstrings.inputBtn).classList.toggle('red')
  },

  getDOMstrings: function () { // we return private DOMstrings to public, to use it in global App controller
   return DOMstrings;
  }

 }
})()






//GLOBAL APP CONTROLLER
const controller = (function (budgetCtrl, UICtrl) {

 const setupEventListeners = function () {
  let DOM = UICtrl.getDOMstrings();

  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

  document.addEventListener('keypress', function (e) {
   if (e.keyCode === 13 || e.which === 13) {
    ctrlAddItem()
   }
  })
  document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem) // set the eventListner on the container to make a event delegation(instead of adding one eventlistener to all of the elements we are interested in we add them to a container and then let event bubble up )

  document.querySelector(DOM.inputType), addEventListener('change', UICtrl.changeType)

 }

 const updateBudget = function () {
  //Calculate the budget
  budgetCtrl.calculateBudget();
  //Return the budget5
  let budget = budgetCtrl.getBudget()
  //Display the budget to the UI
  console.log(budget);

  UICtrl.displayBudget(budget)

 }

 const updatePercentages = function () {
  // 1. Calculate percentages
  budgetCtrl.calculatePercentages();
  // 2.Read percentages from the budget controller
  let percentages = budgetCtrl.getPercentages();
  //3. Update UI
  UICtrl.displayPercentages(percentages)

 }

 const ctrlAddItem = function () {
  let input, newItem;
  // 1. Get the filled input data
  input = UICtrl.getInput();
  if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

   // 2. Add the item to the budget controller
   newItem = budgetController.addItem(input.type, input.description, input.value) //3 parameters , ADDITEM return an object

   // 3. Add the item to the UI
   UICtrl.addListItem(newItem, input.type);

   //4. Clear the fields
   UICtrl.clearFields();

   //5. Calculate and update budget
   updateBudget();

   //6. Calculate and update percentages
   updatePercentages()
  }

 }

 const ctrlDeleteItem = function (e) {
  let itemID, splitID, type, ID;

  itemID = e.target.parentNode.parentNode.parentNode.parentNode.id; // retrieve the id from element we want and store it in ITEMID variable

  if (itemID) {

   //Isolating items to a different variables using the spli method 
   splitID = itemID.split('-');
   type = splitID[0];
   ID = parseInt(splitID[1]);

   //1. Delete the item from the data structure
   budgetCtrl.deleteItem(type, ID)
   //2. Delete the item from the UI
   UICtrl.deleteListItem(itemID)
   //3.Update and show new the new budget
   updateBudget()
   //4. Calculate and update percentages
   updatePercentages()
  }


 }

 return {
  init: function () {
   UICtrl.displayMonth()
   UICtrl.displayBudget({
    budget: 0,
    totalInc: 0,
    totalExp: 0,
    percentage: -1
   })
   setupEventListeners()
  }
 }


})(budgetController, UIController)

controller.init();