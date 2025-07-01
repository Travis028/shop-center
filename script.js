fetch("http://localhost:3000/products")
  .then(response => response.json())
  .then(products => {
    products.forEach(product => renderProduct(product));
    attachCartEvents(); 
  })
  .catch(error => console.error("Failed to fetch products:", error));


  function renderProduct(product) {
  const productContainer = document.querySelector(".product-content");

  const productBox = document.createElement("div");
  productBox.classList.add("product-box");

  productBox.innerHTML = `
    <div class="img-box">
      <img src="${product.image}" />
    </div>
    <h2 class="product-title">${product.name}</h2>
    <div class="price-and-cart">
      <span class="price">$${product.price}</span>
      <i class="ri-shopping-bag-line add-cart"></i>
    </div>
  `;

  productContainer.appendChild(productBox);
}

const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
cartIcon.addEventListener("click",() => cart.classList.add("active"));
cartClose.addEventListener("click",() => cart.classList.remove("active"));

const addCartButtons = document.querySelectorAll(".add-cart");
addCartButtons.forEach(button => {
    button.addEventListener("click", event => {
        const productBox = event.target.closest(".product-box");
        addToCart(productBox);
    });
});

const cartContent = document.querySelector(".cart-content");
const addToCart = productBox => {
    const productImgSrc = productBox.querySelector("img").src;
    const productTitle = productBox.querySelector(".product-title").textContent;
    const productPrice = productBox.querySelector(".price").textContent;

    const cartItems = cartContent.querySelectorAll(".cart-product-title");
    for (let item of cartItems) {
        if (item.textContent === productTitle){
            alert ("This item is already in the cart");
            return; 
        }
    }

    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    cartBox.innerHTML = `
    <img src="${productImgSrc}" class="cart-img">
        <div class="cart-detail">
            <h2 class="cart-product-title">${productTitle}</h2>
            <span class="cart-price">${productPrice}</span>
            <div class="cart-quantity">
                <button id="decrement">-</button>
                <span class="number">1</span>
                <button id="increment">+</button>
            </div>
        </div>
        <i class="ri-delete-bin-line cart-remove"></i>
        `;

        cartContent.appendChild(cartBox);

        cartBox.querySelector(".cart-remove").addEventListener("click",() =>{
            cartBox.remove();

            updateCartCount(-1);

            updateTotalPrice();
        });

        cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
            const numberElement = cartBox.querySelector(".number");
            const decrementButton = cartBox.querySelector("#decrement");
            let quantity = numberElement.textContent;

            if(event.target.id === "decrement" && quantity > 1) {
                quantity--;
                if (quantity === 1){
                    decrementButton.style.color = "#999"
                }
            } else if (event.target.id == "increment"){
                quantity++;
                decrementButton.style.color = "#333";
            }

            numberElement.textContent = quantity;

            updateTotalPrice();
        });

        updateCartCount(1);

        updateTotalPrice();
};

const updateTotalPrice = () => {
    const totalPriceElement = document.querySelector(".total-price");
     const cartBoxes= cartContent.querySelectorAll(".cart-box");
     let total = 0;
     cartBoxes.forEach(cartBox => {
         const priceElement= cartBox.querySelector(".cart-price");
          const quantityElement = cartBox.querySelector(".number");
          const price = priceElement.textContent.replace("$","");
          const quantity = quantityElement.textContent;
          total += price *quantity;
     });
     totalPriceElement.textContent = `$${total}`;
};

let cartItemCount = 0;
const updateCartCount = change => {
    const cartItemCountBadge = document.querySelector(".cart-item-count");
    cartItemCount += change;
    if (cartItemCount > 0) {
        cartItemCountBadge.style.visibility = "visible";
        cartItemCountBadge.textContent = cartItemCount;
    } else {
        cartItemCountBadge.style.visibility = "hidden";
        cartItemCountBadge.textContent = "";
    }
};

const buyNowButton = document.querySelector(".btn-buy");
const mpesaButton = document.querySelector(".btn-mpesa");

buyNowButton.addEventListener("click", handlePurchase);
mpesaButton.addEventListener("click", handleMpesaPayment);

function handlePurchase() {
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    if (cartBoxes.length === 0) {
        alert("Your cart is empty. Please add items to your cart before buying");
        return;
    }

    cartBoxes.forEach(cartBox => cartBox.remove());
    cartItemCount = 0;
    updateCartCount(0);
    updateTotalPrice();
    
    alert("Thank you for your purchase! Please check your order status with our customer service.");
}

function handleMpesaPayment() {
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    const total = document.querySelector(".total-price").textContent.replace("$", "");

    if (cartBoxes.length === 0) {
        alert("Your cart is empty. Please add items to your cart before buying");
        return;
    }

    alert(`To complete your purchase via M-Pesa:
    1. Send KES ${total} to phone number: 0702823087
    2. Use reference: MEN
    3. After payment, please contact our customer service to confirm your order
    
    Thank you for choosing Men Clothes Collection!`);
}