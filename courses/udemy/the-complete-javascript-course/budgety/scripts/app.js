// Budget Controller
var budgetController = (function () {
    
    return {
        
    };
})();


// UI Controller
var uiController = (function () {
    
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };
    
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // Would be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },
        
        getDOMStrings: function () {
            return DOMStrings;
        }
    };
})();


// Global App Controller
var controller = (function (budgetCtrl, uiCtrl) {
    
    var DOM = uiCtrl.getDOMStrings();
    
    var ctrlAddItem = function () {
 
        // 1. Get the input data
        var input = uiCtrl.getInput();
        console.log(input);
        
        // 2. Add the item to budget controller
        
        // 3. Add the item to UI
        
        // 4. Calculate the budget
        
        // 5. Display budget on UI
                
    };
    
    document.querySelector(DOM.inputBtn).addEventListener('click', function () {
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
