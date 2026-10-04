// Mock product data: one simple array per category (no API, no backend)
// Each product has an image stored in assets/images/menu/
export const coffeeBased = [
  { id: "c1", name: "Espresso", price: 100, image: require("../assets/images/menu/espresso.png") },
  { id: "c2", name: "Cappuccino", price: 120, image: require("../assets/images/menu/cappuccino.png") },
  { id: "c3", name: "Latte", price: 130, image: require("../assets/images/menu/latte.png") },
  { id: "c4", name: "Caramel Macchiato", price: 150, image: require("../assets/images/menu/caramel-macchiato.png") },
  { id: "c5", name: "Iced Coffee", price: 110, image: require("../assets/images/menu/iced-coffee.png") },
];

export const nonCoffeeBased = [
  { id: "n1", name: "Chocolate", price: 120, image: require("../assets/images/menu/chocolate.png") },
  { id: "n2", name: "Matcha", price: 140, image: require("../assets/images/menu/matcha.png") },
  { id: "n3", name: "Milk Tea", price: 110, image: require("../assets/images/menu/milk-tea.png") },
  { id: "n4", name: "Strawberry Milk", price: 120, image: require("../assets/images/menu/strawberry-milk.png") },
];

export const soda = [
  { id: "s1", name: "Coke", price: 50, image: require("../assets/images/menu/coke.png") },
  { id: "s2", name: "Sprite", price: 50, image: require("../assets/images/menu/sprite.png") },
  { id: "s3", name: "Royal", price: 50, image: require("../assets/images/menu/royal.png") },
  { id: "s4", name: "Root Beer", price: 60, image: require("../assets/images/menu/root-beer.png") },
];

export const pastries = [
  { id: "p1", name: "Croissant", price: 90, image: require("../assets/images/menu/croissant.png") },
  { id: "p2", name: "Chocolate Muffin", price: 80, image: require("../assets/images/menu/chocolate-muffin.png") },
  { id: "p3", name: "Cinnamon Roll", price: 95, image: require("../assets/images/menu/cinnamon-roll.png") },
  { id: "p4", name: "Cheese Danish", price: 100, image: require("../assets/images/menu/cheese-danish.png") },
];

export const meals = [
  { id: "m1", name: "Chicken Sandwich", price: 150, image: require("../assets/images/menu/chicken-sandwich.png") },
  { id: "m2", name: "Club Sandwich", price: 170, image: require("../assets/images/menu/club-sandwich.png") },
  { id: "m3", name: "Pasta", price: 160, image: require("../assets/images/menu/pasta.png") },
  { id: "m4", name: "Breakfast Plate", price: 180, image: require("../assets/images/menu/breakfast-plate.png") },
];
