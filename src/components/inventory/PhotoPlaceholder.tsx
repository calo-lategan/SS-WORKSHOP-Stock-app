import {Package} from 'lucide-react';
const sizes:{[k:string]:string}={sm:'w-16 h-16',md:'w-24 h-24',lg:'w-full h-48'};
const icons:{[k:string]:number}={sm:24,md:36,lg:48};
export default function PhotoPlaceholder({photoThumbnail,name,size='md'}:{photoThumbnail?:string;photoPath?:string;name:string;size?:'sm'|'md'|'lg'}){
  if(photoThumbnail)return <img src={photoThumbnail} alt={name} className={`${sizes[size]} object-cover rounded-lg bg-gray-100`} loading="lazy"/>;
  return <div className={`${sizes[size]} bg-gray-100 rounded-lg flex items-center justify-center`}><Package size={icons[size]} className="text-gray-300"/></div>;
}
