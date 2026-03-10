import {useLiveQuery} from 'dexie-react-hooks';
import {db} from '../db/database';
import {useInventoryStore} from '../store/inventoryStore';
import {useAuthStore} from '../store/authStore';
export function useItems(){
  const{searchQuery,selectedCategoryId,sortBy,sortDir}=useInventoryStore();
  const{storeId}=useAuthStore();
  return useLiveQuery(async()=>{
    let items=await db.items.where('storeId').equals(storeId).filter(i=>!i.deletedAt).toArray();
    if(selectedCategoryId)items=items.filter(i=>i.categoryId===selectedCategoryId);
    if(searchQuery){const q=searchQuery.toLowerCase();items=items.filter(i=>i.name.toLowerCase().includes(q)||i.shortName.toLowerCase().includes(q)||(i.nameHi&&i.nameHi.includes(q))||(i.categoryDescription&&i.categoryDescription.toLowerCase().includes(q)))}
    items.sort((a,b)=>{let c=0;if(sortBy==='name')c=a.name.localeCompare(b.name);else if(sortBy==='quantity')c=a.quantity-b.quantity;else c=a.updatedAt.localeCompare(b.updatedAt);return sortDir==='asc'?c:-c});
    return items;
  },[searchQuery,selectedCategoryId,sortBy,sortDir,storeId]);
}
