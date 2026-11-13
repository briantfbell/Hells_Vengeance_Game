"use strict";

window.SethicLedgers=(()=>{
 const salon='egorian_feud_salon',archive='egorian_judicial_records',bank='egorian_loan_strongroom';
 const leads=[
  ['ledgersFindPayments','sethicPaymentsFound'],
  ['ledgersMatchRegister','sethicRegisterMatched']
 ];
 const pending=()=>leads.filter(([,flag])=>!quest[flag]);
 const layouts={
  [archive]:{
   name:'Egorian · Judicial Records',image:'sethic-judicial-records-v1.png',spawn:[328,344],
   walk:[{x:64,y:160,w:512,h:192},{x:288,y:352,w:64,h:48}],lights:[[63,66],[169,66],[471,66],[519,66]],
   points:[
    {id:'ledgersFindPayments',x:88,y:128,label:'Inspect the payment ledger'},
    {id:'ledgersMatchRegister',x:552,y:128,label:'Check the court register'},
    {id:'ledgersFileEvidence',x:328,y:240,label:'Submit the evidence'},
    {id:'ledgersFollowLoan',x:328,y:392,label:'Follow Sethic’s foreign loan'}
   ]
  },
  [bank]:{
   name:'Egorian · The Loan Strongroom',image:'sethic-loan-strongroom-v1.png',spawn:[328,344],
   walk:[{x:32,y:192,w:576,h:160},{x:176,y:160,w:432,h:32},{x:288,y:352,w:64,h:48}],lights:[[83,121],[160,74],[480,74]],
   points:[
    {id:'ledgersReadDispatch',x:104,y:168,label:'Trace the loan in the dispatch papers'},
    {id:'ledgersTryVault',x:320,y:144,label:'Attempt to take Sethic’s loan'},
    {id:'ledgersWithdraw',x:328,y:392,label:'Withdraw empty-handed'}
   ]
  }
 };
 function install(){
  scenes[salon].points.push({id:'ledgersLeaveSalon',x:328,y:344,label:'Investigate Sethic’s payments to the judges'});
  for(const [id,layout] of Object.entries(layouts)){
   scenes[id]={...layout,blocks:[]};
   MAP_LAYERS[id]={foreground:layout.image,contain:true,background:{type:'solid',color:'#151722'}};
  }
  JOURNEYS[archive]='The farm was one source of Sethic’s money. Now the company follows what he has paid out. Look for records connecting his payments to the judges.';
  JOURNEYS[bank]='Sethic has borrowed a large sum from a foreign bank. The company follows the loan and tries to seize the money.';
 }
 async function load(loader){
  await Promise.all(Object.entries(layouts).map(async([id,{image}])=>{art[id]=await loader(image);}));
 }
 function mapImage(){return Object.hasOwn(layouts,scene)?art[scene]:null;}
 function points(){
  if(!quest.sethicFarmComplete)return null;
  if(scene===salon)return quest.sethicFinanceComplete?[]:[point('ledgersLeaveSalon')];
  if(scene===archive){
   const left=pending();
   return left.length?left.map(([id])=>point(id)):[point(quest.sethicJudgesIndicted?'ledgersFollowLoan':'ledgersFileEvidence')];
  }
  if(scene!==bank)return null;
  if(!quest.sethicLoanTraced)return [point('ledgersReadDispatch')];
  return [point(quest.sethicLoanFailed?'ledgersWithdraw':'ledgersTryVault')];
 }
 function target(){return points()?.[0]||null;}
 function goal(){
  if(scene===archive&&pending().length)return 'Collect the records ['+(leads.length-pending().length)+'/'+leads.length+']';
  return target()?.label||(scene===salon&&quest.sethicFinanceComplete?'The judges face indictment. The attempt to take Sethic’s loan failed.':null);
 }
 function npcs(){return Object.hasOwn(layouts,scene)?[]:null;}

 async function interact(id){
  if(!points()?.some(p=>p.id===id))return false;
  switch(id){
   case 'ledgersLeaveSalon':
    quest.sethicRecordsReached=true;
    await travel(archive,328,344);
    break;
   case 'ledgersFindPayments':
    await say('Chronicle','The company copies entries for recurring payments from Sethic to several court officials.');
    quest.sethicPaymentsFound=true;
    break;
   case 'ledgersMatchRegister':
    await say('Chronicle','The court register identifies which judges were sitting when the payments were made.');
    quest.sethicRegisterMatched=true;
    break;
   case 'ledgersFileEvidence':
    await say('freya','The names in the payment ledger match the judges in the register. Submit both copies together.');
    await journeyCard('Egorian · The judges indicted','The company exposes several judges on Sethic’s payroll. The evidence is turned over, and the judges are indicted.',()=>{
     quest.sethicJudgesIndicted=true;
    });
    break;
   case 'ledgersFollowLoan':
    quest.sethicLoanReached=true;
    await travel(bank,328,344);
    break;
   case 'ledgersReadDispatch':
    await say('Chronicle','The dispatch papers identify Sethic’s foreign loan and the strongroom the company came to search.');
    quest.sethicLoanTraced=true;
    break;
   case 'ledgersTryVault':
    await say('jamal','The dispatch points here. Give me a moment at the vault.');
    await storyRoll('J’Mal · Secure the loan',3,0,'The attempt fails');
    await say('jamal','I couldn’t get to the money. We’re walking out empty-handed.');
    quest.sethicLoanFailed=true;
    break;
   case 'ledgersWithdraw':
    await journeyCard('Back in Egorian','The company returns without the borrowed money. The indictments still stand.',()=>{
     quest.sethicFinanceComplete=true;
     setScene(salon,328,344);
    });
    break;
  }
  save();
  paintParty();
  updateObjective();
  return true;
 }
 return {install,load,mapImage,points,target,goal,npcs,interact};
})();
