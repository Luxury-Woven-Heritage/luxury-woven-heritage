const tshirts = [
  {
    id: 1,
    name: "T-Shirt Rouge Manche Courte",
    description: "T-shirt rouge à manches courtes en coton confortable.",
    image: "https://via.placeholder.com/200x200.png?text=Rouge+Manche+Courte",
    price: 19.99,
    model: "Manches courtes",
    color: "Rouge",
    size: "M",
    fabric: "Coton"
  },
  {
    id: 2,
    name: "T-Shirt Bleu Manche Longue",
    description: "T-shirt bleu à manches longues, parfait pour l'automne.",
    image: "https://via.placeholder.com/200x200.png?text=Bleu+Manche+Longue",
    price: 24.99,
    model: "Manches longues",
    color: "Bleu",
    size: "L",
    fabric: "Polyester"
  },
  {
    id: 3,
    name: "T-Shirt Vert Manche Courte",
    description: "T-shirt vert à manches courtes, léger et respirant.",
    image: "https://via.placeholder.com/200x200.png?text=Vert+Manche+Courte",
    price: 21.99,
    model: "Manches courtes",
    color: "Vert",
    size: "S",
    fabric: "Coton"
  },
  {
    id: 4,
    name: "T-Shirt Noir Manche Longue",
    description: "T-shirt noir élégant à manches longues, idéal pour toutes occasions.",
    image: "https://via.placeholder.com/200x200.png?text=Noir+Manche+Longue",
    price: 26.99,
    model: "Manches longues",
    color: "Noir",
    size: "M",
    fabric: "Coton/Polyester"
  },
  {
    id: 5,
    name: "T-Shirt Blanc Col V",
    description: "T-shirt blanc à col en V, confortable et stylé.",
    image: "https://via.placeholder.com/200x200.png?text=Blanc+Col+V",
    price: 18.99,
    model: "Col V",
    color: "Blanc",
    size: "L",
    fabric: "Coton"
  },
  {
    id: 6,
    name: "T-Shirt Jaune Manche Courte",
    description: "T-shirt jaune à manches courtes, parfait pour l'été.",
    image: "https://via.placeholder.com/200x200.png?text=Jaune+Manche+Courte",
    price: 20.99,
    model: "Manches courtes",
    color: "Jaune",
    size: "XL",
    fabric: "Coton"
  }
];

  const catalogue = document.getElementById("productList__listContainer");

  tshirts.forEach(tshirt => {
    const card = document.createElement('li');
    card.setAttribute("class", "productList__listItem");
    card.innerHTML = `
      <img src="" alt="" class="productList__listItem-image"/>
      <p class="productList__listItem-name">${tshirt.name}<p/>
      <p class="productList__listItem-color">${tshirt.color}<p/>
      <p class="productList__listItem-price">${tshirt.price}€<p/>
    `;

    catalogue.appendChild(card);
  });