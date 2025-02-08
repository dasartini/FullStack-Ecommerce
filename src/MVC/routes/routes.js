import { Router } from "express";
import { getUserByID, getUsers, createUser} from "../contollers/users.controllers.js"
import {getAllProducts,getProductByID, createProduct, addProductStock, updateProduct, getStockLevels, } from "../contollers/products.controllers.js"
import {getOrderByID, makeCheckout, getCompletedOrders, getSalesSummaryByProduct, getRevenueByDate, getTopSellingProducts, getOrders} from "../contollers/orders.controllers.js"
import {getCategories, createCategory} from "../contollers/categories.controllers.js"

const router = Router()

router.get("/users", getUsers)
router.get("users/:id", getUserByID)
router.post("/users", createUser)

router.get("/products", getAllProducts )
router.get("/products/:productid", getProductByID)
router.post("/products", createProduct )
router.patch("/:productid/add-stock", addProductStock)
router.put("/:productid/update", updateProduct)
router.get("/proucts/stock", getStockLevels)

router.get("/orders", getOrders)
router.get("/orders/:id", getOrderByID)
// router.post("/orders" , createOrder)
router.get("/orders/completed" ,getCompletedOrders)
router.get("/orders/reports", getSalesSummaryByProduct)
router.get("/orders/reports/dates", getRevenueByDate)
router.get("/orders/reports/top-selling-products",getTopSellingProducts )
router.post("/checkout", makeCheckout)


router.get("/categories", getCategories)
router.post("/categories", createCategory )

export default router