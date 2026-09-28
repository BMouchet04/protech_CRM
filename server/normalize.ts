export const normalizeName=(s:string)=>s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ');
export const normalizeEmail=(s:string)=>s.trim().toLowerCase();
export const normalizePhone=(s:string)=>s.replace(/[^+\d]/g,'');
export const normalizeDomain=(s:string)=>{try{return new URL(s.startsWith('http')?s:`https://${s}`).hostname.toLowerCase().replace(/^www\./,'')}catch{return ''}};
export const normalizeTaxId=(s:string)=>s.toUpperCase().replace(/[^A-Z0-9]/g,'');
