export default class Product {
    constructor(category, name, price, image) {
        this.category = category;
        this.name = name;
        this.price = parseFloat(price).toFixed(2);
        this.image = image;
    }

    createProductElement() {
        const productsGrid = document.querySelector('.productsGrid');

        // Create elements
        const productContainerDiv = createElementWithClasses('div', ['col-12', 'col-lg-4', 'mb-3', 'd-flex', 'flex-column', 'align-items-start',]);

        // Picture Div
        const productPictureDiv = createElementWithClasses('div', ['productPicture', 'position-relative', 'mb-4']);
        const productImages = ['source', 'source', 'img'].map(tag => createElementWithClasses(tag, ['img-fluid', 'rounded-2']));

        //AddToCartDiv Container
        const addToCartDiv = createElementWithClasses('div', [
            'bg-white', 'border', 'border-danger', 'rounded-pill', 'position-absolute', 'top-100', 'start-50', 'translate-middle',
            'p-0', 'addToCartDiv', 'user-select-none'
        ]);
        const addToCartInitialBtn = createElementWithClasses('div', ['btn', 'd-flex', 'justify-content-center',
            'align-items-center', 'rounded-pill', 'px-2', 'py-1', 'initialStateBtn'])
        addToCartInitialBtn.style.width = "150px";
        const cartIcon = document.createElement('img');
        const cartText = createElementWithClasses('p', ['text-capitalize', 'mb-0', 'mx-1', 'addToCartText']);

        const addToCartSecondaryBtn = createElementWithClasses('div', ['d-flex', 'justify-content-between',
            'align-items-center', 'bg-danger', 'rounded-pill', 'px-2', 'py-1', 'activeStateBtn', 'd-none']);
        addToCartSecondaryBtn.style.width = "150px";
        const incrementIconDiv = createElementWithClasses('div', ['border', 'border-white', 'rounded-circle', 'p-1', 'd-flex', 'justify-content-center', 'align-items-center', 'addToCartIcons', 'productIncrement'])
        const cartIncrementIcon = document.createElement('img');
        incrementIconDiv.style.width = "20px";
        incrementIconDiv.style.height = "20px";

        const decrementIconDiv = createElementWithClasses('div', ['border', 'border-white', 'rounded-circle', 'p-1', 'd-flex', 'justify-content-center', 'align-items-center', 'addToCartIcons', 'productDecrement'])
        const cartDecrementIcon = document.createElement('img');
        decrementIconDiv.style.width = "20px";
        decrementIconDiv.style.height = "20px";

        const addToCartQuantity = createElementWithClasses('p', ['text-white', 'm-0', 'addedQuantity'])

        // Descritpion Div
        const productDescDiv = createElementWithClasses('div', ['product-desc']);
        const productCategory = createElementWithClasses('p', ['text-secondary', 'mb-1', 'productCategory']);
        const productTitle = createElementWithClasses('p', ['mb-1', 'productTitle']);
        productTitle.style.fontFamily = "RedHat-SemiBold";
        const productPrice = createElementWithClasses('p', ['text-danger', 'mb-1', 'productPrice']);
        productPrice.style.fontFamily = "RedHat-SemiBold"

        // Set element attributes and content
        productImages[0].setAttribute('media', '(max-width: 767.5px)');
        productImages[0].setAttribute('srcset', this.image.mobile)
        productImages[1].setAttribute('media', '(min-width: 768px)');
        productImages[1].setAttribute('srcset', this.image.tablet)
        productImages[2].setAttribute('media', '(max-width: 1200px)');
        productImages[2].setAttribute('srcset', this.image.desktop)

        // addToCartDiv.style.width = "100px";

        cartIcon.setAttribute('src', "./assets/images/icon-add-to-cart.svg");
        cartText.innerHTML = "add to cart";
        cartIncrementIcon.setAttribute('src', "./assets/images/icon-increment-quantity.svg")
        cartDecrementIcon.setAttribute('src', "./assets/images/icon-decrement-quantity.svg")
        addToCartQuantity.innerHTML = "1";

        productCategory.innerHTML = this.category;
        productTitle.innerHTML = this.name;
        productPrice.innerHTML = "$" + this.price;

        // Append elements to their parents
        productImages.forEach(image => productPictureDiv.appendChild(image));
        addToCartInitialBtn.append(cartIcon, cartText);
        incrementIconDiv.appendChild(cartIncrementIcon);
        decrementIconDiv.appendChild(cartDecrementIcon);
        addToCartSecondaryBtn.append(decrementIconDiv, addToCartQuantity, incrementIconDiv);
        addToCartDiv.append(addToCartInitialBtn, addToCartSecondaryBtn);
        productPictureDiv.appendChild(addToCartDiv);

        productDescDiv.append(productCategory, productTitle, productPrice);
        productContainerDiv.append(productPictureDiv, productDescDiv);

        productsGrid.appendChild(productContainerDiv);
    }

}


function createElementWithClasses(tag, classes) {
    const element = document.createElement(tag);
    element.classList.add(...classes);
    return element;
}

