const router = require("express").Router();
const dbModel = include("databaseAccessLayer");

function parseId(input) {
  const id = Number.parseInt(input, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validatePurchaseItem(data) {
  const itemName = (data.item_name || "").trim();
  const itemDescription = (data.item_description || "").trim();
  const cost = Number.parseFloat(data.cost);
  const quantity = Number.parseInt(data.quantity, 10);

  if (!itemName || !itemDescription) return null;
  if (!Number.isFinite(cost) || cost < 0) return null;
  if (!Number.isInteger(quantity) || quantity < 0) return null;

  return {
    item_name: itemName,
    item_description: itemDescription,
    cost,
    quantity
  };
}

router.get("/", async (req, res) => {
  try {
    const allPurchaseItems = await dbModel.getAllPurchaseItems();
    const summary = await dbModel.getPurchaseSummary();
    res.render("index", {
      allPurchaseItems: Array.isArray(allPurchaseItems) ? allPurchaseItems : [],
      summary: summary || { total_cost: 0, total_unique_items: 0 }
    });
  } catch (err) {
    res.render("error", { message: "Error reading purchase items from MySQL" });
  }
});

router.post("/addPurchaseItem", async (req, res) => {
  try {
    const validatedItem = validatePurchaseItem(req.body);
    if (!validatedItem) {
      return res.render("error", { message: "Invalid purchase item input" });
    }

    const success = await dbModel.addPurchaseItem(validatedItem);
    if (success) {
      res.redirect("/");
    } else {
      res.render("error", { message: "Error adding purchase item" });
    }
  } catch (err) {
    res.render("error", { message: "Error adding purchase item" });
  }
});

router.get("/deletePurchaseItem", async (req, res) => {
  const itemId = parseId(req.query.id);
  if (!itemId) {
    return res.render("error", { message: "Invalid purchase item id" });
  }

  const success = await dbModel.deletePurchaseItem(itemId);
  if (success) {
    res.redirect("/");
  } else {
    res.render("error", { message: "Error deleting purchase item" });
  }
});

router.get("/increaseQuantity", async (req, res) => {
  const itemId = parseId(req.query.id);
  if (!itemId) {
    return res.render("error", { message: "Invalid purchase item id" });
  }

  const success = await dbModel.increaseQuantity(itemId);
  if (success) {
    res.redirect("/");
  } else {
    res.render("error", { message: "Error increasing item quantity" });
  }
});

router.get("/decreaseQuantity", async (req, res) => {
  const itemId = parseId(req.query.id);
  if (!itemId) {
    return res.render("error", { message: "Invalid purchase item id" });
  }

  const success = await dbModel.decreaseQuantity(itemId);
  if (success) {
    res.redirect("/");
  } else {
    res.render("error", { message: "Error decreasing item quantity" });
  }
});

module.exports = router;