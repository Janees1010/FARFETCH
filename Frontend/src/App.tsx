import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ClipLoader from "react-spinners/ClipLoader";

// Lazy load components
const UserAuthForm = lazy(() => import("./pages/UserAuthForm"));
const HomePage = lazy(() => import("./pages/HomePage"));
const Navbar = lazy(() => import("./components/Navbar"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminNavbar = lazy(() => import("./components/AdminNavbar"));
const AddProduct = lazy(() => import("./pages/AddProduct"));
const ProductsListedPage = lazy(() => import("./pages/ProductsPage"));
const DetailedView = lazy(() => import("./pages/DetailedView"));
const EditProductForm = lazy(() => import("./pages/EditProduct"));
const UserCart = lazy(() => import("./pages/UserCart"));
const CheckoutPage = lazy(() => import("./pages/CheckOut"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <>
      <Suspense fallback={<div className="spinner-container flex justify-center items-center h-screen">
               <ClipLoader color="#3498db" size={50} /> {/* Customize spinner */}
          </div>}>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<HomePage />} />
            <Route path="cart" element={<UserCart />} />
            <Route path="orders/:id" element={<OrdersPage />} />
            <Route path="checkout/:id" element={<CheckoutPage type="cartCheckout" />} />
            <Route path="products/:category" element={<ProductsListedPage />} />
            <Route path="detailedView/:id" element={<DetailedView />} />
          </Route>
          <Route path='/signin' element={<UserAuthForm type="signin" />} />
          <Route path='/signup' element={<UserAuthForm type="signup" />} />
          <Route path="/admin" element={<AdminNavbar />}>
            <Route index element={<Admin />} />
            <Route path="add" element={<AddProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="edit/:id" element={<EditProductForm />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
