import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {v4 as uuid} from 'uuid';
import {useItems} from '../../hooks/useItems';
import {useStockAdjust} from '../../hooks/useStockAdjust';
import {db} from '../../db/database';
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
  const[delId,setDelId]=useState<string|null>(null);
  const open=(id:string)=>{const i=items?.find(x=>x.id===id);if(i)setAdj(i)};
  const doConfirm=async(d:number,r:string)=>{if(adj){await adjust(adj.id,d,r);setAdj(null)}};
  const confirmDelete=async()=>{
    if(!delId)return;
    const now=new Date().toISOString();
    await db.items.update(delId,{deletedAt:now,syncStatus:'pending'});
    await db.pendingSync.add({id:uuid(),table:'items',recordId:delId,operation:'delete',data:{deletedAt:now},createdAt:now,retries:0} as any);
    setDelId(null);
  };
  return(
    <div className="flex flex-col gap-4 p-4 pb-20">
      <SearchBar/><CategoryTabs/>
      {!items?<div className="text-center py-12 text-gray-400">{t('common.loading')}</div>
       :items.length===0?<div className="text-center py-12 text-gray-400">{t('inventory.noItems')}</div>
       :<><p className="text-sm text-gray-400">{items.length} {t('inventory.items')}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map(i=><ItemCard key={i.id} item={i} onAdjust={open} onDelete={setDelId}/>)}
        </div></>}
      {adj&&<StockAdjuster itemName={adj.shortName||adj.name} currentQty={adj.quantity} onConfirm={doConfirm} onCancel={()=>setAdj(null)}/>}
      {delId&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 space-y-4">
          <h3 className="font-semibold text-lg">{t('item.delete')}</h3>
          <p className="text-gray-600 text-sm">{t('dashboard.confirmDelete')}</p>
          <div className="flex gap-3">
            <button onClick={()=>setDelId(null)} className="flex-1 py-2.5 border rounded-xl text-gray-700">{t('common.cancel')}</button>
            <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl">{t('common.confirm')}</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
