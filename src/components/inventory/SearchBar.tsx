import {useTranslation} from 'react-i18next';
import {Search,X} from 'lucide-react';
import {useInventoryStore} from '../../store/inventoryStore';
export default function SearchBar(){
  const{t}=useTranslation();
  const{searchQuery,setSearch}=useInventoryStore();
  return(
    <div className="relative">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
      <input type="search" value={searchQuery} onChange={e=>setSearch(e.target.value)} placeholder={t('inventory.search')}
        className="w-full pl-10 pr-10 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"/>
      {searchQuery&&<button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={18}/></button>}
    </div>
  );
}
