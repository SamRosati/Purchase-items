const router = require("express").Router();
const dbModel = include("databaseAccessLayer");

// 1. Display all restaurants
router.get("/", async (req, res) => {
  try {
    const result = await dbModel.getAllRestaurants();
    res.render("index", { allRestaurants: result });
  } catch (err) {
    res.render("error", { message: "Error reading restaurants from MySQL" });
  }
});

// 2. Add a new restaurant 
router.post("/addRestaurant", async (req, res) => {
  try {
    const success = await dbModel.addRestaurant(req.body);
    if (success) {
      res.redirect("/");
    } else {
      res.render("error", { message: "Error adding restaurant" });
    }
  } catch (err) {
    res.render("error", { message: "Error adding restaurant" });
  }
});

// 3. Delete a restaurant and its reviews
router.get("/deleteRestaurant", async (req, res) => {
  const restaurantId = req.query.id;
  if (restaurantId) {
    const success = await dbModel.deleteRestaurant(restaurantId);
    if (success) {
      res.redirect("/");
    } else {
      res.render("error", { message: "Error deleting restaurant" });
    }
  }
});

// 4. Show reviews for a specific restaurant
router.get("/showReviews", async (req, res) => {
  try {
    const restaurantId = req.query.id;
    const data = await dbModel.getReviewsByRestaurant(restaurantId);
    res.render("reviews", { 
      reviews: data.reviews, 
      restaurantName: data.restaurantName, 
      restaurantId: restaurantId 
    });
  } catch (err) {
    res.render("error", { message: "Error reading reviews" });
  }
});

// 5. Add a new review 
router.post("/addReview", async (req, res) => {
  try {
    const success = await dbModel.addReview(req.body);
    if (success) {
      res.redirect(`/showReviews?id=${req.body.restaurant_id}`);
    } else {
      res.render("error", { message: "Error adding review" });
    }
  } catch (err) {
    res.render("error", { message: "Error adding review" });
  }
});

// 6. Delete a specific review 
router.get("/deleteReview", async (req, res) => {
  const reviewId = req.query.id;
  const restaurantId = req.query.restaurant_id;
  if (reviewId) {
    const success = await dbModel.deleteReview(reviewId);
    if (success) {
      res.redirect(`/showReviews?id=${restaurantId}`);
    } else {
      res.render("error", { message: "Error deleting review" });
    }
  }
});

module.exports = router;