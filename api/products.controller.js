import productsDAO from "../dao/productsDAO.js";

export default class ProductsController {
    static async apiGetProducts(req, res, next) {
        const productsPerPage = req.query.productsPerPage ? parseInt(req.query.productsPerPage, 10) : 5;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if(req.query.name) {
            filters.name = req.query.name;
        } else if(req.query.favourites) {
            filters.favourites = req.query.favourites;
        }

        const { productsList, totalNumProducts } = await productsDAO.getProducts({
            filters,
            page,
            productsPerPage
        });

        let response = {
            products: productsList,
            page: page,
            total_results: totalNumProducts
        };

        res.json(response);
    };

    static async apiAddProduct(req, res, next) {
        try {
            const sku = req.body.sku;
            const qty = req.body.qty;
            const name = req.body.name;
            const description = req.body.description;
            const date_created = new Date();

            const productResponse = await productsDAO.addProduct(
                sku,
                qty,
                name,
                description,
                date_created
            );

            res.status(200).json({ message: "Success"});
        } catch(e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateProduct(req, res, next) {
        try {
            const product_id = req.body.product_id;
            const sku = req.body.sku;
            const qty = req.body.qty;
            const name = req.body.name;
            const description = req.body.description;
            const date_updated = new Date();

            const updateResponse = await productsDAO.upadateProduct(
                product_id,
                sku,
                qty,
                name,
                description,
                date_updated
            );

            res.status(200).json({ message: "Success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteProduct(req, res, next) {
        try {
            const product_id = req.query.id;

            const reviewResponse = await productsDAO.deleteProduct(product_id);
            res.status(200).json({ message: "Success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetProductById(req, res, next) {
        try {
            let id = req.params.id || {};

            let product = await productsDAO.getProductById(id);
            if(!product) {
                res.status(400).json({ error: "Not Found" });
                return;
            }
            res.json(product);
        } catch (e) {
            console.log(`api ${e}`);
            res.status(500).json({ error: e });
        }
    }
}