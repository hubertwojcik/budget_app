//BUDGET CONTROLLER
const budgetController = (function () {

 //some code


})()


//UI CONTROLLER
const UIController = (function () {

 let DOMstrings = {
  inputType: '.add__type',
  inputDescription: '.add__description',
  inputValue: '.add__value',
  inputBtn: '.add__btn'
 }

 return {
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

 let DOM = UICtrl.getDOMstrings();

 const ctrlAddItem = function () {

  // 1. Get the filled input data

  let input = UICtrl.getInput();
  console.log(input);

  // 2. Add the item to the budget controller

  // 3. Add the item to the UI

  // 4. calculate the budget

  // 5. Display the budget

 }


 document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

 document.addEventListener('keypress', function (e) {
  if (e.keyCode === 13 || e.which === 13) {

   ctrlAddItem()

  }


 })

})(budgetController, UIController)