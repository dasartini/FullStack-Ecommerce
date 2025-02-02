import { Router } from "express";
import { createUser, getUsers, getUserByID,
     getAllProducts, createProduct , 
    createOrder, getOrderByID,
     getCategories, createCategory,
     addProductStock, getProductByID,
     makeCheckout,
     updateProduct} from "./controllers.js";

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