import {useState} from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import AuthGuard from './components/auth/AuthGuard';
import Header from './components/layout/Header';
import OfflineBanner from './components/layout/OfflineBanner';
import LanguageToggle from './components/layout/LanguageToggle';
import NavigationDrawer from './components/layout/NavigationDrawer';
import InventoryGrid from './components/inventory/InventoryGrid';
import ItemDetail from './components/inventory/ItemDetail';
import AddItemForm from './components/admin/AddItemForm';
import ImportScreen from './components/import/ImportScreen';
import ExportScreen from './components/export/ExportScreen';
import HistoryView from './components/history/HistoryView';
import {useOnlineStatus} from './hooks/useOnlineStatus';
import './i18n/config';
export default function App(){
  const[drawerOpen,setDrawerOpen]=useState(false);
  useOnlineStatus();
  return(<BrowserRouter><AuthGuard><div className="min-h-screen bg-slate-50">
    <Header onMenuToggle={()=>setDrawerOpen(true)}/><OfflineBanner/>
    <NavigationDrawer isOpen={drawerOpen} onClose={()=>setDrawerOpen(false)}/>
    <main><Routes>
      <Route path="/" element={<InventoryGrid/>}/>
      <Route path="/item/:id" element={<ItemDetail/>}/>
      <Route path="/admin/add" element={<AddItemForm/>}/>
      <Route path="/admin/edit/:id" element={<AddItemForm/>}/>
      <Route path="/import" element={<ImportScreen/>}/>
      <Route path="/export" element={<ExportScreen/>}/>
      <Route path="/history" element={<HistoryView/>}/>
    </Routes></main>
    <LanguageToggle/>
  </div></AuthGuard></BrowserRouter>);
}
