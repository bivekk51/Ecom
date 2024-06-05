
let noOfItemsInCart = 0;


document.addEventListener('DOMContentLoaded', (event) => {

    document.querySelector('.registerpage').style.display = 'none';
    document.querySelector('.loginpage').style.display = 'none';
});

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


function renderProducts(products) {
    const productsContainer = document.getElementById('products');
    productsContainer.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4';
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'bg-white rounded overflow-hidden shadow-lg p-4 flex flex-col justify-between leading-normal cursor-pointer hover:bg-gray-100';
        productDiv.innerHTML = `
            <div class="mb-8">
                <div class="mb-4">
                    <img class="w-full h-64 object-cover object-center" src="${product.image}" alt="${product.title}">
                </div>
                <div class="mb-2">
                    <h2 class="text-xl font-bold text-gray-900">${product.title}</h2>
                    <p class="text-gray-700 text-base">${product.description}</p>
                </div>
            </div>
            <div class="flex items-center justify-between">
                <p class="text-gray-900 font-bold">Price: $${product.price}</p>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onclick="addCart(${product.id})">Add to cart</button>
            </div>
        `;

        productsContainer.appendChild(productDiv);
    });
}

async function userRegister() {
    const name = document.getElementById('name').value
    const regemail = document.getElementById('regemail').value
    const regpassword = document.getElementById('regpassword').value
    const gender = document.querySelector('input[name="gen"]:checked')?.value;
    if (!validateName(name))
        alert("Please enter valid name")
    else if (!validateEmail(regemail))
        alert("Please enter valid email")
    else if (!validatePassword(regpassword))
        alert("Make sure your password is 8 characters long")
    else if (!gender)
        alert("Please select a gender")
    else {
        const hashedPassword = await hashPassword(regpassword);
        const user = {
            name: name,
            email: regemail,
            password: hashedPassword,
            gender: gender
        };
        localStorage.setItem(regemail, JSON.stringify(user))
        alert("You are succesfully registered")
        showHome()
    }
}

function validateName(name) {
    var namePattern = /^[a-zA-Z\s-]+$/;
    if (!namePattern.test(name) || !name)
        return false
    else
        return true
}

function validateEmail(regemail) {
    var emailPattern = /^[^@]+@\w+(\.\w+)+\w$/
    if (!emailPattern.test(regemail) || !regemail)
        return false
    else
        return true
}
function validatePassword(regpassword) {
    if (regpassword.length < 8)
        return false
    else
        return true
}

async function userLogin() {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const userInfo = JSON.parse(localStorage.getItem(email))
    if (userInfo) {
        const hashedPassword = await hashPassword(password);
        if (userInfo.password == hashedPassword) {
            alert("login succesful")
            showHome()
        }
        else {
            alert("Wrong password")
        }
    }
    else
        alert("Please enter valid Email")
}

function showLogin() {
    document.querySelector('.loginpage').style.display = 'block';
    document.querySelector('.registerpage').style.display = 'none';
    document.getElementById('products').style.display = 'none';
}

function showRegister() {
    document.querySelector('.loginpage').style.display = 'none';
    document.querySelector('.registerpage').style.display = 'block';
    document.getElementById('products').style.display = 'none';
}

function showHome() {
    document.querySelector('.loginpage').style.display = 'none';
    document.querySelector('.registerpage').style.display = 'none';
    document.getElementById('products').style.display = 'block';
}


async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
let cartItems = [];

function showCart() {
    document.getElementById("cartdiv").style.display = 'block';
    document.querySelector('.loginpage').style.display = 'none';
    document.querySelector('.registerpage').style.display = 'none';
    document.getElementById('products').style.display = 'none';
    updateCartDisplay();
}

function addCart(id) {
    fetchToCart(id);
    noOfItemsInCart++;
    showcarts(noOfItemsInCart);
}

function showcarts(noOfItemsInCart) {
    const cart = document.getElementById('cart');
    cart.innerHTML = noOfItemsInCart;
}

function fetchToCart(id) {
    fetch(`https://fakestoreapi.com/products/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            addToCart(data);
        })
        .catch(error => console.error('Error:', error));
}

function addToCart(product) {
    cartItems.push(product);
    updateCartDisplay();
}

function deleteFromCart(productId) {
    cartItems = cartItems.filter(product => product.id !== productId);
    noOfItemsInCart--;
    showcarts(noOfItemsInCart);
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cartdiv');
    cartContainer.className = 'p-4';
    cartContainer.innerHTML = `
        <h2 class="text-3xl font-bold mb-6 text-center text-blue-500">Items in Cart</h2>
        <div class="flex flex-col space-y-4">
        </div>
    `;

    const listContainer = cartContainer.querySelector('.flex');

    cartItems.forEach(product => {
        const cartDiv = document.createElement('div');
        cartDiv.className = 'bg-white rounded overflow-hidden shadow-lg p-4 flex items-center space-x-4 hover:bg-gray-100';
        cartDiv.innerHTML = `
            <div class="w-24 h-24">
                <img class="w-full h-full object-cover object-center" src="${product.image}" alt="${product.title}">
            </div>
            <div class="flex flex-col flex-grow">
                <h2 class="text-xl font-bold text-gray-900">${product.title}</h2>
                <p class="text-gray-700 text-base">${product.description}</p>
                <p class="text-gray-900 font-bold">Price: $${product.price}</p>
            </div>
            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onclick="deleteFromCart(${product.id})">Delete</button>
        `;

        listContainer.appendChild(cartDiv);
    });
}


