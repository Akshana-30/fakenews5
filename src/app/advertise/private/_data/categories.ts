export type CategorySlug =
    | "cars-motorcycles"
    | "boats-marine"
    | "housing"
    | "bicycles"
    | "electronics"
    | "furniture-home"
    | "baby-children"
    | "clothes-fashion"
    | "garden-outdoors"
    | "miscellaneous";

export type Category = {
    slug: CategorySlug;
    name: string;
    examples: string;
    iconName: string;
    titlePlaceholder: string;
    subcategories: string[];
};

export const CATEGORIES: Category[] = [
    {
        slug: "cars-motorcycles",
        name: "Cars & Motorcycles",
        examples: "Cars, vans, motorbikes, scooters, parts",
        iconName: "Car",
        titlePlaceholder: "e.g. Volvo V70 2018, petrol, low mileage",
        subcategories: ["Cars", "Vans", "Motorbikes", "Scooters", "Parts & Accessories"],
    },
    {
        slug: "boats-marine",
        name: "Boats & Marine",
        examples: "Sailboats, motorboats, kayaks, trailers, equipment",
        iconName: "Anchor",
        titlePlaceholder: "e.g. Sailing boat 28 ft, 2015, includes trailer",
        subcategories: ["Sailboats", "Motorboats", "Kayaks & Canoes", "Trailers", "Marine Equipment"],
    },
    {
        slug: "housing",
        name: "Housing",
        examples: "Apartments, houses, rooms, holiday cottages",
        iconName: "Building2",
        titlePlaceholder: "e.g. 3-room apartment in central Linköping, 75 m²",
        subcategories: ["Apartments for Sale", "Houses for Sale", "Rooms for Rent", "Holiday Cottages", "Garages & Storage"],
    },
    {
        slug: "bicycles",
        name: "Bicycles",
        examples: "Road bikes, mountain bikes, e-bikes, kids' bikes",
        iconName: "Bike",
        titlePlaceholder: "e.g. Trek road bike, 56 cm frame, good condition",
        subcategories: ["Road Bikes", "Mountain Bikes", "E-Bikes", "Kids' Bikes", "Parts & Accessories"],
    },
    {
        slug: "electronics",
        name: "Electronics",
        examples: "Phones, computers, TVs, cameras, gaming",
        iconName: "Tv",
        titlePlaceholder: "e.g. iPhone 14 Pro, 256 GB, space black",
        subcategories: ["Phones", "Computers & Tablets", "TVs & Audio", "Cameras", "Gaming", "Other Electronics"],
    },
    {
        slug: "furniture-home",
        name: "Furniture & Home",
        examples: "Sofas, tables, beds, lamps, décor",
        iconName: "Sofa",
        titlePlaceholder: "e.g. IKEA KALLAX shelving unit, white, 2×4",
        subcategories: ["Sofas & Armchairs", "Tables & Chairs", "Beds & Mattresses", "Storage", "Lamps & Lighting", "Décor"],
    },
    {
        slug: "baby-children",
        name: "Baby & Children",
        examples: "Prams, toys, clothes, furniture, books",
        iconName: "Baby",
        titlePlaceholder: "e.g. Emmaljunga pram, nearly new, with rain cover",
        subcategories: ["Prams & Buggies", "Toys & Games", "Children's Clothes", "Furniture", "Books"],
    },
    {
        slug: "clothes-fashion",
        name: "Clothes & Fashion",
        examples: "Clothing, shoes, bags, jewellery, watches",
        iconName: "Shirt",
        titlePlaceholder: "e.g. Acne Studios jacket, size M, worn once",
        subcategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Bags & Accessories", "Jewellery & Watches"],
    },
    {
        slug: "garden-outdoors",
        name: "Garden & Outdoors",
        examples: "Tools, garden furniture, plants, sports gear",
        iconName: "Flower2",
        titlePlaceholder: "e.g. Husqvarna lawn mower, works perfectly",
        subcategories: ["Garden Furniture", "Tools & Machinery", "Plants & Seeds", "Sports Equipment", "Camping"],
    },
    {
        slug: "miscellaneous",
        name: "Miscellaneous",
        examples: "Anything else — collectibles, books, art, pets",
        iconName: "Package",
        titlePlaceholder: "e.g. Vintage vinyl records, 1970s rock, 50 pcs",
        subcategories: ["Collectibles & Antiques", "Books & Music", "Art", "Pets & Animals", "Other"],
    },
];

export function getCategoryBySlug(slug: string): Category | undefined {
    return CATEGORIES.find((c) => c.slug === slug);
}
