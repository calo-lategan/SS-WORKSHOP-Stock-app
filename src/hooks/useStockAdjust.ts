import {v4 as uuid} from 'uuid';
import {db} from '../db/database';
import type {ChangeLogEntry,PendingSync} from '../db/database';
import {useAuthStore} from '../store/authStore';
export function useStockAdjust(){
  const{role,storeId}=useAuthStore();
  const adjust=async(itemId:string,delta:number,reason:string)=>{
    const now=new Date().toISOString();const item=await db.items.get(itemId);if(!item)throw new Error('Item not found');
    const newQty=Math.max(0,item.quantity+delta);
    await db.transaction('rw',[db.items,db.changeLog,db.pendingSync],async()=>{
      await db.items.update(itemId,{quantity:newQty,updatedAt:now,lastModifiedBy:role||'worker',syncStatus:'pending',syncVersion:(item.syncVersion||0)+1});
      await db.changeLog.add({id:uuid(),storeId,itemId,action:delta>0?'increment':'decrement',quantityBefore:item.quantity,quantityAfter:newQty,quantityChange:delta,reason,performedBy:role||'worker',createdAt:now,synced:false} as ChangeLogEntry);
      await db.pendingSync.add({id:uuid(),table:'items',recordId:itemId,operation:'update',data:{quantity:newQty,updatedAt:now},createdAt:now,retries:0} as PendingSync);
    });
    return newQty;
  };
  return{adjust};
}
