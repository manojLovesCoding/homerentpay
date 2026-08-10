import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

import TenantLayout from "./layouts/TenantLayout";
import LandlordLayout from "./layouts/LandlordLayout";
import AdminLayout from "./layouts/AdminLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";

/* Tenant pages */
import TenantDashboard from "./pages/tenant/TenantDashboard";
import PropertyDetails from "./pages/tenant/PropertyDetails";
import RentStatus from "./pages/tenant/RentStatus";
import PaymentPage from "./pages/tenant/PaymentPage";
import PaymentHistory from "./pages/tenant/PaymentHistory";
import PaymentReceipt from "./pages/tenant/PaymentReceipt";

/* Landlord pages */
import LandlordDashboard from "./pages/landloard/LandlordDashboard";
import PropertyList from "./pages/landloard/PropertyList";
import AddProperty from "./pages/landloard/AddProperty";
import TenantList from "./pages/landloard/TenantList";
import Payments from "./pages/landloard/Payments";
import Reports from "./pages/landloard/Reports";
import Profile from "./pages/landloard/Profile";

/* Admin pages */
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import AdminProperties from "./pages/admin/Properties";
import AdminPayments from "./pages/admin/Payments";
import AdminReports from "./pages/admin/Reports";
import Home from "./pages/Home";
import EditProperty from "./pages/landloard/EditProperty";
import AddTenant from "./pages/landloard/AddTenant";
import EditTenant from "./pages/landloard/EditTenant";
import UpdateTenantPassword from "./pages/landloard/UpdateTenantPassword";
import AssignTenant from "./pages/landloard/AssignTenant";
import AssignedTenants from "./pages/landloard/AssignedTenants";

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        {/* AUTH */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* ================= TENANT ================= */}
        <Route element={<ProtectedRoute allowedRoles={["tenant"]} />}>
          <Route path="/tenant" element={<TenantLayout />}>
            <Route index element={<TenantDashboard />} />
            <Route path="property" element={<PropertyDetails />} />
            <Route path="rent" element={<RentStatus />} />
            {/* <Route path="pay" element={<PaymentPage />} /> */}  
            <Route path="history" element={<PaymentHistory />} />
            <Route path="receipt" element={<PaymentReceipt />} />
          </Route>
        </Route>

        {/* ================= LANDLORD ================= */}
        <Route element={<ProtectedRoute allowedRoles={["landlord"]} />}>
          <Route path="/landlord" element={<LandlordLayout />}>
            <Route index element={<LandlordDashboard />} />

            <Route path="properties" element={<PropertyList />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="property/edit/:id" element={<EditProperty />} />
            <Route
              path="property/:id/assign-tenant"
              element={<AssignTenant />}
            />
            <Route path="assigned-tenants" element={<AssignedTenants />} />

            <Route path="tenants" element={<TenantList />} />
            <Route path="add-tenant" element={<AddTenant />} />
            <Route path="tenant/edit/:id" element={<EditTenant />} />
            <Route
              path="tenant/password/:id"
              element={<UpdateTenantPassword />}
            />

            <Route path="payments" element={<Payments />} />
            {/* <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<Profile />} /> */}
          </Route>
        </Route>

        {/* ================= ADMIN ================= */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="payments" element={<AdminPayments />} />
            {/* <Route path="reports" element={<AdminReports />} /> */}
          </Route>
        </Route>
      </Routes>
    </>
  );
};

/* ================= PUBLIC ROUTE ================= */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

export default App;
