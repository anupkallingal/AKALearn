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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };
    
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // Would be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },
        
        addListItem: function (obj, type) {
            var HTML, newHTML, elementContainer;
            
            // Create HTML string with place holders
            if (type === 'inc') {
                HTML = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
                elementContainer = DOMStrings.incomeContainer;
                
            } else if (type === 'exp') {
                HTML = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div';
                
                elementContainer = DOMStrings.expensesContainer;
            }
            
            // Replace place holder with actual data
            newHTML = HTML.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);
            
            // Insert HTML into the DOM
            document.querySelector(elementContainer).insertAdjacentHTML('beforeend', newHTML);
            
        },
        
        clearFields: function () {
            var fields, fieldsArray;
            
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            
            fieldsArray = Array.prototype.slice.call(fields);
            
            fieldsArray.forEach(function (current, index, array) {
                current.value = "";
            });
            
            fieldsArray[0].focus();
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
        uiCtrl.addListItem(newItem, input.type);
        
        // 4. Clear the fields
        uiCtrl.clearFields();
        
        // 5. Calculate the budget
        
        // 6. Display budget on UI
                
    };
    
    return {
        init: function () {
            console.log('Application has started');
            setupEventListeners();
        }
    };
})(budgetController, uiController);

controller.init();