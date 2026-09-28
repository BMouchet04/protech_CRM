import type {Activity,ActivityType,CrmLinks,Task,TaskPriority,TaskType} from '@/types/crm';
import {localId} from '@/utils/local-id';
export const currentUserId='u1';
export const todayLocal=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
export const addDays=(iso:string,days:number)=>{const d=new Date(`${iso}T12:00:00`);d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
export const mondayNext=(iso:string)=>{const d=new Date(`${iso}T12:00:00`);return addDays(iso,((8-d.getDay())%7)||7)};
export const linked=(o:CrmLinks,type:'prospect'|'account'|'contact'|'opportunity',id:string)=>o[`${type}Id`]===id;
export const linkFor=(type:'prospect'|'account'|'contact'|'opportunity',id:string):CrmLinks=>({[`${type}Id`]:id});
export function createActivity(input:Partial<Activity>&Pick<Activity,'type'|'title'|'content'|'userId'|'activityDate'>):Activity{return {id:localId(),createdAt:new Date().toISOString(),nextActionCreated:false,...input}}
export function createTask(input:Partial<Task>&Pick<Task,'title'|'ownerId'|'dueDate'|'taskType'>):Task{const now=new Date().toISOString();return {id:localId(),description:'',status:'À faire',priority:'Normale',createdAt:now,updatedAt:now,...input}}
export const taskForNextAction=(links:CrmLinks,title:string,date:string,ownerId:string):Task=>createTask({...links,title,ownerId,dueDate:date,taskType:'Relance',sourceNextAction:true});
export function ensureNextActionTask(tasks:Task[],links:CrmLinks,title:string,date:string,ownerId:string){if(!title.trim()||!/^\d{4}-\d{2}-\d{2}$/.test(date))return tasks;const existing=tasks.find(t=>t.sourceNextAction&&t.status!=='Terminée'&&t.status!=='Annulée'&&Object.entries(links).every(([k,v])=>t[k as keyof CrmLinks]===v));if(existing)return tasks.map(t=>t.id===existing.id?{...t,title:title.trim(),dueDate:date,ownerId,updatedAt:new Date().toISOString()}:t);return [taskForNextAction(links,title.trim(),date,ownerId),...tasks]}
export const activityMatches=(a:Activity,links:CrmLinks)=>Object.entries(links).some(([k,v])=>!!v&&a[k as keyof CrmLinks]===v);
export const taskMatches=(t:Task,links:CrmLinks)=>Object.entries(links).some(([k,v])=>!!v&&t[k as keyof CrmLinks]===v);
const base=todayLocal();
const t=(id:string,title:string,taskType:TaskType,ownerId:string,offset:number,links:CrmLinks,priority:TaskPriority='Normale',time?:string,status:Task['status']='À faire'):Task=>({id,title,taskType,ownerId,dueDate:addDays(base,offset),dueTime:time,priority,status,description:'',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),...(status==='Terminée'?{completedAt:new Date().toISOString()}:{}),...links});
export const mockTasks:Task[]=[
 t('t1','Appeler Émilie pour le programme EVO+','Appel','u1',0,{accountId:'a1',contactId:'c1',opportunityId:'o1'},'Haute','09:30'),
 t('t2','Relancer le devis de préparation','Relance','u1',-2,{accountId:'a2',contactId:'c2',opportunityId:'o2'},'Urgente'),
 t('t3','Préparer l’offre de produits Azur','Préparer offre','u1',0,{accountId:'a8',contactId:'c19',opportunityId:'o13'},'Normale'),
 t('t4','Compte-rendu de visite Riviera','Rendez-vous','u1',0,{accountId:'a1',contactId:'c1'},'Normale','14:00'),
 t('t5','Envoyer la présentation au prospect','Email','u1',-1,{prospectId:'4'},'Haute'),
 t('t6','Suivi Signature Spa','Suivi client','u1',1,{accountId:'a16',contactId:'c18',opportunityId:'o8'}),
 t('t7','Rencontrer le réseau Horizon','Rendez-vous','u1',3,{accountId:'a13',contactId:'c16',opportunityId:'o18'},'Normale','11:00'),
 t('t8','Vérifier les besoins Alpine','Appel','u2',0,{accountId:'a9',contactId:'c13',opportunityId:'o14'},'Normale','10:30'),
 t('t9','Offre export Italia Prestige','Préparer offre','u3',-3,{accountId:'a11',contactId:'c15',opportunityId:'o19'},'Haute'),
 t('t10','Meeting Gulf Prestige','Rendez-vous','u4',0,{accountId:'a6',contactId:'c9',opportunityId:'o21'},'Haute','16:00'),
 t('t11','Clore le dossier de test','Administratif','u1',-4,{accountId:'a12'},'Basse',undefined,'Terminée'),
 t('t12','Revoir les conditions Riviera','Relance','u1',8,{accountId:'a2',opportunityId:'o11'})
];
const act=(id:string,type:ActivityType,title:string,content:string,userId:string,offset:number,links:CrmLinks,extra:Partial<Activity>={}):Activity=>({id,type,title,content,userId,activityDate:addDays(base,offset),createdAt:new Date().toISOString(),nextActionCreated:false,...links,...extra});
export const mockWorkActivities:Activity[]=[
 act('w1','Meeting','Présentation EVO+','Échange avec Émilie sur le périmètre du déploiement.','u2',-1,{accountId:'a1',contactId:'c1',opportunityId:'o1'},{participants:'Émilie Laurent, Pierre Lambert',activityTime:'11:00',duration:45}),
 act('w2','Appel','Échange après-vente','Jean souhaite recevoir une proposition détaillée.','u1',-3,{accountId:'a2',contactId:'c2',opportunityId:'o2'},{outcome:'Joint',duration:20}),
 act('w3','Note','Point produits','Ajuster la sélection initiale.','u1',0,{accountId:'a8',contactId:'c19',opportunityId:'o13'}),
 act('w4','Visite','Visite du site Nice','Identification des besoins sur place.','u1',-7,{accountId:'a2',contactId:'c2',opportunityId:'o3'}),
 act('w5','Email','Présentation export','Document de synthèse transmis.','u3',-2,{accountId:'a11',contactId:'c15',opportunityId:'o19'}),
 act('w6','Compte-rendu','Préparation rendez-vous','Points de discussion consignés.','u1',-1,{prospectId:'1'})
];
