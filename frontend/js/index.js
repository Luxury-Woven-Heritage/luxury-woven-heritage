const tshirts = [
  { id: 1, name: "THE CLASSIC - SHORT SLEEVES",color: 'SANDY BROWN', price: '1199', image: './assets/images/short-sleeves-sandy.png' },
  { id: 4, name: "THE CLASSIC - LONG SLEEVES", color: 'SANDY BROWN', price: '1499', image: './assets/images/long-sleeves-sandy.png' },
  { id: 2, name: "THE CLASSIC - SHORT SLEEVES",color: 'BLACK', price: '1199', image: './assets/images/short-sleeves-black.png' },
  { id: 5, name: "THE CLASSIC - LONG SLEEVES", color: 'BLACK', price: '1499', image: './assets/images/long-sleeves-black.png' },
  { id: 3, name: "THE CLASSIC - SHORT SLEEVES",color: 'WHITE', price: '1199', image: './assets/images/short-sleeves-white.png' },
  { id: 6, name: "THE CLASSIC - LONG SLEEVES", color: 'WHITE',price: '1499', image: './assets/images/long-sleeves-white.png' },
];

const catalogue = document.getElementById("productList__listContainer");

tshirts.forEach(tshirt => {
  const card = document.createElement('li');
  card.setAttribute("class", "productList__listItem");
  card.innerHTML = `
    <img src=${tshirt.image} alt="" class="productList__listItem-image"/>
    <p class="productList__listItem-name">${tshirt.name}<p/>
    <p class="productList__listItem-color">${tshirt.color}<p/>
    <p class="productList__listItem-price">${tshirt.price}€<p/>
  `;

  catalogue.appendChild(card);
});

const openMenuButton = document.getElementById("openMenuButton");

openMenuButton.addEventListener('click', function(e){
  const navbarMenu = document.getElementById("menuContainer");
  navbarMenu.setAttribute("class", "navbarContainer--showed")
  const html = document.querySelector("html");
  html.setAttribute("class", "yOverflowHidden");
});

const closeMenuButton = document.getElementById("closeMenuButton");

closeMenuButton.addEventListener('click', function(e){
  const navbarMenu = document.getElementById("menuContainer");
  navbarMenu.setAttribute("class", "navbarContainer--hidden")
  const html = document.querySelector("html");
  html.removeAttribute("class", "yOverflowHidden");
});