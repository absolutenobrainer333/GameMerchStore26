const { sequelize, DbContext } = require("./dbcontext/sequelize");

const categories = [
  { id: 1, name: "Phasmophobia" },
  { id: 2, name: "Valorant" },
];

const products = [
  // Phasmophobia
  { id: 1,  name: "Hand-sized Book",             image: "book.jpg",         description: "A hand-sized ghost hunting journal from Phasmophobia.",       price: 10, categoryId: 1 },
  { id: 2,  name: "Tarot Cards Crop Hoodie",      image: "cardcrophood.jpg", description: "Phasmophobia tarot cards design crop hoodie.",                price: 35, categoryId: 1 },
  { id: 3,  name: "Tarot Cards Hoodie",           image: "cardhood.jpg",     description: "Phasmophobia tarot cards design full hoodie.",                price: 40, categoryId: 1 },
  { id: 4,  name: "Catch Me On Phasmo T-shirt",   image: "catchtee.jpg",     description: "Funny Phasmophobia slogan tee.",                              price: 20, categoryId: 1 },
  { id: 5,  name: "Navy-Blue Emote Cap",          image: "dancecap.jpg",     description: "Navy blue cap featuring the Phasmophobia dance emote.",       price: 20, categoryId: 1 },
  { id: 6,  name: "UV Hand-Print Crop-Hoodie",    image: "handcrophood.jpg", description: "Crop hoodie with UV-reactive hand prints.",                   price: 35, categoryId: 1 },
  { id: 7,  name: "UV Hand-Print Hoodie",         image: "handhood.jpg",     description: "Full hoodie with UV-reactive hand prints.",                   price: 40, categoryId: 1 },
  { id: 8,  name: "Haunted Mirror Keychain",      image: "keychain.jpg",     description: "Spooky haunted mirror keychain inspired by Phasmophobia.",    price: 8,  categoryId: 1 },
  { id: 9,  name: "Ghost-Orb Hunting T-shirt",    image: "lies.jpg",         description: "T-shirt with ghost orb hunting theme.",                       price: 18, categoryId: 1 },
  { id: 10, name: "UV Hand-Print Mug",            image: "memug.jpg",        description: "Mug with UV-reactive hand print design.",                     price: 15, categoryId: 1 },
  { id: 11, name: "Music Box",                    image: "musicbox.jpg",     description: "Replica Phasmophobia music box collectible.",                 price: 25, categoryId: 1 },
  { id: 12, name: "Glow-In-The-Dark Pendant",     image: "pendant.jpg",      description: "Glow-in-the-dark pendant necklace.",                          price: 15, categoryId: 1 },
  { id: 13, name: "Life's A Revenant T-Shirt",    image: "revshirt.jpg",     description: "Phasmophobia Revenant themed t-shirt.",                       price: 18, categoryId: 1 },
  { id: 14, name: "White Handprints T-Shirt",     image: "teescare.jpg",     description: "White handprint pattern t-shirt.",                            price: 18, categoryId: 1 },
  { id: 15, name: "Tarot Card Themed Uno Cards",  image: "uno.jpg",          description: "Uno card deck with Phasmophobia tarot card designs.",         price: 12, categoryId: 1 },
  { id: 16, name: "Voodoo Doll Plushy",           image: "voodooboo.jpg",    description: "Soft plush voodoo doll inspired by Phasmophobia.",            price: 25, categoryId: 1 },
  // Valorant
  { id: 17, name: "Mind-blown Jett T-Shirt",      image: "bruhwut.jpg",      description: "Jett reaction meme t-shirt.",                                 price: 20, categoryId: 2 },
  { id: 18, name: "Cat Beanie",                   image: "cat.jpg",          description: "Cute cat beanie with Valorant flair.",                        price: 12, categoryId: 2 },
  { id: 19, name: "Cypher Black Phone Cover",     image: "cypherblack.jpg",  description: "Black Cypher-themed phone cover.",                            price: 15, categoryId: 2 },
  { id: 20, name: "Cypher White Phone Cover",     image: "cypherwhite.jpg",  description: "White Cypher-themed phone cover.",                            price: 15, categoryId: 2 },
  { id: 21, name: "Deadlock T-shirt",             image: "dloc.jpg",         description: "Deadlock agent graphic t-shirt.",                             price: 22, categoryId: 2 },
  { id: 22, name: "Gekko T-Shirt",                image: "gekkotee.jpg",     description: "Gekko agent graphic t-shirt.",                                price: 20, categoryId: 2 },
  { id: 23, name: "Cool Pixel Glasses",           image: "glass.jpg",        description: "Retro pixel art glasses.",                                    price: 10, categoryId: 2 },
  { id: 24, name: "T-pose Omen T-Shirt",          image: "omentee.jpg",      description: "Omen t-pose meme t-shirt.",                                   price: 22, categoryId: 2 },
  { id: 25, name: "Penguin Dabbing T-shirt",      image: "pendab.jpg",       description: "Penguin dabbing Valorant fan art tee.",                       price: 18, categoryId: 2 },
  { id: 26, name: "Valorant Poster",              image: "poster.jpg",       description: "High-quality Valorant art poster.",                           price: 10, categoryId: 2 },
  { id: 27, name: "Valorant Stickers",            image: "stickers.jpg",     description: "Sheet of Valorant agent stickers.",                           price: 8,  categoryId: 2 },
  { id: 28, name: "Yoru Bottle",                  image: "thirsty.jpg",      description: "Yoru-themed water bottle.",                                   price: 20, categoryId: 2 },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");

    await sequelize.sync({ alter: true });
    console.log("Tables synced.");

    await DbContext.Category.bulkCreate(categories, {
      updateOnDuplicate: ["name"],
    });
    console.log(`Seeded ${categories.length} categories.`);

    await DbContext.Product.bulkCreate(products, {
      updateOnDuplicate: ["name", "image", "description", "price", "categoryId"],
    });
    console.log(`Seeded ${products.length} products.`);

    console.log("\nDone. Database is ready.");
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await sequelize.close();
  }
}

seed();
