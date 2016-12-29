// Budget Controller
var budgetController = (function () {
    
    var Expense, Income, data;
    
    Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    
    return {
        addItem: function (type, des, val) {
            
            var newItem, ID;
            
            // Create new ID
            var typeItems = data.allItems[type];
            if (typeItems.length > 0) {
                ID = typeItems[typeItems.length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // Create new item based on inc or exp
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // Push into our datastructure
            data.allItems[type].push(newItem);
            
            // Return new element
            return newItem;
        },
        
        testing: function () {
            console.log(data);
        }
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
    
    var setupEventListeners, ctrlAddItem;
    
    setupEventListeners = function () {
        
        var DOM = uiCtrl.getDOMStrings();
    
        document.querySelector(DOM.inputBtn).addEventListener('click', function () {
            ctrlAddItem();
        });

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    
    };
    
    ctrlAddItem = function () {
        
        var input, newItem;
 
        // 1. Get the input data
        input = uiCtrl.getInput();
        
        // 2. Add the item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        console.log(newItem);
        
        // 3. Add the item to UI
        
        // 4. Calculate the budget
        
        // 5. Display budget on UI
                
    };
    
    return {
        init: function () {
            console.log('Application has started');
            setupEventListeners();
        }
    };
})(budgetController, uiController);

controller.init();