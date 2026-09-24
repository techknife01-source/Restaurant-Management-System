

const RESTAURANTS = [
  { id: 1, name: "Canteen 2", tagline: "North Indian favorites", address: "Burdwan nursing home, khosbagan, Bardhaman", phone: "+91-9876543210", hours: "10:00 - 22:30" },
  { id: 2, name: "Second wife", tagline: "Signature rice and grills", address: "Boronilpur more, Bardhaman", phone: "+91-9123456780", hours: "11:00 - 23:00" },
  { id: 3, name: "Riko's cafe", tagline: "Smoky grills and wraps", address: "Golapbag more, Star mall, Bardhaman", phone: "+91-9988776655", hours: "09:00 - 21:30" },
  { id: 4, name: "Domino's", tagline: "Oven-baked pizzas and sides", address: "Burdwan Arcade, Bardhaman", phone: "+91-9612345678", hours: "11:00 - 23:30" },
  { id: 5, name: "Cheap & Best Biryani", tagline: "Best biryani on GT Road", address: "GT Road, Burdwan", phone: "+91-9870001234", hours: "10:30 - 23:00" }
];

const SELECTED_RESTAURANT_KEY = "restro_selected_restaurant";

const MENU_ITEMS = [
  { id: 1, restaurantId: 1, name: "Paneer Butter Masala", category: "Main Course", price: 220, veg: true,  desc: "Cottage cheese cubes in a rich tomato-butter gravy.", img: "https://www.ruchiskitchen.com/wp-content/uploads/2020/12/Paneer-butter-masala-recipe-3-500x375.jpg" },
  { id: 2, restaurantId: 1, name: "Butter Chicken",       category: "Main Course", price: 260, veg: false, desc: "Classic creamy tomato curry with tender chicken.",     img: "https://masalaandchai.com/wp-content/uploads/2022/03/Butter-Chicken.jpg" },
  { id: 3, restaurantId: 2, name: "Veg Biryani",          category: "Rice",        price: 190, veg: true,  desc: "Fragrant basmati rice layered with spiced vegetables.", img: "https://images.unsplash.com/photo-1531999229256-4f92f1b3ac0a?w=500" },
  { id: 4, restaurantId: 2, name: "Chicken Biryani",      category: "Rice",        price: 240, veg: false, desc: "Slow-cooked basmati rice with marinated chicken.",     img: "https://images.unsplash.com/photo-1617191513557-7baf2f3d9fa6?w=500" },
  { id: 5, restaurantId: 3, name: "Tandoori Roti",        category: "Breads",      price: 25,  veg: true,  desc: "Whole-wheat bread baked in a clay tandoor.",           img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500" },
  { id: 6, restaurantId: 3, name: "Garlic Naan",          category: "Breads",      price: 45,  veg: true,  desc: "Soft leavened bread topped with garlic and butter.",  img: "https://images.unsplash.com/photo-1512058564366-c9e6f34d1b3e?w=500" },
  { id: 7, restaurantId: 1, name: "Gulab Jamun (2 pcs)",  category: "Dessert",     price: 60,  veg: true,  desc: "Deep-fried milk dumplings soaked in sugar syrup.",     img: "https://i0.wp.com/www.chitrasfoodbook.com/wp-content/uploads/2016/10/gulab-jamun-using-mix.jpg?w=1200&ssl=1" },
  { id: 8, restaurantId: 1, name: "Cold Coffee",          category: "Beverages",   price: 90,  veg: true,  desc: "Chilled coffee blended with milk and ice cream.",      img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f2?w=500" },
  { id: 9, restaurantId: 1, name: "Paneer Tikka",         category: "Starters",    price: 180, veg: true,  desc: "Smoky grilled cottage cheese skewers served with mint chutney.", img: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500" },
  { id: 10, restaurantId: 2, name: "Chicken 65",          category: "Starters",    price: 210, veg: false, desc: "Spicy fried chicken bites with a fiery, crispy coating.", img: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=500" },
  { id: 11, restaurantId: 2, name: "Fish Curry",          category: "Main Course", price: 280, veg: false, desc: "Tender fish simmered in a rich coastal-style curry.", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500" },
  { id: 12, restaurantId: 3, name: "Masala Papad",        category: "Starters",    price: 70,  veg: true,  desc: "Crisp papad topped with onions, tomatoes, and spices.", img: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500" },
  { id: 13, restaurantId: 3, name: "Chicken Seekh Kebab", category: "Starters",    price: 220, veg: false, desc: "Minced chicken skewers cooked over charcoal with spices.", img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500" },
  { id: 14, restaurantId: 2, name: "Malai Kofta",         category: "Main Course", price: 230, veg: true,  desc: "Creamy tomato sauce with soft paneer and vegetable dumplings.", img: "https://images.unsplash.com/photo-1604908177728-6e0428fbd0f8?w=500" },
  { id: 15, restaurantId: 1, name: "Mango Lassi",          category: "Beverages",   price: 95,  veg: true,  desc: "Sweet mango yogurt drink with cardamom and ice.",      img: "https://images.unsplash.com/photo-1566763657921-4c600e7f78b4?w=500" },
  { id: 16, restaurantId: 3, name: "Butter Prawns",        category: "Main Course", price: 300, veg: false, desc: "Juicy prawns cooked in a buttery, mildly spiced sauce.", img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500" },
  { id: 17, restaurantId: 2, name: "Aloo Paratha",         category: "Breads",      price: 120, veg: true,  desc: "Stuffed potato flatbread served with yogurt and pickle.", img: "https://images.unsplash.com/photo-1585049481670-8efad5e14f6a?w=500" },
  { id: 18, restaurantId: 1, name: "Kadai Mushroom",       category: "Main Course", price: 210, veg: true,  desc: "Spiced mushrooms cooked with onions, peppers, and tomato.", img: "https://i2.wp.com/www.vegrecipesofindia.com/wp-content/uploads/2025/03/kadai-mushroom-recipe.jpg" },
  { id: 19, restaurantId: 4, name: "Margherita Pizza",      category: "Pizza",       price: 299, veg: true,  desc: "Classic tomato, mozzarella, and basil pizza with a crisp crust.", img: "https://images.unsplash.com/photo-1548365328-6514d048a32f?w=500" },
  { id: 20, restaurantId: 4, name: "Farmhouse Pizza",       category: "Pizza",       price: 349, veg: true,  desc: "Mixed vegetables, mushrooms, and cheese on a savory tomato base.", img: "https://images.unsplash.com/photo-1601924582975-4ced0c30c1ef?w=500" },
  { id: 21, restaurantId: 4, name: "Pepperoni Pizza",      category: "Pizza",       price: 399, veg: false, desc: "Spicy pepperoni slices with mozzarella cheese and herbs.", img: "https://images.unsplash.com/photo-1603096370986-3f0a5c48f071?w=500" },
  { id: 22, restaurantId: 4, name: "Cheese Burst Pizza",    category: "Pizza",       price: 429, veg: true,  desc: "Extra cheesy pizza with a molten cheese-filled crust.", img: "https://images.unsplash.com/photo-1585238342028-ec0dc9b46893?w=500" },
  { id: 23, restaurantId: 4, name: "Chicken Dominator",     category: "Pizza",       price: 459, veg: false, desc: "Loaded pizza with chicken, pepperoni, and crunchy toppings.", img: "https://images.unsplash.com/photo-1585273086818-02b4d3a5dabe?w=500" },
  { id: 24, restaurantId: 5, name: "Chicken Biryani",       category: "Biryani",     price: 220, veg: false, desc: "Classic chicken biryani with fragrant rice and masala.", img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500" },
  { id: 25, restaurantId: 5, name: "Veg Biryani",           category: "Biryani",     price: 170, veg: true,  desc: "Spiced vegetable biryani cooked with saffron and ghee.", img: "https://images.unsplash.com/photo-1617191513557-7baf2f3d9fa6?w=500" },
  { id: 26, restaurantId: 5, name: "Egg Biryani",           category: "Biryani",     price: 180, veg: false, desc: "Egg biryani with warm spices and boiled egg halves.", img: "https://images.unsplash.com/photo-1531999229256-4f92f1b3ac0a?w=500" }
];

function getSelectedRestaurantId() {
  const stored = localStorage.getItem(SELECTED_RESTAURANT_KEY);
  return stored ? Number(stored) : RESTAURANTS[0].id;
}

function setSelectedRestaurant(id) {
  localStorage.setItem(SELECTED_RESTAURANT_KEY, String(id));
}

function getSelectedRestaurant() {
  return RESTAURANTS.find(r => r.id === getSelectedRestaurantId()) || RESTAURANTS[0];
}

function getRestaurantMenuItems() {
  const restaurantId = getSelectedRestaurantId();
  return MENU_ITEMS.filter(item => item.restaurantId === restaurantId);
}
