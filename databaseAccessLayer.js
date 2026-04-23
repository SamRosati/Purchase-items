const database = include("/databaseConnection");

async function getAllPurchaseItems() {
    const sql = `
        SELECT purchase_item_id, item_name, item_description, cost, quantity
        FROM purchase_item
        ORDER BY purchase_item_id;
    `;
    try {
        const results = await database.query(sql);
        return results[0];
    } catch (err) {
        console.log(err); return null;
    }
}

async function addPurchaseItem(postData) {
    const sql = `
        INSERT INTO purchase_item (item_name, item_description, cost, quantity)
        VALUES (?, ?, ?, ?);
    `;
    const params = [
        postData.item_name,
        postData.item_description,
        postData.cost,
        postData.quantity
    ];
    try {
        await database.query(sql, params);
        return true;
    } catch (err) {
        console.log("addPurchaseItem error:", err);
        return false;
    }
}

async function deletePurchaseItem(id) {
    const sql = "DELETE FROM purchase_item WHERE purchase_item_id = :id;";
    try {
        await database.query(sql, { id });
        return true;
    } catch (err) {
        console.log(err); return false;
    }
}

async function increaseQuantity(id) {
    const sql = `
        UPDATE purchase_item
        SET quantity = quantity + 1
        WHERE purchase_item_id = :id;
    `;
    try {
        await database.query(sql, { id });
        return true;
    } catch (err) {
        console.log(err); return null;
    }
}

async function decreaseQuantity(id) {
    const sql = `
        UPDATE purchase_item
        SET quantity = quantity - 1
        WHERE purchase_item_id = :id
          AND quantity > 0;
    `;
    try {
        await database.query(sql, { id });
        return true;
    } catch (err) {
        console.log(err); return false;
    }
}

async function getPurchaseSummary() {
    const sql = `
        SELECT
            COALESCE(SUM(cost * quantity), 0) AS total_cost,
            COUNT(*) AS total_unique_items
        FROM purchase_item;
    `;
    try {
        const results = await database.query(sql);
        return results[0][0];
    } catch (err) {
        console.log(err); return null;
    }
}

module.exports = { 
    getAllPurchaseItems,
    addPurchaseItem,
    deletePurchaseItem,
    increaseQuantity,
    decreaseQuantity,
    getPurchaseSummary
};