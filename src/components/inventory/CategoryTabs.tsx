import {useTranslation} from 'react-i18next';
import {useCategories} from '../../hooks/useCategories';
import {useInventoryStore} from '../../store/inventoryStore';
export default function CategoryTabs(){
  const{t,i18n}=useTranslation();
  const cats=useCategories();
  const{selectedCategoryId:sel,setCategory}=useInventoryStore();
  const hi=i18n.language==='hi';
  return(
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button onClick={()=>setCategory(null)} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${!sel?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t('inventory.allCategories')}</button>
      {cats?.map(c=><button key={c.id} onClick={()=>setCategory(c.id===sel?null:c.id)}
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${c.id===sel?'text-white':'text-gray-600 hover:bg-gray-200'}`}
        style={c.id===sel?{backgroundColor:c.color||'#3B82F6'}:{backgroundColor:'#F3F4F6'}}>
        {hi&&c.nameHi?c.nameHi:c.name}
      </button>)}
    </div>
  );
}
