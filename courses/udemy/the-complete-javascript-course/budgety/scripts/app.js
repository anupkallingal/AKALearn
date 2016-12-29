// Budget Controller
var budgetController = (function () {
    
    var Expense, Income, data, calculateTotal;
    
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
        },
        budget: 0,
        percentage: -1
    };
    
    calculateTotal = function (type) {
        var sum = 0;
        
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        
        data.totals[type] = sum;
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
        
        calculateBudget: function () {
            
            // Calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');
            
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // Calculate the % of income we have spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
            
        },
        
        getBudget: function () {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            };
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        itemsContainer: '.container'
    };
    
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // Would be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        
        addListItem: function (obj, type) {
            var HTML, newHTML, elementContainer;
            
            // Create HTML string with place holders
            if (type === 'inc') {
                HTML = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
                elementContainer = DOMStrings.incomeContainer;
                
            } else if (type === 'exp') {
                HTML = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div';
                
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
        
        displayBudget: function (obj) {
            
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExpenses;
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
            
        },
        
        getDOMStrings: function () {
            return DOMStrings;
        }
    };
})();


// Global App Controller
var controller = (function (budgetCtrl, uiCtrl) {
    
    var setupEventListeners, updateBudget, ctrlAddItem, ctrlDeleteItem;
    
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
        
        document.querySelector(DOM.itemsContainer).addEventListener('click', ctrlDeleteItem);
    
    };
    
    updateBudget = function () {
        
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
        console.log(budget);
        
        // 3. Display budget on UI
        uiCtrl.displayBudget(budget);
        
    };
    
    ctrlAddItem = function () {
        
        var input, newItem;
 
        // 1. Get the input data
        input = uiCtrl.getInput();
        
        // 1A. Validate input 
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            console.log(newItem);

            // 3. Add the item to UI
            uiCtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            uiCtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();

        }
    };
    
    ctrlDeleteItem = function (event) {
        
        var itemID, splitID, type, ID;
        
        // Traverse up to the item div
        itemID = console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
        
        if(itemID) {
            // e.g inc-1
            splitID = itemID.split('-');
            
            type = splitID[0];
            ID = splitID[1];
            
            // 1. Delete the item from data structure
            
            // 2. Delet the item from UI
            
            // 3. Update and show new budget
            
        }
        
        
    };
    
    return {
        init: function () {
            console.log('Application is starting up');
            
            uiCtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            });
            
            setupEventListeners();
        }
    };
})(budgetController, uiController);

controller.init();