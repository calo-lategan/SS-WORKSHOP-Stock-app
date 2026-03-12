import {useRef} from 'react';
import {Package,Camera} from 'lucide-react';

const sizes:{[k:string]:string}={sm:'w-16 h-16',md:'w-24 h-24',lg:'w-full h-48'};
const icons:{[k:string]:number}={sm:24,md:36,lg:48};

interface Props{
  photoThumbnail?:string;
  photoPath?:string;
  name:string;
  size?:'sm'|'md'|'lg';
  editable?:boolean;
  onPhotoChange?:(base64:string)=>void;
}

async function resizeImage(file:File,maxW=800,maxH=800,quality=0.8):Promise<string>{
  return new Promise((resolve)=>{
    const reader=new FileReader();
    reader.onload=(e)=>{
      const img=new Image();
      img.onload=()=>{
        let w=img.width,h=img.height;
        if(w>maxW){h=h*(maxW/w);w=maxW}
        if(h>maxH){w=w*(maxH/h);h=maxH}
        const canvas=document.createElement('canvas');
        canvas.width=w;canvas.height=h;
        const ctx=canvas.getContext('2d')!;
        ctx.drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL('image/jpeg',quality));
      };
      img.src=e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function PhotoPlaceholder({photoThumbnail,name,size='md',editable=false,onPhotoChange}:Props){
  const fileRef=useRef<HTMLInputElement>(null);

  const handleFile=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];
    if(!file||!onPhotoChange)return;
    const base64=await resizeImage(file);
    onPhotoChange(base64);
  };

  const handleClick=()=>{
    if(editable&&fileRef.current)fileRef.current.click();
  };

  if(photoThumbnail)return(
    <div className={`${sizes[size]} relative overflow-hidden rounded-lg bg-gray-100 ${editable?'cursor-pointer group':''}`} onClick={handleClick}>
      <img src={photoThumbnail} alt={name} className="w-full h-full object-cover" loading="lazy"/>
      {editable&&<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Camera size={icons[size]} className="text-white"/>
      </div>}
      {editable&&<input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile}/>}
    </div>
  );

  return(
    <div className={`${sizes[size]} bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-1 ${editable?'cursor-pointer hover:bg-gray-200 border-2 border-dashed border-gray-300':''}`} onClick={handleClick}>
      {editable?<Camera size={icons[size]} className="text-gray-400"/>:<Package size={icons[size]} className="text-gray-300"/>}
      {editable&&<span className="text-xs text-gray-400">Tap to add photo</span>}
      {editable&&<input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile}/>}
    </div>
  );
}
