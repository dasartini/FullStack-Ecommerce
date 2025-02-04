import { Router } from "express";
import { getUserByID, getUsers, createUser} from "../contollers/users.controllers.js"
import {getAllProducts,getProductByID, createProduct, addProductStock, updateProduct} from "../contollers/products.controllers.js"
import {getOrderByID, createOrder, makeCheckout} from "../contollers/orders.controllers.js"
import {getCategories, createCategory} from "../contollers/categories.controllers.js"

const router = Router()

router.get("/users", getUsers)
router.get("users/:id", getUserByID)
router.post("/users", createUser)

router.get("/products", getAllProducts )
router.get("/products/:id", getProductByID)
router.post("/products", createProduct )
router.patch("/:productid/add-stock", addProductStock)
router.put("/:productid/update", updateProduct)

router.get("/orders/:id", getOrderByID)
router.post("/orders" , createOrder)

router.post("/checkout", makeCheckout)


router.get("/categories", getCategories)
router.post("/categories", createCategory )

export default router