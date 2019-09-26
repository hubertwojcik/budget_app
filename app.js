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
  inputBtn: '.add__btn'
 }

 return { //We return a function, which returns values from fields
  getInput: function () {

   return {
    type: document.querySelector(DOMstrings.inputType).value, //will be either  inc or exp!
    description: document.querySelector(DOMstrings.inputDescription).value,
    value: document.querySelector(DOMstrings.inputValue).value,
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

 const ctrlAddItem = function () {

  // 1. Get the filled input data

  let input = UICtrl.getInput();
  console.log(input);

  // 2. Add the item to the budget controller

  // 3. Add the item to the UI

  // 4. calculate the budget

  // 5. Display the budget

 }

 return {
  init: function () {
   setupEventListeners()
  }
 }


})(budgetController, UIController)

controller.init();