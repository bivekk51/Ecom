
let noOfItemsInCart=0;
function renderProducts(products) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = ''; 
  
    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.className = 'product';
  
      productDiv.innerHTML = `
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <img src="${product.image}" alt="${product.title}" width="100">
        <button onclick="increaseCart()">Add to cart</button>
      `;
  
      productsContainer.appendChild(productDiv);
    });
  }
  
  
  fetch('https://fakestoreapi.com/products')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      renderProducts(data);
    })
    .catch(error => console.error('Error:', error));
  
    function showLogin(){

    }

    function showRegister(){

    }

    function showHome(){

    }

    function increaseCart(){
        noOfItemsInCart++
        showcarts(noOfItemsInCart)
    }
    function showcarts(noOfItemsInCart){
        const cart=document.getElementById('cart')
        cart.innerHTML=noOfItemsInCart
    }