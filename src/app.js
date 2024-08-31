import Product from './models/Product.js';
const totalPriceDiv = document.querySelectorAll('.totalPrice')
const cartQuantityDiv = document.getElementById('cartQuantity');
let totalPrice = 0;
let totalQuantity = 0;

// Fetch data and create Product instances
async function fetchProductsData() {
    try {
        const response = await fetch('./src/data.json');
        const data = await response.json();
        return data.map(desert => new Product(desert.category, desert.name, desert.price, desert.image));
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return [];
    }
}

// Create and append DOM elements
function createElement(tag, options = {}, children = []) {
    const element = document.createElement(tag);
    Object.assign(element, options);
    children.forEach(child => element.appendChild(child));
    return element;
}

function setupCartItem(name, price) {
    const cartListDiv = document.querySelector('.cartProductList');

    const productName = createElement('p', {
        className: 'text-capitalize fw-bold',
        textContent: name.innerHTML
    });

    const quantity = createElement('p', {
        className: 'mx-2 fw-bolder',
        textContent: '1x'
    });
    quantity.style.color = '#c83b0e';

    const pricePerItem = createElement('p', {
        className: 'mx-2 text-secondary',
        textContent: '@ ' + price.innerHTML
    });

    const totalPriceElement = createElement('p', {
        className: 'mx-2 text-secondary fw-bold',
        textContent: '$' + parseFloat(price.innerHTML.replace('$', "")).toFixed(2)
    });

    const priceAndQuantity = createElement('div', {
        className: 'priceAndQuantity d-flex align-items-center'
    }, [quantity, pricePerItem, totalPriceElement]);

    const productInfo = createElement('div', {
        className: 'product-info'
    }, [productName, priceAndQuantity]);

    const closeButton = createElement('button', {
        type: 'button',
        className: 'btn-close closeIcon focus-ring',
        ariaLabel: 'Close'
    });

    closeButton.addEventListener('click', () => {
        const itemPrice = parseFloat(price.innerHTML.replace('$', "")); // Ensure price is parsed correctly
        const itemQuantity = parseInt(quantity.innerHTML.replace('x', '')); // Ensure quantity is parsed correctly

        // Check if parsing was successful
        if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
            // Update total price and quantity
            totalPrice -= itemPrice * itemQuantity;
            totalQuantity -= itemQuantity;

            // Update the DOM
            totalPriceDiv.forEach((element) => {
                element.textContent = `$${totalPrice.toFixed(2)}`;
            })
            cartQuantityDiv.textContent = totalQuantity;

            // Remove the item from the cart
            listItem.remove();

            // Check if cart is empty and toggle display
            toggleCartDisplay();
        } else {
            console.error('Error in parsing price or quantity');
        }
    });


    const cartCloseIcon = createElement('div', {
        className: 'cartCloseIcon btn-close border border-2 border-dark rounded-circle d-flex justify-content-center align-items-center'
    }, [closeButton]);

    const listItem = createElement('li', {
        className: 'list-group-item d-flex justify-content-between align-items-center'
    }, [productInfo, cartCloseIcon]);

    cartListDiv.appendChild(listItem);

    // Update the total price and quantity when adding a new item
    totalPrice += parseFloat(price.innerHTML.replace('$', ""));
    totalPriceDiv.forEach((element) => {
        element.textContent = `$${totalPrice.toFixed(2)}`;
    })
    totalQuantity += 1;
    cartQuantityDiv.textContent = totalQuantity;

    toggleCartDisplay();
}

function updateCartItemQuantity(cartItemName, change) {
    const cartListDiv = document.querySelector('.cartProductList');
    const cartItems = cartListDiv.querySelectorAll('li');

    cartItems.forEach(item => {
        const productName = item.querySelector('.product-info .text-capitalize').textContent;

        if (productName === cartItemName) {
            const quantityElement = item.querySelector('.priceAndQuantity .fw-bolder');
            let currentQuantity = parseInt(quantityElement.textContent.replace('x', ''));

            // Get the price per item
            const pricePerItem = parseFloat(item.querySelector('.priceAndQuantity .text-secondary').textContent.replace('@ $', ''));

            // Update the quantity based on the change (increment or decrement)
            currentQuantity += change;
            totalQuantity += change;


            if (currentQuantity <= 0) {
                // Remove the cart item if quantity is 0 or less
                item.remove();
                totalPrice -= pricePerItem * (currentQuantity + 1); // subtract the total price of the removed item
                totalQuantity = 0;
            } else {
                // Update the quantity displayed
                quantityElement.textContent = `${currentQuantity}x`;

                // Update the total price for the cart
                totalPrice += change * pricePerItem;
            }
            cartQuantityDiv.textContent = totalQuantity;

            // Update the total price in the DOM
            totalPriceDiv.forEach((element) => {
                element.textContent = `$${totalPrice.toFixed(2)}`;
            })

            // Update the total price for the individual cart item
            const totalPriceElement = item.querySelector('.priceAndQuantity .fw-bold');
            totalPriceElement.textContent = `$${(currentQuantity * pricePerItem).toFixed(2)}`;
            toggleCartDisplay();
        }
    });
}

