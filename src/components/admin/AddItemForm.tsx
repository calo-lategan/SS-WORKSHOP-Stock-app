import {useState,useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate,useParams} from 'react-router-dom';
import {ArrowLeft,Save,Languages} from 'lucide-react';
import {v4 as uuid} from 'uuid';
import {db} from '../../db/database';
import {useAuthStore} from '../../store/authStore';
import {useCategories} from '../../hooks/useCategories';
import {translateHiToEn} from '../../lib/translate';
import PhotoPlaceholder from '../inventory/PhotoPlaceholder';
import type {Item} from '../../db/database';

function Input({label,value,onChange,type='text',required=false,suffix}:{label:string;value:string;onChange:(v:string)=>void;type?:string;required?:boolean;suffix?:React.ReactNode}){
  return <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}{required&&' *'}</label><div className="flex gap-2"><input type={type} value={value} onChange={e=>onChange(e.target.value)} className="flex-1 border rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>{suffix}</div></div>;
}

export default function AddItemForm(){
  const{t}=useTranslation();
  const nav=useNavigate();
  const{id:editId}=useParams<{id:string}>();
  const{storeId}=useAuthStore();
  const cats=useCategories();
  const[saving,setSaving]=useState(false);
  const[translating,setTranslating]=useState(false);
  const[photo,setPhoto]=useState<string|undefined>(undefined);
  const[form,setForm]=useState({shortName:'',name:'',nameHi:'',categoryId:'',sku:'',quantity:0,assetDescription:'',remarks:''});
  const set=(k:string,v:any)=>setForm(f=>({...f,[k]:v}));

  // Load existing item when editing
  useEffect(()=>{
    if(!editId)return;
    db.items.get(editId).then(item=>{
      if(!item)return;
      setForm({shortName:item.shortName||'',name:item.name||'',nameHi:item.nameHi||'',categoryId:item.categoryId||'',sku:item.sku||'',quantity:item.quantity||0,assetDescription:item.assetDescription||'',remarks:item.remarks||''});
      if(item.photoThumbnail)setPhoto(item.photoThumbnail);
    });
  },[editId]);

  const doTranslate=async()=>{
    if(!form.nameHi.trim())return;
    setTranslating(true);
    const en=await translateHiToEn(form.nameHi);
    if(en&&en!==form.nameHi){set('name',en);if(!form.shortName)set('shortName',en.slice(0,20))}
    setTranslating(false);
  };

  const save=async()=>{
    if(!form.name.trim()&&!form.nameHi.trim())return;
    setSaving(true);
    if(!form.name.trim()&&form.nameHi.trim()){const en=await translateHiToEn(form.nameHi);set('name',en)}
    const finalName=form.name.trim()||form.nameHi.trim();
    const now=new Date().toISOString();
    const cat=cats?.find(c=>c.id===form.categoryId);

    if(editId){
      // Update existing item
      await db.items.update(editId,{
        shortName:form.shortName||finalName.slice(0,20),
        name:finalName,nameHi:form.nameHi||undefined,
        categoryId:form.categoryId||undefined,
        quantity:form.quantity,condition:form.assetDescription,
        remarks:form.remarks,sku:form.sku||undefined,
        categoryDescription:cat?.path||'',
        assetDescription:form.assetDescription,
        photoThumbnail:photo,
        updatedAt:now,syncStatus:'pending',lastModifiedBy:'admin'
      });
      await db.pendingSync.add({id:uuid(),table:'items',recordId:editId,operation:'update',data:{updatedAt:now},createdAt:now,retries:0} as any);
    } else {
      // Create new item
      const item:Item={id:uuid(),storeId,shortName:form.shortName||finalName.slice(0,20),name:finalName,nameHi:form.nameHi||undefined,categoryId:form.categoryId||undefined,quantity:form.quantity,condition:form.assetDescription,remarks:form.remarks,sku:form.sku||undefined,groupDescription:'Site Services Workshop',categoryDescription:cat?.path||'',assetDescription:form.assetDescription,photoThumbnail:photo,erpPassthrough:{},createdBy:'admin',lastModifiedBy:'admin',createdAt:now,updatedAt:now,syncVersion:1,syncStatus:'pending'} as Item;
      await db.items.add(item);
      await db.pendingSync.add({id:uuid(),table:'items',recordId:item.id,operation:'insert',data:item,createdAt:now,retries:0} as any);
    }
    nav('/');
  };

  const isEdit=!!editId;
  return(
    <div className="pb-20">
      <div className="sticky top-14 z-30 bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={()=>nav(-1)} className="p-1 rounded-lg hover:bg-gray-100"><ArrowLeft size={22}/></button>
        <h2 className="font-semibold text-lg">{isEdit?t('admin.editItem'):t('admin.addItem')}</h2>
      </div>
      <div className="p-4 space-y-4">
        <PhotoPlaceholder photoThumbnail={photo} name={form.name||'New Item'} size="lg" editable={true} onPhotoChange={setPhoto}/>
        <Input label={t('admin.hindiName')} value={form.nameHi} onChange={v=>set('nameHi',v)}
          suffix={<button onClick={doTranslate} disabled={!form.nameHi.trim()||translating} className="px-3 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 disabled:opacity-40 flex items-center gap-1 text-sm whitespace-nowrap"><Languages size={16}/>{translating?'...':t('dashboard.translate')}</button>}/>
        <Input label={t('admin.fullName')} value={form.name} onChange={v=>set('name',v)} required/>
        <Input label={t('admin.shortName')} value={form.shortName} onChange={v=>set('shortName',v)}/>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.selectCategory')}</label>
          <select value={form.categoryId} onChange={e=>set('categoryId',e.target.value)} className="w-full border rounded-xl px-3 py-2.5 text-sm bg-white"><option value="">{t('admin.selectCategory')}</option>{cats?.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <Input label={t('admin.initialQty')} value={String(form.quantity)} onChange={v=>set('quantity',Number(v)||0)} type="number"/>
        <Input label={t('admin.assetDesc')} value={form.assetDescription} onChange={v=>set('assetDescription',v)}/>
        <Input label={t('item.remarks')} value={form.remarks} onChange={v=>set('remarks',v)}/>
        <button onClick={save} disabled={(!form.name.trim()&&!form.nameHi.trim())||saving} className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-40 flex items-center justify-center gap-2"><Save size={18}/>{saving?t('admin.saving'):t('admin.save')}</button>
      </div>
    </div>
  );
}
