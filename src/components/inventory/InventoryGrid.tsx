import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useItems} from '../../hooks/useItems';
import {useStockAdjust} from '../../hooks/useStockAdjust';
import ItemCard from './ItemCard';
import SearchBar from './SearchBar';
import CategoryTabs from './CategoryTabs';
import StockAdjuster from './StockAdjuster';
import type {Item} from '../../db/database';

export default function InventoryGrid(){
  const{t}=useTranslation();
  const items=useItems();
  const{adjust}=useStockAdjust();
  const[adj,setAdj]=useState<Item|null>(null);
  const open=(id:string)=>{const i=items?.find(x=>x.id===id);if(i)setAdj(i)};
  const confirm=async(d:number,r:string)=>{if(adj){await adjust(adj.id,d,r);setAdj(null)}};
  return(
    <div className="flex flex-col gap-4 p-4 pb-20">
      <SearchBar/><CategoryTabs/>
      {!items?<div className="text-center py-12 text-gray-400">{t('common.loading')}</div>
       :items.length===0?<div className="text-center py-12 text-gray-400">{t('inventory.noItems')}</div>
       :<><p className="text-sm text-gray-400">{items.length} {t('inventory.items')}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map(i=><ItemCard key={i.id} item={i} onAdjust={open}/>)}
        </div></>}
      {adj&&<StockAdjuster itemName={adj.shortName||adj.name} currentQty={adj.quantity} onConfirm={confirm} onCancel={()=>setAdj(null)}/>}
    </div>
  );
}
