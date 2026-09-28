'use client';
import {useRef,useState} from 'react';
let mutationQueue:Promise<void>=Promise.resolve();
import type {Dispatch,SetStateAction} from 'react';
import type {Entity} from '@/server/repository';
export function usePersistedCollection<T extends {id:string|number}>(entity:Entity,onError:(message:string)=>void,onPending?:(change:number)=>void){
 const [items,setItems]=useState<T[]>([]);const current=useRef<T[]>([]);
 function load(rows:T[]){current.current=rows;setItems(rows)}
 const update:Dispatch<SetStateAction<T[]>>=(action)=>{
 const previous=current.current;const next=typeof action==='function'?(action as (x:T[])=>T[])(previous):action;
 current.current=next;setItems(next);
 const before=new Map(previous.map(x=>[String(x.id),x]));const after=new Map(next.map(x=>[String(x.id),x]));
 const changes=[...next.filter(x=>JSON.stringify(x)!==JSON.stringify(before.get(String(x.id)))).map(value=>({method:'POST',value})),...previous.filter(x=>!after.has(String(x.id))).map(value=>({method:'DELETE',value}))];
 if(!changes.length)return;
 onPending?.(1);mutationQueue=mutationQueue.then(async()=>{
  for(const change of changes){const response=await fetch(`/api/crm/${entity}${change.method==='DELETE'?`?id=${encodeURIComponent(String(change.value.id))}`:''}`,{method:change.method,headers:{'Content-Type':'application/json'},body:change.method==='POST'?JSON.stringify({value:change.value,allowDuplicate:true}):undefined});if(!response.ok){const result=await response.json().catch(()=>({error:'Impossible d’enregistrer la modification.'})) as {error?:string};throw new Error(result.error??'Impossible d’enregistrer la modification.')}}
 }).catch(async error=>{onError(error.message);try{const response=await fetch('/api/crm/bootstrap',{cache:'no-store'});if(response.ok){const state=await response.json() as Record<string,T[]>;const restored=state[entity] as T[];current.current=restored;setItems(restored)}}catch{}}).finally(()=>onPending?.(-1));
 };
 return [items,update,load] as const;
}
