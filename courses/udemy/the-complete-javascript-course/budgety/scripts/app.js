// Budget Controller
var budgetController = (function () {
    
    return {
        
    };
})();


// UI Controller
var uiController = (function () {
    
    return {
        
    };
})();


// Global App Controller
var controller = (function (budgetCtrl, uiCtrl) {
    var ctrlAddItem = function () {
 
        // 1. Get the input data
        
        // 2. Add the item to budget controller
        
        // 3. Add the item to UI
        
        // 4. Calculate the budget
        
        // 5. Display budget on UI
                
    };
    
    document.querySelector('.add__btn').addEventListener('click', function () {
        ctrlAddItem();
    });
    
    document.addEventListener('keypress', function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });
    
    return {
        
    };
})(budgetController, uiController);
