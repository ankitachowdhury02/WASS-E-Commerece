import image1 from "../assets/Balcony.png";
import image2 from "../assets/Laptop.png";
import image3 from "../assets/Chair.png";
import image4 from "../assets/Lamp.png";
import image5 from "../assets/Kitchen.png";
import image6 from "../assets/Decorate room.png";
import image7 from "../assets/breakfast.png";
import image8 from "../assets/Flowervase.png";

export const fallbackProducts = [
  {
    id: 1,
    image: image1,
    images: [image1],
    name: "Syltherine Sheesham Chair",
    category: "Handcrafted Teak Dining Chair",
    price: "2499.00",
    discountPrice: "1749.00",
    oldPrice: "₹ 3,499",
    badge: "-30%",
    badgeType: "discount",
    sku: "SCH-001",
    stock: 35,
    sizes: ["Standard", "Armrest"],
    colors: ["Teak Natural", "Walnut Brown", "Espresso"],
    description:
      "Crafted from premium solid Sheesham wood with a lustrous teak grain, the Syltherine chair combines timeless artisanal craftsmanship with comfortable ergonomic contouring. Reinforced mortise-and-tenon joinery ensures lasting durability for dining spaces, balconies, and study nooks.",
  },
  {
    id: 2,
    image: image2,
    images: [image2],
    name: "Leviosa Ergonomic Study Chair",
    category: "Ergonomic Office Chair",
    price: "2799.00",
    discountPrice: "0.00",
    oldPrice: "",
    badge: "",
    badgeType: "",
    sku: "LCH-002",
    stock: 20,
    sizes: ["Medium", "Large"],
    colors: ["Jet Black", "Slate Grey"],
    description:
      "Engineered for all-day focus and productivity, the Leviosa study chair features breathable high-density mesh, responsive lumbar support, and adjustable tilt tension. Its smooth 360-degree swivel casters glide effortlessly across wood and carpet.",
  },
  {
    id: 3,
    image: image3,
    images: [image3],
    name: "Lolito Royal Velvet 3-Seater Sofa",
    category: "Luxury Living Room Sofa",
    price: "49999.00",
    discountPrice: "24999.00",
    oldPrice: "₹ 49,999",
    badge: "-50%",
    badgeType: "discount",
    sku: "LSF-003",
    stock: 12,
    sizes: ["3-Seater", "4-Seater"],
    colors: ["Royal Emerald", "Midnight Blue", "Warm Beige"],
    description:
      "Upholstered in sumptuous stain-resistant velvet with high-resilience foam cushioning, the Lolito sofa is the centerpiece your living room deserves. Features hand-tufted back panels, tapered solid teak legs, and plush matching bolster cushions.",
  },
  {
    id: 4,
    image: image4,
    images: [image4],
    name: "Respira Teak Outdoor Bar Stool",
    category: "Solid Wood Bar Stool",
    price: "4499.00",
    discountPrice: "0.00",
    oldPrice: "",
    badge: "New",
    badgeType: "new",
    sku: "RBS-004",
    stock: 18,
    sizes: ["Counter Height", "Bar Height"],
    colors: ["Golden Teak", "Rustic Oak"],
    description:
      "Hand-turned from kiln-dried Grade-A teak, the Respira bar stool boasts natural weather resistance and organic elegance. Features an ergonomic curved saddle seat and stainless steel brass-capped footrests for comfortable counter seating.",
  },
  {
    id: 5,
    image: image5,
    images: [image5],
    name: "Grifo Antique Brass Table Lamp",
    category: "Warm Bedside Night Lamp",
    price: "1499.00",
    discountPrice: "0.00",
    oldPrice: "",
    badge: "",
    badgeType: "",
    sku: "GLP-005",
    stock: 25,
    sizes: ["Standard"],
    colors: ["Antique Brass", "Matte Gold"],
    description:
      "A vintage-inspired silhouette with an antiqued satin brass patina, the Grifo table lamp casts a warm, soothing ambient light. Fitted with a woven fabric cord, rotary dimmer, and energy-efficient warm LED bulb.",
  },
  {
    id: 6,
    image: image6,
    images: [image6],
    name: "Muggo Jaipur Handcrafted Mug",
    category: "Studio Ceramic Coffee Mug",
    price: "399.00",
    discountPrice: "0.00",
    oldPrice: "",
    badge: "New",
    badgeType: "new",
    sku: "MUG-006",
    stock: 50,
    sizes: ["350 ml", "450 ml"],
    colors: ["Earthy Terracotta", "Ocean Glaze", "Chalk White"],
    description:
      "Individually wheel-thrown by master artisans in Jaipur, the Muggo ceramic mug brings rustic warmth to your morning coffee ritual. 100% food-safe, lead-free glazed stoneware that is both microwave and dishwasher friendly.",
  },
  {
    id: 7,
    image: image7,
    images: [image7],
    name: "Pingky Luxury Cotton King Bedding",
    category: "Pure Cotton 300TC Bed Set",
    price: "9999.00",
    discountPrice: "4999.00",
    oldPrice: "₹ 9,999",
    badge: "-50%",
    badgeType: "discount",
    sku: "PBD-007",
    stock: 15,
    sizes: ["Queen", "King"],
    colors: ["Powder Rose", "Crisp Ivory", "Dove Grey"],
    description:
      "Woven from long-staple 100% combed cotton with a lustrous 300 thread-count sateen weave, Pingky bedding is silky soft, breathable, and temperature-regulating. Includes one fitted sheet, one flat sheet, and two king pillowcases.",
  },
  {
    id: 8,
    image: image8,
    images: [image8],
    name: "Potty Khurja Ceramic Planter",
    category: "Handcrafted Ceramic Planter",
    price: "699.00",
    discountPrice: "0.00",
    oldPrice: "",
    badge: "New",
    badgeType: "new",
    sku: "PPL-008",
    stock: 40,
    sizes: ["6-inch", "8-inch", "10-inch"],
    colors: ["Speckled Sand", "Forest Moss", "Onyx"],
    description:
      "Crafted with heritage pottery techniques in Khurja, this artisanal planter features rich tactile textures and a built-in drainage port with saucer. An ideal showcase for succulents, monstera, or trailing indoor foliage.",
  },
];

export const getFallbackProductById = (id) => {
  const numericId = Number(id);
  const found = fallbackProducts.find(
    (item) => item.id === numericId || String(item.id) === String(id)
  );
  return found || null;
};
