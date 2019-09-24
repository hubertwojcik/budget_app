//BUDGET CONTROLLER
const budgetController = (function () {

 //some code


})()


//UI CONTROLLER
const UIController = (function () {

 return {
  getInput: function () {

  }
 }



})()

//GLOBAL APP CONTROLLER
const controller = (function (budgetCtrl, UICtrl) {

 const ctrlAddItem = function () {

  // 1. Get the filled input data

  // 2. Add the item to the budget controller

  // 3. Add the item to the UI

  // 4. calculate the budget

  // 5. Display the budget
  console.log('it works');

 }


 document.querySelector('.add__btn').addEventListener('click', ctrlAddItem)

 document.addEventListener('keypress', function (e) {
  if (e.keyCode === 13 || e.which === 13) {

   ctrlAddItem()

  }


 })

})(budgetController, UIController)