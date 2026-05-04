// import React from 'react';
// import { Routes, Route, useLocation } from 'react-router-dom';
// import Home from './Home';
// import Navbar from './Navbar';
// import TermsAndConditions from './Footer/Termsandcondition';
// import ShippingPolicy from './Footer/Shippingpolicy';
// import Faq from './Footer/Faq';
// import Footer from './Footer/Footer';
// import ProductDetailPage from './ProductDetailPage';
// import AboutUs from './AboutUs';
// import CartPage from './CartPage';
// import Register from './auth/Register';
// import Login from './auth/Login';
// import UpdatePassword from './auth/UpdatePassword';
// import VerifyOTP from './auth/VerifyOTP';
// import ForgetPassword from './auth/ForgetPassword';
// import CheckoutPage from './Checkout';
// import SearchResults from './SearchResults';
// import Receipt from './Receipt';
// import AdminDashboard from './admin/AdminDashboard';
// import AdminLayout from './admin/AdminLayout';
// import OrderDetailPage from './admin/OrderDetail';
// import OrdersPage from './admin/OrdersPage';
// import ViewAllProducts from './admin/ViewAllProducts';
// import StockManagement from './admin/StockManagement';
// import AdminRoute from './admin/AdminRoute';
// import EditProduct from './admin/EditProduct';
// import AddProduct from './admin/AddProduct';
// import AdminProfile from './admin/AdminProfile';
// import ProfilePage from './ProfilePage';
// import MyOrders from './MyOrders';
// import AdminUsers from './admin/AdminUser';
// import Notifications from './admin/Notifications';
// import NotFound from './Notfound';
// import ViewAllCategories from './admin/ViewAllCategories';
// import AddCategory from './admin/AddCategory';
// import CategoryPage from './CategoryPage';
// import ScrollToTop from './ScrolltoTop';
// // import { FaQ} from 'react-icons/fa';
// // import Faq from './Footer/Faq';
// import WishlistPage from './WishlistPage';
//  import ProtectedRoute from './ProtectedRoute';
// import AdminList from './admin/AdminList';



// const App = () => {
//   const location = useLocation();
//   const noLayoutRoutes = [
//     '/login',
//     '/register',
//     '/forget/password',
//     '/verifyotp',
//     '/updatepassword',
//     '/admin'
//   ];

//   const showLayout = !noLayoutRoutes.some(route =>
//     location.pathname.toLowerCase().startsWith(route)
//   );

//   return (
//     <>
//       {showLayout && <Navbar />}
//         <ScrollToTop />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="*" element={<NotFound />} />
//             <Route path="/category/:slug" element={<CategoryPage />} />
//         <Route path="/termsandcondition" element={<TermsAndConditions />} />
//         <Route path="/shippingpolicy" element={<ShippingPolicy />} />
//         <Route path="/faq" element={<Faq />} />
//         <Route path="/product/:id" element={<ProductDetailPage />} />
//         <Route path="/aboutus" element={<AboutUs />} />
//         <Route path="/cart" element={<CartPage />} />
//         {/* <Route path="/wishlist" element={<WishlistPage/>} />
//          <Route path="/checkout" element={<CheckoutPage/>} /> */}
//          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage/></ProtectedRoute>} />
// <Route path="/checkout" element={<ProtectedRoute><CheckoutPage/></ProtectedRoute>} />
         
//           <Route path="/receipt" element={<Receipt/>} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
         
//         <Route path="/forget/password" element={<ForgetPassword />} />
// {/*        
//          <Route path="/myOrders" element={<MyOrders />} /> */}
//          <Route path="/myOrders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
//               <Route path="/search" element={<SearchResults />} />
        
//          <Route path="/Updatepassword" element={<UpdatePassword />} />
//          <Route path="/myprofile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
//          {/* <Route path="/myprofile" element={<ProfilePage />} /> */}
//         <Route path="/VerifyOTP" element={<VerifyOTP />} />
        
//          <Route 
//           path="/admin/*" 
//           element={
//             <AdminRoute>
//             <AdminLayout />
//             </AdminRoute>
//           }
//         >
          
            
//           {/* <Route index element={<AdminDashboard />} />
//           <Route path='notifications' element={<Notifications/>}/>
//          <Route path="users" element={<AdminUsers />} />
//            <Route path="products" element={<ViewAllProducts />} />
//            <Route path="/admin/admins" element={<AdminList />} />
//                  <Route path="products/new" element={<AddProduct />} />
//          <Route path="products/edit/:id" element={<EditProduct />} />
//           <Route path="orders" element={<OrdersPage />} /> 
//           <Route path="orders/:orderId" element={<OrderDetailPage />} />
//           <Route path="profile" element={<AdminProfile />} />
//         <Route path="stock" element={<StockManagement />} />
//          <Route path="Categories" element={<ViewAllCategories />} />
//           <Route path="categories/new" element={<AddCategory />} /> */}
//            <Route index element={<AdminDashboard />} />
//   <Route path="users" element={<AdminUsers />} />
//   <Route path="admins" element={<AdminList />} />
//   <Route path="notifications" element={<Notifications />} />
//   <Route path="products" element={<ViewAllProducts />} />
//   <Route path="products/new" element={<AddProduct />} />
//   <Route path="products/edit/:id" element={<EditProduct />} />
//   <Route path="orders" element={<OrdersPage />} />
//   <Route path="orders/:orderId" element={<OrderDetailPage />} />
//   <Route path="profile" element={<AdminProfile />} />
//   <Route path="stock" element={<StockManagement />} />
//   <Route path="categories" element={<ViewAllCategories />} />
//   <Route path="categories/new" element={<AddCategory />} />
//         </Route>
//       </Routes>
//       {showLayout && <Footer />}
//     </>
//   );
// };

