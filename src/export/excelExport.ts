import * as XLSX from 'xlsx';
import {db} from '../db/database';
import {ERP_COLUMN_MAP,ERP_COLUMNS} from '../shared/columnMapping';

export async function exportToExcel():Promise<void>{
  const items=await db.items.filter(i=>!i.deletedAt).toArray();
  const rows=items.map((item,index)=>{
    const row:Record<string,any>={};
    for(const col of ERP_COLUMNS){
      const def=ERP_COLUMN_MAP[col];
      if(def.generate){row[col]=def.generate(index)}
      else if(def.passthrough&&item.erpPassthrough){row[col]=item.erpPassthrough[col]??def.default??''}
      else if(def.field){let v=(item as any)[def.field];if(def.transform)v=def.transform(v);row[col]=v??def.default??''}
      else{row[col]=def.¥‚à¤šà¥€ à¤¨à¤¿‰euel():Promistem);ray();
  const wb=XLSX.utbook_new(ay'});const wb=XLSX.ut/en.heet   "sview(,{heartOrMAP,ERP_COLUray() wb=XLSX.utbook_umnendt   "svwb,w(,'hop Inventray() wb=Xwr v=eERPFwb,'
  "inven-ion ex-'+now=new Date().toISOStri'.').slic10)+'.om 'xies');
}
