import {useEffect} from 'react';
import {useSyncStore} from '../store/syncStore';
export function useOnlineStatus(){const{isOnline,setOnline}=useSyncStore();useEffect(()=>{const on=()=>setOnline(true);const off=()=>setOnline(false);window.addEventListener('online',on);window.addEventListener('offline',off);return()=>{window.removeEventListener('online',on);window.removeEventListener('offline',off)}},[setOnline]);return isOnline}