// export default App;      

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
import Navbar from './Navbar';
import TermsAndConditions from './Footer/Termsandcondition';
import ShippingPolicy from './Footer/Shippingpolicy';
// import faq from './Footer/Faq';
import Footer from './Footer/Footer';
import ProductDetailPage from './ProductDetailPage';
import AboutUs from './AboutUs';
import CartPage from './CartPage';
import Register from './auth/Register';
import Login from './auth/Login';
import UpdatePassword from './auth/UpdatePassword';
import VerifyOTP from './auth/VerifyOTP';
import ForgetPassword from './auth/ForgetPassword';
import CheckoutPage from './Checkout';
import SearchResults from './SearchResults';
import Receipt from './Receipt';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminLayout from './admin/AdminLayout';
import OrderDetailPage from './admin/OrderDetail';
import OrdersPage from './admin/OrdersPage';
import ViewAllProducts from './admin/ViewAllProducts';
import StockManagement from './admin/StockManagement';
import AdminRoute from './admin/AdminRoute';
import EditProduct from './admin/EditProduct';
import AddProduct from './admin/AddProduct';
import AdminProfile from './admin/AdminProfile';
import ProfilePage from './ProfilePage';
import MyOrders from './MyOrders';
import AdminUsers from './admin/AdminUser';
import Notifications from './admin/Notifications';
import NotFound from './Notfound';
import ViewAllCategories from './admin/ViewAllCategories';
import AddCategory from './admin/AddCategory';
import CategoryPage from './CategoryPage';
import ScrollToTop from './ScrolltoTop';
// import { FaQq } from 'react-icons/fa';
import Faq from './Footer/Faq';
import WishlistPage from './WishlistPage';
import ProtectedRoute from './ProtectedRoute';
import AdminList from './admin/AdminList';



const App = () => {
  const location = useLocation();
  const noLayoutRoutes = [
    '/login',
    '/register',
    '/forget/password',
    '/verifyotp',
    '/updatepassword',
    '/admin'
  ];

  const showLayout = !noLayoutRoutes.some(route =>
    location.pathname.toLowerCase().startsWith(route)
  );

  return (
    <>
      {showLayout && <Navbar />}
        <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/termsandcondition" element={<TermsAndConditions />} />
        <Route path="/shippingpolicy" element={<ShippingPolicy />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/cart" element={<CartPage />} />
        {/* <Route path="/wishlist" element={<WishlistPage/>} />
         <Route path="/checkout" element={<CheckoutPage/>} /> */}
         <Route path="/wishlist" element={<ProtectedRoute><WishlistPage/></ProtectedRoute>} />
<Route path="/checkout" element={<ProtectedRoute><CheckoutPage/></ProtectedRoute>} />
         
          <Route path="/receipt" element={<Receipt/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
         <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/forget/password" element={<ForgetPassword />} />
{/*        
         <Route path="/myOrders" element={<MyOrders />} /> */}
         <Route path="/myOrders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
              <Route path="/search" element={<SearchResults />} />
        
         <Route path="/Updatepassword" element={<UpdatePassword />} />
         <Route path="/myprofile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
         {/* <Route path="/myprofile" element={<ProfilePage />} /> */}
        <Route path="/VerifyOTP" element={<VerifyOTP />} />
        
         <Route 
          path="/admin/*" 
          element={
            <AdminRoute>
            <AdminLayout />
            </AdminRoute>
          }
        >
          
            
          {/* <Route index element={<AdminDashboard />} />
          <Route path='notifications' element={<Notifications/>}/>
         <Route path="users" element={<AdminUsers />} />
           <Route path="products" element={<ViewAllProducts />} />
           <Route path="/admin/admins" element={<AdminList />} />
                 <Route path="products/new" element={<AddProduct />} />
         <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<OrdersPage />} /> 
          <Route path="orders/:orderId" element={<OrderDetailPage />} />
          <Route path="profile" element={<AdminProfile />} />
        <Route path="stock" element={<StockManagement />} />
         <Route path="Categories" element={<ViewAllCategories />} />
          <Route path="categories/new" element={<AddCategory />} /> */}
           <Route index element={<AdminDashboard />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="admins" element={<AdminList />} />
  <Route path="notifications" element={<Notifications />} />
  <Route path="products" element={<ViewAllProducts />} />
  <Route path="products/new" element={<AddProduct />} />
  <Route path="products/edit/:id" element={<EditProduct />} />
  <Route path="orders" element={<OrdersPage />} />
  <Route path="orders/:orderId" element={<OrderDetailPage />} />
  <Route path="profile" element={<AdminProfile />} />
  <Route path="stock" element={<StockManagement />} />
  <Route path="categories" element={<ViewAllCategories />} />
  <Route path="categories/new" element={<AddCategory />} />
        </Route>
      </Routes>
      {showLayout && <Footer />}
    </>
  );
};

export default App;