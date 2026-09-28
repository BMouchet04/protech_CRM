import type { Prospect, Status } from '@/types/prospect';
import {mockUsers,mockAccounts,mockContacts} from '@/data/crm';
export const statuses: Status[] = ['Nouveau','Contact tenté','Contacté','Qualifié','À relancer','Converti'];
export const groups: {title: string; statuses: Status[]; color: string}[] = [
  {title:'Nouveaux prospects',statuses:['Nouveau'],color:'var(--blue)'},
  {title:'À contacter',statuses:['Contact tenté'],color:'var(--pink)'},
  {title:'Contactés',statuses:['Contacté'],color:'var(--indigo)'},
  {title:'Qualifiés',statuses:['Qualifié','Converti'],color:'var(--teal)'},
  {title:'À relancer',statuses:['À relancer'],color:'var(--orange)'}
];
const names = [
 ['Émilie','Laurent','Riviera Motors Group'],['Karim','Bensaïd','Monte-Carlo Prestige Auto'],['Sofia','Martinez','European Mobility Group'],['Thomas','Perrin','Azur Automotive'],['Nadia','Haddad','Gulf Prestige Motors'],['Marc','Vidal','Premium Auto Distribution'],['Léa','Moreau','Alpine Motor Group'],['Luca','Ferrari','Italia Prestige Cars'],['Inès','Bernard','Côte d’Azur Mobility'],['Youssef','Rahman','Desert Crown Automotive'],['Camille','Robert','Horizon Auto Réseau'],['Hugo','Marchand','Grand Sud Concessions'],['Amira','Khalil','Pearl Motor Holdings'],['Alexandre','Dubois','Lumière Auto Group'],['Maya','Rossi','Signature Mobility'],['Paul','Lefèvre','Étoile Distribution'],['Sarah','Dupuis','Azur Fleet Partners'],['Noah','Faure','Meridian Prestige'],['Amina','Saïd','Falcon Auto Trading'],['Julien','Petit','Alpes Réseau Automobile'],['Clara','Renard','Continental Auto Care'],['Omar','Mansour','Palm Automotive'],['Eva','Giraud','Pôle Automobile Méditerranée'],['Raphaël','Blanc','Dynasty Auto Group'],['Salma','Hussein','Oasis Mobility'],['Victor','Roux','Summit Motor Partners']
];
const owners=mockUsers.map(u=>u.name);
const regions=['PACA','Monaco','Île-de-France','Dubai','Qatar','Italie'];
const lines: Prospect['line'][]=['Services','Produits France','Export','Network'];
const positions=['Directrice commerciale','Directeur général','Responsable après-vente','Directrice réseau','Responsable achats','Directeur de site'];
const actions=['Envoyer la présentation','Planifier un rendez-vous','Appeler le contact','Transmettre une offre','Relancer après démo','Valider les besoins'];
const days=['Aujourd’hui','Demain','26 sept.','29 sept.','2 oct.','6 oct.'];
const order: Status[]=['Nouveau','Nouveau','Nouveau','Nouveau','Nouveau','Nouveau','Contact tenté','Contact tenté','Contact tenté','Contact tenté','Contact tenté','Contacté','Contacté','Contacté','Contacté','Contacté','Qualifié','Qualifié','Qualifié','Converti','Qualifié','À relancer','À relancer','À relancer','À relancer','À relancer'];
export const initialProspects: Prospect[]=names.map(([first,last,company],i)=>({id:i+1,source:'Prospection commerciale',createdAt:'2026-09-01',accountId:mockAccounts.find(a=>a.name.toLowerCase()===company.toLowerCase())?.id??null,contactId:mockContacts.find(c=>c.first===first&&c.last===last&&mockAccounts.find(a=>a.id===c.accountId)?.name===company)?.id??null,ownerId:mockUsers[i%4].id,first,last,company,email:`${first.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}.${last.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}@${company.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'').slice(0,18)}.example`,owner:owners[i%4],status:order[i],score:[88,72,54,91,67,38,81,45,76,63,58,84,71,92,49,64,95,86,77,98,82,69,53,74,41,61][i],position:positions[i%6],role:['Direction','Manager','Commercial','Direction','Technique'][i%5],region:regions[i%6],line:lines[i%4],action:actions[i%6],date:days[i%6]}));
export {owners,regions,lines};
