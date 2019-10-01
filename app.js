//BUDGET CONTROLLER
const budgetController = (function () {


 const Expense = function (id, description, value) {
  this.id = id;
  this.description = description;
  this.value = value;
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
   sum = +current.value;
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
  percentageLabel: '.budget__expenses--percentage'
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

    html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
   } else if (type === 'exp') {
    element = DOMstrings.expensesContainer;

    html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
   }
   //Replace placeholder text with some data
   newHtml = html.replace('%id%', obj.id);
   newHtml = newHtml.replace('%description%', obj.description);
   newHtml = newHtml.replace('%value%', obj.value);
   //Insert the HTML into the DOM
   document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
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
   document.querySelector(DOMstrings.budgetLabel).textContent = `${obj.budget} $`
   document.querySelector(DOMstrings.incomeLabel).textContent = `${obj.totalInc} $`;
   document.querySelector(DOMstrings.expenseLabel).textContent = `${obj.totalExp} $`;

   if (obj.percentage > 0) {
    document.querySelector(DOMstrings.percentageLabel).textContent = `${obj.percentage} %`
   } else {
    document.querySelector(DOMstrings.percentageLabel).textContent = `----`
   }

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
  }

 }

 return {
  init: function () {
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