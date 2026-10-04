// Mock product data. Each product has a category, which decides its customization options.
export const coffeeBased = [
  { id: "c1", name: "Espresso", price: 100, category: "Coffee Based", image: require("../assets/images/menu/espresso.png") },
  { id: "c2", name: "Cappuccino", price: 120, category: "Coffee Based", image: require("../assets/images/menu/cappuccino.png") },
  { id: "c3", name: "Latte", price: 130, category: "Coffee Based", image: require("../assets/images/menu/latte.png") },
  { id: "c4", name: "Caramel Macchiato", price: 150, category: "Coffee Based", image: require("../assets/images/menu/caramel-macchiato.png") },
  { id: "c5", name: "Iced Coffee", price: 110, category: "Coffee Based", image: require("../assets/images/menu/iced-coffee.png") },
];

export const nonCoffeeBased = [
  { id: "n1", name: "Chocolate", price: 120, category: "Non Coffee Based", image: require("../assets/images/menu/chocolate.png") },
  { id: "n2", name: "Matcha", price: 140, category: "Non Coffee Based", image: require("../assets/images/menu/matcha.png") },
  { id: "n3", name: "Milk Tea", price: 110, category: "Non Coffee Based", image: require("../assets/images/menu/milk-tea.png") },
  { id: "n4", name: "Strawberry Milk", price: 120, category: "Non Coffee Based", image: require("../assets/images/menu/strawberry-milk.png") },
];

export const soda = [
  { id: "s1", name: "Coke", price: 50, category: "Soda", image: require("../assets/images/menu/coke.png") },
  { id: "s2", name: "Sprite", price: 50, category: "Soda", image: require("../assets/images/menu/sprite.png") },
  { id: "s3", name: "Royal", price: 50, category: "Soda", image: require("../assets/images/menu/royal.png") },
  { id: "s4", name: "Root Beer", price: 60, category: "Soda", image: require("../assets/images/menu/root-beer.png") },
];

export const pastries = [
  { id: "p1", name: "Croissant", price: 90, category: "Pastries", image: require("../assets/images/menu/croissant.png") },
  { id: "p2", name: "Chocolate Muffin", price: 80, category: "Pastries", image: require("../assets/images/menu/chocolate-muffin.png") },
  { id: "p3", name: "Cinnamon Roll", price: 95, category: "Pastries", image: require("../assets/images/menu/cinnamon-roll.png") },
  { id: "p4", name: "Cheese Danish", price: 100, category: "Pastries", image: require("../assets/images/menu/cheese-danish.png") },
];

export const meals = [
  { id: "m1", name: "Chicken Sandwich", price: 150, category: "Meals", image: require("../assets/images/menu/chicken-sandwich.png") },
  { id: "m2", name: "Club Sandwich", price: 170, category: "Meals", image: require("../assets/images/menu/club-sandwich.png") },
  { id: "m3", name: "Pasta", price: 160, category: "Meals", image: require("../assets/images/menu/pasta.png") },
  { id: "m4", name: "Breakfast Plate", price: 180, category: "Meals", image: require("../assets/images/menu/breakfast-plate.png") },
];
