import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import LoginScreen from './screens/LoginScreen'
import ProtectedRoute from './routing/ProtectedRoute'
// import './App.css'
import Dashboard from './components/Dashboard'
import Sellers from './components/Sellers'
import SellersList from './components/SellersList'

import MasterCatalogList from "./components/MasterCatalogList";
import MasterCatalogForm from "./components/MasterCatalogForm";
import UpdateMasterProductData from "./components/UpdateMasterProductData";

function App() {
  return (

    <Router>
      {/* <Header /> */}

      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/sellers' element={<SellersList />} />
        <Route path="/mastercatalog" element={<MasterCatalogList />} />
        <Route path="/mastercatalog/create" element={<MasterCatalogForm />} />
        <Route path="/mastercatalog/update" element={<UpdateMasterProductData />} />

        <Route path='/login' element={<LoginScreen />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
          {/* <Route path='/user-profile' element={<ProfileScreen />} /> */}
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>

    </Router>
  )
}

export default App
