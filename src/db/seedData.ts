import {v4 as uuid} from 'uuid';
import {db} from './database';
import type {Item,Category} from './database';
import {STORE_ID} from '../lib/constants';
const CATS:[string,string,string,string,string,number][]=
[['Electrical','बिजली','Electrical','zap','#F59E0B',0],['Bulbs','बल्ब','Electrical.Bulbs','lightbulb','#F59E0B',1],['Dispensers','डिस्पेंसर','Dispensers','droplets','#14B8A6',2],['Chemicals','रसायन','Chemicals','flask-conical','#8B5CF6',3],['Bins','डिब्बे','Bins','trash-2','#6B7280',4],['AC','एसी','AC','snowflake','#3B82F6',5]];
const ITEMS:[string,string,string,number,string,string][]=
[['Bulb 8000K','Bulbs 8000k','बल्ब 8000K',239,'239 good','Electrical > Bulbs > Bulbs 8000k'],['Double Plug','Double plug','डबल प्लग',16,'3 new, 13 good','Electrical > Outlets > Double plug'],['Soap Dispenser','Soap Dispensers','साबुन डिस्पेंसर',12,'12 good','Dispensers > Soap Dispensers'],['Hand Soap','Hand soap','हैंड सोप',45,'45 good','Chemicals > Hand soap'],['Disinfectant','Disinfectant','कीटाणुनाशक',30,'30 good','Chemicals > Disinfectant'],['Paper Towel Disp','Paper towel dispensers','पेपर टॉवल डिस्पेंसर',8,'8 good','Dispensers > Paper towel dispensers'],['Wall Switch','Wall switches','वॉल स्विच',25,'25 good','Electrical > Wall switches'],['Waste Bin','Waste Bins','कूड़ेदान',15,'15 good','Bins']];
export async function seedDatabase(){
  const count=await db.items.count();if(count>0)return;console.log('Seeding...');
  const now=new Date().toISOString();const catIds=new Map<string,string>();
  for(const[name,nameHi,path,icon,color,sort] of CATS){
    const id=uuid();catIds.set(path,id);
    const parentPath=path.includes('.')?path.split('.').slice(0,-1).join('.'):undefined;
    await db.categories.add({id,storeId:STORE_ID,name,nameHi,path,parentId:parentPath?catIds.get(parentPath):undefined,icon,color,sortOrder:sort,syncStatus:'synced'} as Category);
  }
  for(const[shortName,name,nameHi,qty,cond,catDesc] of ITEMS){
    await db.items.add({id:uuid(),storeId:STORE_ID,shortName,name,nameHi,quantity:qty,condition:cond,groupDescription:'Site Services Workshop',categoryDescription:catDesc,assetDescription:cond,erpPassthrough:{},createdBy:'admin',lastModifiedBy:'admin',createdAt:now,updatedAt:now,syncVersion:1,syncStatus:'synced'} as Item);
  }
  console.log('Seed done: '+ITEMS.length+' items, '+CATS.length+' categories');
}
