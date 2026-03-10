import * as XLSX from 'xlsx';
import {v4 as uuid} from 'uuid';
import {db} from '../db/database';
import type {Item,PendingSync} from '../db/database';
import {REQUIRED_COLUMNS,PASSTHROUGH_COLUMNS} from '../shared/columnMapping';
export type ImportMode='full_sync'|'add_update_only';
export interface ImportPreviewItem{status:'new'|'update'|'same'|'removed';erpData:Record<string,any>;existingItem?:Item;changes?:string[]}
export interface ImportResult{success:boolean;added:number;updated:number;unchanged:number;removed:number;errors:string[]}
export async function parseERPFile(file:File){
  const buf=await file.arrayBuffer();const wb=XLSX.read(buf,{type:'array'});const ws=wb.Sheets[wb.SheetNames[0]];
  const rows=XLSX.utils.sheet_to_json<Record<string,any>>(ws);
  if(rows.length===0)return{valid:false,rows:[] as Record<string,any>[],errors:['File is empty'],missingColumns:[] as string[]};
  const cols=Object.keys(rows[0]);const miss=REQUIRED_COLUMNS.filter(c=>!cols.some(f=>f.trim()===c));
  if(miss.length>0)return{valid:false,rows:[] as Record<string,any>[],errors:['Missing: '+miss.join(', ')],missingColumns:miss};
  return{valid:true,rows,errors:[] as string[],missingColumns:[] as string[]};
}
export async function generateImportPreview(rows:Record<string,any>[],mode:ImportMode,storeId:string):Promise<ImportPreviewItem[]>{
  const existing=await db.items.where('storeId').equals(storeId).filter(i=>!i.deletedAt).toArray();
  const byName=new Map(existing.map(i=>[i.name.toLowerCase().trim(),i]));
  const preview:ImportPreviewItem[]=[];const matched=new Set<string>();
  for(const row of rows){
    const nm=(row['Name']||'').toString().toLowerCase().trim();const ex=byName.get(nm);
    if(!ex){preview.push({status:'new',erpData:row})}
    else{matched.add(ex.id);const ch:string[]=[];
      if(ex.quantity!==Number(row['Used']||0))ch.push('quantity');
      if(ex.categoryDescription!==(row['Category Description']||''))ch.push('category');
      if(ex.assetDescription!==(row['Asset Description']||''))ch.push('condition');
      preview.push({status:ch.length>0?'update':'same',erpData:row,existingItem:ex,changes:ch})}
  }
  if(mode==='full_sync'){for(const i of existing)if(!matched.has(i.id))preview.push({status:'removed',erpData:{},existingItem:i})}
  return preview;
}
export async function executeImport(preview:ImportPreviewItem[],mode:ImportMode,storeId:string):Promise<ImportResult>{
  const res:ImportResult={success:true,added:0,updated:0,unchanged:0,removed:0,errors:[]};const now=new Date().toISOString();
  await db.transaction('rw',[db.items,db.changeLog,db.pendingSync,db.categories],async()=>{
    for(const e of preview){try{
      if(e.status==='new'){
        const pt:Record<string,any>={};for(const c of PASSTHROUGH_COLUMNS)pt[c]=e.erpData[c]??'';
        const ni:Item={id:uuid(),storeId,shortName:(e.erpData['Short Name']||e.erpData['Name']||'').toString().slice(0,20),name:(e.erpData['Name']||'').toString(),quantity:Number(e.erpData['Used']||0),condition:(e.erpData['Asset Description']||'').toString(),remarks:(e.erpData['Remarks']||'').toString(),sku:(e.erpData['Stock Keeping Unit']||'').toString(),groupDescription:(e.erpData['Group Description']||'Site Services Workshop').toString(),subGroupDescription:(e.erpData['Sub Group Description']||'').toString(),categoryDescription:(e.erpData['Category Description']||'').toString(),subCategoryDescription:(e.erpData['Sub Category Description']||'').toString(),assetDescription:(e.erpData['Asset Description']||'').toString(),assetCost:e.erpData['Asset Cost']?Number(e.erpData['Asset Cost']):undefined,erpPassthrough:pt,createdBy:'admin',lastModifiedBy:'admin',createdAt:now,updatedAt:now,syncVersion:1,syncStatus:'pending'};
        await db.items.add(ni);await db.pendingSync.add({id:uuid(),table:'items',recordId:ni.id,operation:'insert',data:ni,createdAt:now,retries:0} as PendingSync);res.added++;
      }else if(e.status==='update'&&e.existingItem){
        const up:Partial<Item>={quantity:Number(e.erpData['Used']||0),categoryDescription:(e.erpData['Category Description']||'').toString(),assetDescription:(e.erpData['Asset Description']||'').toString(),remarks:(e.erpData['Remarks']||'').toString(),updatedAt:now,lastModifiedBy:'admin',syncStatus:'pending'};
        await db.items.update(e.existingItem.id,up);await db.pendingSync.add({id:uuid(),table:'items',recordId:e.existingItem.id,operation:'update',data:up,createdAt:now,retries:0} as PendingSync);res.updated++;
      }else if(e.status==='removed'&&mode==='full_sync'&&e.existingItem){
        await db.items.update(e.existingItem.id,{deletedAt:now,syncStatus:'pending'});await db.pendingSync.add({id:uuid(),table:'items',recordId:e.existingItem.id,operation:'delete',data:{deletedAt:now},createdAt:now,retries:0} as PendingSync);res.removed++;
      }else if(e.status==='same'){res.unchanged++}
    }catch(err:any){res.errors.push(err.message)}}
  });
  res.success=res.errors.length===0;return res;
}
