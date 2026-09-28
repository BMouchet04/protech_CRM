import type {Account,AccountSite,Contact,User,Activity} from '@/types/crm';
export const mockUsers:User[]=[{id:'u1',name:'Alice Martin',initials:'AM',role:'Commercial'},{id:'u2',name:'Pierre Lambert',initials:'PL',role:'Commercial'},{id:'u3',name:'Samira Benali',initials:'SB',role:'Commercial'},{id:'u4',name:'Nicolas Rey',initials:'NR',role:'Commercial'},{id:'u5',name:'Claire Morel',initials:'CM',role:'Direction'},{id:'u6',name:'Emma Renard',initials:'ER',role:'Commercial'},{id:'u7',name:'Lucas Girard',initials:'LG',role:'Commercial'},{id:'u8',name:'Maya Laurent',initials:'ML',role:'Commercial'}];
const a=(id:string,name:string,type:Account['type'],status:Account['status'],parentId:string|null,ownerId:string,city:string,country:string,region:string,lines:Account['lines'],summary:string):Account=>({id,name,type,status,parentId,ownerId,city,country,region,lines,summary,address:`${Number(id.slice(1))*3+5} avenue des Ateliers, ${city}`,website:`https://${name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'').slice(0,20)}.example`,phone:'+33 0 00 00 00 00',nextAction:'Faire un point commercial',nextDate:'28 sept.',lastActivity:'22 sept. 2026'});
export const mockAccounts:Account[]=[
 a('a1','Riviera Motors Group','Groupe automobile','Client actif',null,'u2','Nice','France','PACA',['Services','Produits France'],'Relation groupe couvrant les services de préparation et la fourniture de produits.'),
 a('a2','Riviera Motors Côte d’Azur','Entreprise','Client actif','a1','u1','Nice','France','PACA',['Services','Produits France'],'Développement des prestations avant livraison sur plusieurs établissements.'),
 a('a3','Riviera Motors Alpes','Entreprise','Prospect','a1','u2','Grenoble','France','Auvergne-Rhône-Alpes',['Services'],'Évaluer le déploiement des services sur le territoire alpin.'),
 a('a4','European Prestige Group','Groupe automobile','Prospect',null,'u3','Lyon','France','Auvergne-Rhône-Alpes',['Services','Network'],'Échanges initiaux autour de la formation et du réseau.'),
 a('a5','European Prestige Rhône','Entreprise','À qualifier','a4','u3','Lyon','France','Auvergne-Rhône-Alpes',['Services'],'Cartographier les concessions et les interlocuteurs locaux.'),
 a('a6','Gulf Prestige Motors','Groupe automobile','Partenaire',null,'u4','Dubai','Émirats arabes unis','Dubai',['Export','Network'],'Développement régional de la distribution et des services.'),
 a('a7','Gulf Prestige UAE','Importateur','Client actif','a6','u4','Dubai','Émirats arabes unis','Dubai',['Export','Services'],'Structurer les échanges entre import et exploitation locale.'),
 a('a8','Azur Automotive','Revendeur','Prospect',null,'u1','Cannes','France','PACA',['Produits France'],'Tester une première sélection de produits.'),
 a('a9','Alpine Motor Group','Groupe automobile','Client actif',null,'u2','Annecy','France','Auvergne-Rhône-Alpes',['Services','Produits France'],'Relation de distribution et services en croissance.'),
 a('a10','Alpine Retail France','Concession','Client actif','a9','u2','Annecy','France','Auvergne-Rhône-Alpes',['Services'],'Optimiser le parcours de préparation véhicule.'),
 a('a11','Italia Prestige Cars','Distributeur','Prospect',null,'u3','Milan','Italie','Lombardie',['Export'],'Qualification de l’offre pour le marché italien.'),
 a('a12','Premium Auto Distribution','Distributeur','Dormant',null,'u1','Paris','France','Île-de-France',['Produits France'],'Réactiver les échanges commerciaux.'),
 a('a13','Horizon Mobility Group','Groupe automobile','À qualifier',null,'u4','Bordeaux','France','Nouvelle-Aquitaine',['Network'],'Évaluer la pertinence d’un déploiement national.'),
 a('a14','Horizon Retail Sud','Entreprise','Prospect','a13','u1','Toulouse','France','Occitanie',['Services'],'Recueillir les besoins des sites du sud.'),
 a('a15','Monte-Carlo Prestige Auto','Client professionnel','Client actif',null,'u2','Monaco','Monaco','Monaco',['Services','Produits France'],'Compte à forte exigence de qualité de service.'),
 a('a16','Signature Spa for Cars','Spa for Cars','Partenaire',null,'u1','Antibes','France','PACA',['Services','Network'],'Partage de savoir-faire sur les traitements premium.'),
 a('a17','Global Film Partners','Partenaire','Ancien client',null,'u3','Bruxelles','Belgique','Bruxelles',['Export'],'Revoir le potentiel de reprise commerciale.'),
 a('a18','Pearl Motor Trading','Importateur','Prospect',null,'u4','Doha','Qatar','Doha',['Export','Network'],'Évaluer la distribution et les ressources de formation.'),
];
export const mockSites:AccountSite[]=([
 {id:'s1',accountId:'a2',name:'Riviera Auto Nice',city:'Nice',country:'France',address:'12 avenue du Littoral, Nice',type:'Concession'},
 {id:'s2',accountId:'a2',name:'Riviera Auto Cannes',city:'Cannes',country:'France',address:'8 boulevard du Port, Cannes',type:'Concession'},
 {id:'s3',accountId:'a2',name:'Riviera Auto Antibes',city:'Antibes',country:'France',address:'21 route des Pins, Antibes',type:'Concession'},
 {id:'s4',accountId:'a3',name:'Riviera Alpes Grenoble',city:'Grenoble',country:'France',address:'4 avenue des Alpes, Grenoble',type:'Concession'},
 {id:'s5',accountId:'a5',name:'European Prestige Lyon Est',city:'Lyon',country:'France',address:'34 rue du Centre, Lyon',type:'Concession'},
 {id:'s6',accountId:'a5',name:'European Prestige Lyon Ouest',city:'Lyon',country:'France',address:'9 place du Parc, Lyon',type:'Concession'},
 {id:'s7',accountId:'a5',name:'European Prestige Villeurbanne',city:'Villeurbanne',country:'France',address:'16 avenue de la Soie, Villeurbanne',type:'Concession'},
 {id:'s8',accountId:'a7',name:'Gulf Prestige Dubai',city:'Dubai',country:'Émirats arabes unis',address:'Business Bay, Dubai',type:'Centre de service'},
 {id:'s9',accountId:'a7',name:'Gulf Prestige Abu Dhabi',city:'Abu Dhabi',country:'Émirats arabes unis',address:'Central District, Abu Dhabi',type:'Centre de service'},
 {id:'s10',accountId:'a10',name:'Alpine Retail Annecy',city:'Annecy',country:'France',address:'6 route du Lac, Annecy',type:'Concession'},
 {id:'s11',accountId:'a14',name:'Horizon Toulouse',city:'Toulouse',country:'France',address:'19 avenue de l’Aéro, Toulouse',type:'Concession'},
 {id:'s12',accountId:'a16',name:'Signature Antibes',city:'Antibes',country:'France',address:'5 avenue du Cap, Antibes',type:'Centre de service'},
] as AccountSite[]).map(s=>{const account=mockAccounts.find(a=>a.id===s.accountId)!;return {...s,region:account.region,territory:account.country,ownerId:account.ownerId}});
const c=(id:string,first:string,last:string,position:string,department:string,role:Contact['role'],accountId:string,siteId:string|null,ownerId:string,email:string):Contact=>({id,first,last,position,department,role,accountId,siteId,ownerId,email,phone:'+33 0 00 00 00 00',mobile:'+33 0 00 00 00 00',status: 'Actif',region:mockAccounts.find(a=>a.id===accountId)?.region??'PACA',lastActivity:'22 sept. 2026',nextAction:'Reprendre contact',nextDate:'28 sept.'});
export const mockContacts:Contact[]=[
 c('c1','Émilie','Laurent','Directrice commerciale','Direction commerciale','Décideur','a1',null,'u1','emilie.laurent@rivieramotors.example'),
 c('c2','Jean','Morel','Directeur après-vente','Après-vente','Décideur','a2','s1','u1','jean.morel@rivieramotors.example'),
 c('c3','Nora','Bernier','Responsable achats','Achats','Acheteur','a2','s2','u1','nora.bernier@rivieramotors.example'),
 c('c4','Paul','Renaud','Responsable atelier','Technique','Utilisateur','a2','s3','u2','paul.renaud@rivieramotors.example'),
 c('c5','Karim','Bensaïd','Directeur général','Direction','Direction générale','a15',null,'u2','karim.bensaid@montecarloprestige.example'),
 c('c6','Sofia','Martinez','Responsable après-vente','Après-vente','Influenceur','a4',null,'u3','sofia.martinez@europeanprestige.example'),
 c('c7','Luc','Perrin','Directeur de site','Direction','Décideur','a5','s5','u3','luc.perrin@europeanprestige.example'),
 c('c8','Inès','Fabre','Responsable marketing','Marketing','Marketing','a5','s6','u3','ines.fabre@europeanprestige.example'),
 c('c9','Nadia','Haddad','Directrice réseau','Réseau','Décideur','a6',null,'u4','nadia.haddad@gulfprestige.example'),
 c('c10','Omar','Rahman','Responsable opérations','Opérations','Influenceur','a7','s8','u4','omar.rahman@gulfprestige.example'),
 c('c11','Maya','Hussein','Directrice commerciale','Direction commerciale','Direction commerciale','a7','s9','u4','maya.hussein@gulfprestige.example'),
 c('c12','Marc','Vidal','Responsable achats','Achats','Acheteur','a12',null,'u1','marc.vidal@premiumdistribution.example'),
 c('c13','Léa','Moreau','Directrice générale','Direction','Direction générale','a9',null,'u2','lea.moreau@alpinemotor.example'),
 c('c14','Hugo','Giraud','Responsable de site','Direction','Décideur','a10','s10','u2','hugo.giraud@alpineretail.example'),
 c('c15','Luca','Ferrari','Directeur export','Export','Influenceur','a11',null,'u3','luca.ferrari@italiaprestige.example'),
 c('c16','Sarah','Dupuis','Responsable réseau','Réseau','Influenceur','a13',null,'u4','sarah.dupuis@horizonmobility.example'),
 c('c17','Julien','Petit','Directeur après-vente','Après-vente','Décideur','a14','s11','u1','julien.petit@horizonretail.example'),
 c('c18','Clara','Renard','Gérante','Direction','Décideur','a16','s12','u1','clara.renard@signaturespa.example'),
 c('c19','Alexandre','Dubois','Directeur commercial','Direction commerciale','Direction commerciale','a8',null,'u1','alexandre.dubois@azurauto.example'),
 c('c20','Amira','Khalil','Directrice export','Export','Acheteur','a18',null,'u4','amira.khalil@pearlmotor.example'),
 c('c21','Victor','Roux','Responsable finance','Finance','Finance','a17',null,'u3','victor.roux@globalfilm.example'),
 c('c22','Camille','Robert','Directrice des opérations','Opérations','Influenceur','a3','s4','u2','camille.robert@rivieraalpes.example'),
];
const legacyActivities=[
 {id:'p1',subjectType:'prospect',subjectId:'1',kind:'appel',text:'Premier échange sur les prestations de préparation avant livraison.',at:'23 sept. 2026',authorId:'u1'},
 {id:'p2',subjectType:'prospect',subjectId:'1',kind:'email',text:'Présentation des services envoyée au contact.',at:'22 sept. 2026',authorId:'u1'},
 {id:'p3',subjectType:'prospect',subjectId:'2',kind:'rendez-vous',text:'Rencontre de découverte à programmer avec la direction.',at:'22 sept. 2026',authorId:'u2'},
 {id:'ac1',subjectType:'account',subjectId:'a1',kind:'rendez-vous',text:'Point groupe sur le développement des prestations services.',at:'22 sept. 2026',authorId:'u2'},
 {id:'ac2',subjectType:'account',subjectId:'a2',kind:'appel',text:'Échanges sur la préparation avant livraison dans les trois sites.',at:'20 sept. 2026',authorId:'u1'},
 {id:'ac3',subjectType:'contact',subjectId:'c2',kind:'appel',text:'Validation d’un rendez-vous de découverte après-vente.',at:'23 sept. 2026',authorId:'u1'},
 {id:'ac4',subjectType:'contact',subjectId:'c9',kind:'email',text:'Présentation de l’offre export envoyée.',at:'21 sept. 2026',authorId:'u4'},
];
export const mockActivities:Activity[]=legacyActivities.map(a=>({id:a.id,type:({appel:'Appel',email:'Email',note:'Note','rendez-vous':'Meeting'} as const)[a.kind as 'appel'|'email'|'note'|'rendez-vous'],title:({appel:'Appel',email:'Email',note:'Note','rendez-vous':'Rendez-vous'} as const)[a.kind as 'appel'|'email'|'note'|'rendez-vous'],content:a.text,userId:a.authorId,activityDate:`2026-09-${a.at.match(/^\d+/)?.[0].padStart(2,'0')??'22'}`,createdAt:'2026-09-24T10:00:00Z',nextActionCreated:false,[`${a.subjectType}Id`]:a.subjectId}));
export const userName=(id:string)=>mockUsers.find(u=>u.id===id)?.name??'À attribuer';
export const accountName=(id:string)=>mockAccounts.find(a=>a.id===id)?.name??'Compte inconnu';
