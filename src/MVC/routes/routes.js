import { Router } from "express";
import { getUserByID, getUsers, createUser, loginUser} from "../contollers/users.controllers.js"
import {getAllProducts,getProductByID, createProduct, updateProduct, deleteProductByID, getStockLevels } from "../contollers/products.controllers.js"
import {getOrderByID, makeCheckout, getCompletedOrders, getSalesSummaryByProduct, getRevenueByDate, getTopSellingProducts, getOrders} from "../contollers/orders.controllers.js"
import {getCategories, createCategory} from "../contollers/categories.controllers.js"
import { contactUs } from "../contollers/contact.controllers.js";
import { uploadImage } from "../contollers/image.controllers.js";
import { upload, handleUploadErrors } from "../../multer.js";
import { getCustomerDetails, saveCustomerDetails } from "../contollers/customer.controllers.js";
const router = Router()

router.get("/users", getUsers)
router.get("users/:id", getUserByID)
router.post("/users", createUser)
router.post("/login/auth", loginUser);


router.get("/products", getAllProducts )
router.get("/products/:productid", getProductByID)
router.post("/products", createProduct )
router.put("/products/:productId", updateProduct);
router.get("/proucts/stock", getStockLevels)
router.delete("/products/:productid", deleteProductByID);


router.get("/orders", getOrders)
router.get("/orders/:id", getOrderByID)
router.get("/orders/completed" ,getCompletedOrders)
router.get("/orders/reports", getSalesSummaryByProduct)
router.get("/orders/reports/dates", getRevenueByDate)
router.get("/orders/reports/top-selling-products",getTopSellingProducts )
router.post("/checkout", makeCheckout)

router.get("/customer-details/:order_id", getCustomerDetails);
router.post("/customer-details/:order_id", saveCustomerDetails);

router.get("/categories", getCategories)
router.post("/categories", createCategory )


router.post("/upload-image/:id", upload.single('image'), handleUploadErrors, uploadImage);


router.post("/contact", contactUs )

export default router