const database = include("/databaseConnection");

// --- RESTAURANT FUNCTIONS ---
async function getAllRestaurants() {
    const sql = "SELECT * FROM restaurant;";
    try {
        const results = await database.query(sql);
        return results[0];
    } catch (err) {
        console.log(err); return null;
    }
}

async function addRestaurant(postData) {
    const sql = "INSERT INTO restaurant (name, description) VALUES (:name, :description);";
    const params = { name: postData.name, description: postData.description };
    try {
        await database.query(sql, params);
        return true;
    } catch (err) {
        console.log(err); return false;
    }
}

async function deleteRestaurant(id) {
    try {
        // Must delete reviews first because of FK constraint 
        await database.query("DELETE FROM review WHERE restaurant_id = :id;", { id });
        await database.query("DELETE FROM restaurant WHERE restaurant_id = :id;", { id });
        return true;
    } catch (err) {
        console.log(err); return false;
    }
}

// --- REVIEW FUNCTIONS ---
async function getReviewsByRestaurant(restaurantId) {
    const sql = "SELECT * FROM review WHERE restaurant_id = :id;";
    const sqlRest = "SELECT name FROM restaurant WHERE restaurant_id = :id;";
    try {
        const reviews = await database.query(sql, { id: restaurantId });
        const restaurant = await database.query(sqlRest, { id: restaurantId });
        return { reviews: reviews[0], restaurantName: restaurant[0][0].name };
    } catch (err) {
        console.log(err); return null;
    }
}

async function addReview(postData) {
    const sql = `INSERT INTO review (restaurant_id, reviewer_name, details, rating) 
                 VALUES (:r_id, :name, :details, :rating);`;
    const params = { 
        r_id: postData.restaurant_id, 
        name: postData.reviewer_name, 
        details: postData.details, 
        rating: postData.rating 
    };
    try {
        await database.query(sql, params);
        return true;
    } catch (err) {
        console.log(err); return false;
    }
}

async function deleteReview(id) {
    const sql = "DELETE FROM review WHERE review_id = :id;";
    try {
        await database.query(sql, { id });
        return true;
    } catch (err) {
        console.log(err); return false;
    }
}

module.exports = { 
    getAllRestaurants, addRestaurant, deleteRestaurant,
    getReviewsByRestaurant, addReview, deleteReview 
};