// Handle button clicks
function handleAddToCart(button) {
    const pictureContainer = button.parentElement.parentElement;
    const productDescriptionDiv = pictureContainer.nextElementSibling;
    const productName = productDescriptionDiv.firstChild.nextSibling;
    const productPrice = productName.nextSibling;

    // console.log(productName, productPrice);
    pictureContainer.classList.add('border', 'border-danger', 'border-3', 'rounded-2');
    button.classList.add('d-none');
    button.nextElementSibling.classList.remove('d-none');

    setupCartItem(productName, productPrice);
}

function handleDecrement(button) {
    const quantityText = button.nextElementSibling;
    const productName = button.closest('.col-lg-4').querySelector('.product-desc .productTitle').textContent
    console.log(productName);
    let quantityNum = parseInt(quantityText.innerHTML);

    if (quantityNum === 1) {
        button.parentElement.classList.add('d-none');
        button.parentElement.previousElementSibling.classList.remove('d-none');
        button.closest('.productPicture').classList.remove('border', 'border-danger', 'border-3', 'rounded-2');
        quantityNum = 2;
    }

    quantityText.innerHTML = `${quantityNum - 1}`;
    updateCartItemQuantity(productName, -1);
}

function handleIncrement(button) {
    const quantityText = button.previousElementSibling;
    const productName = button.closest('.col-lg-4').querySelector('.product-desc .productTitle').textContent
    let quantityNum = parseInt(quantityText.innerHTML);

    quantityText.innerHTML = `${quantityNum + 1}`;
    updateCartItemQuantity(productName, 1);
}

// Attach event listeners for button interactions
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.initialStateBtn');
    const addToCartDecrementBtn = document.querySelectorAll('.productDecrement');
    const addToCartIncrementBtn = document.querySelectorAll('.productIncrement');

    addToCartButtons.forEach(button => button.addEventListener('click', () => handleAddToCart(button)));
    addToCartDecrementBtn.forEach(button => button.addEventListener('click', () => handleDecrement(button)));
    addToCartIncrementBtn.forEach(button => button.addEventListener('click', () => handleIncrement(button)));
}

function toggleCartDisplay() {
    const emptyCartDiv = document.querySelector('.emptyCart');
    const orderCartDiv = document.querySelector('.orderCart');
    if (cartQuantityDiv.innerHTML == "0") {
        orderCartDiv.classList.add("d-none");
        emptyCartDiv.classList.remove("d-none");
    }
    else {
        orderCartDiv.classList.remove("d-none");
        emptyCartDiv.classList.add("d-none");
    }

}

function displayOrderedItems() {
    const cartProductList = Array.from(document.querySelectorAll(".cartProductList li"));
    const orderedItemsList = document.querySelector(".orderedItemsList");

    cartProductList.forEach((item) => {
        // Hide the close button
        const closeButton = item.querySelector('.cartCloseIcon');
        if (closeButton) closeButton.style.display = 'none';

        // Ensure the total price element is displayed
        const totalPriceElement = item.querySelector('.total-price-element');
        if (totalPriceElement) totalPriceElement.style.display = 'inline';

        item.style.backgroundColor = "#fcf8f5";
        orderedItemsList.append(item);
    })
}



// Main function to initialize the app
async function app() {
    const products = await fetchProductsData();
    const confirmOrderBtn = document.querySelector(".confirmOrderBtn");
    const startNewOrderBtn = document.querySelector(".startNewOrderBtn");

    products.forEach(product => product.createProductElement());
    setupAddToCartButtons();
    confirmOrderBtn.addEventListener('click', displayOrderedItems);
    startNewOrderBtn.addEventListener('click', () => location.reload())

    console.log(products);
}

app();
