import type {Opportunity,PipelineId} from '@/types/crm';
import {mockAccounts,mockSites} from './crm';
import {mockPipelines} from './pipelines';
const rows:[string,string,PipelineId,number,number,string,string,string?,string?][]=[
 ['Déploiement EVO+ — Riviera Motors','a1','services',7,85000,'u2','2026-10-15','c1'],
 ['Préparation VN — Riviera Côte d’Azur','a2','services',5,42000,'u1','2026-10-30','c2','s1'],
 ['Inspection BMW Nice — Riviera','a2','services',3,12000,'u2','2026-11-12','c2','s1'],
 ['Services Alpes — Grenoble','a3','services',2,24000,'u2','2026-11-20','c22','s4'],
 ['Programme réseau European Prestige','a4','services',1,125000,'u3','2026-12-05','c6'],
 ['Centre Lyon Est','a5','services',4,37000,'u3','2026-10-27','c7','s5'],
 ['Services Alpine Retail','a10','services',9,28000,'u2','2026-09-20','c14','s10'],
 ['Atelier Signature Spa','a16','services',6,9500,'u1','2026-10-08','c18','s12'],
 ['Préparation Monte-Carlo','a15','services',10,18000,'u2','2026-09-10','c5'],
 ['Déploiement Horizon Sud','a14','services',11,15000,'u1','2026-12-20','c17','s11'],
 ['Référencement gamme Riviera','a1','products-fr',6,67000,'u1','2026-11-01','c1'],
 ['Produits retail Riviera Côte d’Azur','a2','products-fr',3,22000,'u3','2026-11-15','c3','s2'],
 ['Sélection produits Azur Automotive','a8','products-fr',5,8000,'u1','2026-10-21','c19'],
 ['Gamme Alpine Motor','a9','products-fr',8,54000,'u2','2026-12-02','c13'],
 ['Réactivation Premium Distribution','a12','products-fr',2,31000,'u1','2026-10-10','c12'],
 ['Produits Monte-Carlo Prestige','a15','products-fr',10,7600,'u2','2026-09-18','c5'],
 ['Offre produits European Rhône','a5','products-fr',7,43000,'u3','2026-10-19','c8','s6'],
 ['Programme retail Horizon','a13','products-fr',1,92000,'u4','2027-01-12','c16'],
 ['Importateur ProTechMC Italie','a11','export',8,180000,'u3','2026-12-20','c15'],
 ['Distribution Gulf Prestige UAE','a7','export',10,450000,'u4','2026-12-01','c11'],
 ['Expansion réseau Gulf Prestige','a6','export',5,320000,'u4','2027-01-15','c9'],
 ['Accord Pearl Motor Trading','a18','export',3,210000,'u4','2027-02-12','c20'],
 ['Reprise Global Film Partners','a17','export',2,65000,'u3','2026-11-12','c21'],
 ['Lancement Gulf Dubai','a7','export',13,96000,'u4','2026-09-14','c10','s8'],
 ['Étude export Italia Prestige','a11','export',6,140000,'u3','2026-10-30','c15'],
 ['Offre Pearl Motor Doha','a18','export',7,78000,'u4','2026-12-04','c20'],
];
export const mockOpportunities:Opportunity[]=rows.map(([name,accountId,pipelineId,step,amount,ownerId,expectedCloseDate,contactId,siteId],i)=>{const stage=mockPipelines.find(p=>p.id===pipelineId)!.stages[step-1];const status=stage.terminal??'Open';const probability=stage.probability;return {id:`o${i+1}`,name,accountId,siteId:siteId??null,primaryContactId:contactId??null,businessLine:mockPipelines.find(p=>p.id===pipelineId)!.businessLine,pipelineId,stageId:stage.id,ownerId,status,amount,currency:pipelineId==='export'&&i%3===0?'USD':pipelineId==='export'&&i%3===1?'AED':'EUR',probability,weightedAmount:amount*probability/100,expectedCloseDate,priority:i%5===0?'Haute':'Normale',source:'Prospection commerciale',description:`Projet de développement avec ${mockAccounts.find(a=>a.id===accountId)?.name}.`,nextAction:i===4||i===20?'':i%6===0?'Valider la proposition':i%4===0?'Relancer le décideur':'Planifier le prochain échange',nextActionDate:i===4||i===20?'':i%6===0?'2026-09-21':i%3===0?'2026-09-24':'2026-09-29',lastActivityDate:i%5===0?'2026-09-02':'2026-09-22',createdAt:'2026-09-01',updatedAt:'2026-09-22',stageEnteredAt:i%4===0?'2026-09-08':'2026-09-20',...(status==='Won'?{wonAt:'2026-09-20'}:{}),...(status==='Lost'?{lostAt:'2026-09-20',lossReason:'Budget'}:{}),...(pipelineId==='export'?{territory:mockAccounts.find(a=>a.id===accountId)?.country,annualPotential:amount*2,siteCount:mockSites.filter(s=>s.accountId===accountId).length,outletCount:mockSites.filter(s=>s.accountId===accountId).length,exclusivity:false,trainingNeeded:true,targetLaunchDate:'2027-02-01'}:{})}});
