import mongodb, { ObjectId } from "mongodb";
const objectId = mongodb.ObjectId;

let products;

export default class productsDAO {
    static async injectDB(conn) {
        if(products) {
            return
        }
        try {
            products = await conn.db(process.env.PRODUCTS_NS).collection("products");
        } catch(e) {
            console.error(
                `Unable to establish a collection handle in productsDAO: ${e}`
            );
        }
    };

    static async getProducts({
        filters = null,
        page = 0,
        productsPerPage = 5
    } = {}) {
        let query;
        if (filters) {
            if ("name" in filters) {
                query = { $text: { $search: filters["name"]} };
            } else if ("favourites" in filters) {
                query = { "favourite": { $eq: filters["favourites"]} };
            }
        }

        let cursor;
        try {
            cursor = await products.find(query);
        } catch(e) {
            console.error(`Unable to issue find command ${e}`);
            return { productsList: [], totalNumProducts: 0 };
        }

        const displayCursor = cursor.limit(productsPerPage).skip(productsPerPage * page);

        try {
            const productsList = await displayCursor.toArray();
            const totalNumProducts = await products.countDocuments(query);

            return { productsList, totalNumProducts};
        } catch(e) {
            console.error(
                `Unable to convert cursor in to array or problem counting documents: ${e}`
            );

            return { productsList: [], totalNumProducts: 0 };
        }
    };

    static async getProductById(program_id) {
        try {
            const product = await products.findOne({ _id: objectId(program_id) });

            return product;
        } catch (e) {
            console.error(`Something went wrong with get program by id: ${e}`);
            throw e;
        }
    }

    static async addProduct(sku, qty, name, description, date_created) {
        try {
            const productDoc = {
                sku: sku,
                qty: qty,
                name: name,
                description: description,
                date_created: date_created
            };

            return await products.insertOne(productDoc);
        } catch (e) {
            console.error(
                `Unable to add product: ${e}`
            );
            return { error: e };
        }
    };

    static async upadateProduct(product_id, sku, qty, name, description, date_updated) {
        try {
            const updateResponse = await products.updateOne(
                { _id: ObjectId(product_id) },
                { $set: {
                    sku: sku,
                    qty: qty,
                    name: name,
                    description: description,
                    date_updated: date_updated }
                }
            );

            return updateResponse;
        } catch (e) {
            console.error(
                `Unable to update product: ${e}`
            );
            return { error: e };
        }
    };

    static async deleteProduct(product_id) {
        try {
            const deleteResponse = await products.deleteOne({ _id: objectId(product_id) });

            return deleteResponse;
        } catch (e) {
            console.error(
                `Unable to delete the product ${e}`
            );

            return { error: e };
        }
    }
}