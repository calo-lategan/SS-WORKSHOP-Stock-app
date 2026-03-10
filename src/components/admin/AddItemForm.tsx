import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {ArrowLeft,Camera,Save} from 'lucide-react';
import {v4 as uuid} from 'uuid';
import {db} from '../../db/database';
import {useAuthStore} from '../../store/authStore';
import {useCategories} from '../../hooks/useCategories';
import type {Item} from '../../db/database';

function Input({label,value,onChange,type='text',required=false}:{label:string;value:string;onChange:(v:string)=>void;type?:string;required?:boolean}){
  return <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}{required&&' *'}</label><input type={type} value={value} onChange={e=>onChange(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/></div>;
}

export default function AddItemForm(){
  const{t}=useTranslation();const nav=useNavigate();const{storeId}=useAuthStore();const cats=useCategories();
  const[saving,setSaving]=useState(false);
  const[form,setForm]=useState({shortName:'',name:'',nameHi:'',categoryId:'',sku:'',quantity:0,assetDescription:'',remarks:''});
  const set=(k:string,v:any)=>setForm(f=>({...f,[k]:v}));
  const save=async()=>{
    if(!form.name.trim())return;setSaving(true);
    const now=new Date().toISOString();const cat=cats?.find(c=>c.id===form.categoryId);
    const item:Item={id:uuid(),storeId,shortName:form.shortName||form.name.slice(0,20),name:form.name,nameHi:form.nameHi||undefined,categoryId:form.categoryId||undefined,quantity:form.quantity,condition:form.assetDescription,remarks:form.remarks,sku:form.sku||undefined,groupDescription:'Site Services Workshop',categoryDescription:cat?.path||'',assetDescription:form.assetDescription,erpPassthrough:{},createdBy:'admin',lastModifiedBy:'admin',createdAt:now,updatedAt:now,syncVersion:1,syncStatus:'pending'};
    await db.items.add(item);
    await db.pendingSync.add({id:uuid(),table:'items',recordId:item.id,operation:'insert',data:item,createdAt:now,retries:0});
    nav('/');
  };
  return(
    <div className="pb-20">
      <div className="sticky top-14 z-30 bg-white border-b px-4 py-3 flex items-center gap-3"><button onClick={()=>nav(-1)} className="p-1 rounded-lg hover:bg-gray-100"><ArrowLeft size={22}/></button><h2 className="font-semibold text-lg">{t('admin.addItem')}</h2></div>
      <div className="p-4 space-y-4">
        <div className="w-full h-40 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 border-2 border-dashed"><Camera size={32}/><span className="text-sm">{t('item.addPhoto')}</span></div>
        <Input label={t('admin.fullName')} value={form.name} onChange={v=>set('name',v)} required/>
        <Input label={t('admin.shortName')} value={form.shortName} onChange={v=>set('shortName',v)}/>
        <Input label={t('admin.hindiName')} value={form.nameHi} onChange={v=>set('nameHi',v)}/>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.selectCategory')}</label>
          <select value={form.categoryId} onChange={e=>set('categoryId',e.target.value)} className="w-full border rounded-xl px-3 py-2.5 text-sm bg-white"><option value="">{t('admin.selectCategory')}</option>{cats?.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <Input label={t('admin.initialQty')} value={String(form.quantity)} onChange={v=>set('quantity',Number(v)||0)} type="number"/>
        <Input label={t('admin.assetDesc')} value={form.assetDescription} onChange={v=>set('assetDescription',v)}/>
        <Input label={t('item.remarks')} value={form.remarks} onChange={v=>set('remarks',v)}/>
        <button onClick={save} disabled={!form.name.trim()||saving} className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-40 flex items-center justify-center gap-2"><Save size={18}/>{saving?t('admin.saving'):t('admin.save')}</button>
      </div>
    </div>
  );
}
