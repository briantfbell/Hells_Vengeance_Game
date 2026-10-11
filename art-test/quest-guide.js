window.QuestGuide={current(){
 if(window.ChurchArc?.goal())return {text:ChurchArc.goal(),target:ChurchArc.target()};
 if(PoliticalMovement.goal())return {text:PoliticalMovement.goal(),target:PoliticalMovement.target()};
 if(DebtsRumors.goal())return {text:DebtsRumors.goal(),target:DebtsRumors.target()};
 if(LastStand.goal())return {text:LastStand.goal(),target:LastStand.target()};
 const result=(text,id)=>({text,target:id?(visiblePoints().find(p=>p.id===id)||point(id)):null});
 if(quest.chapter3){
  if(quest.chapter3Complete)return result('Chapter complete · The Last Stand awaits.');
  if(!quest.sermonDispersed)return result('Attend Allamar’s sermon.',scene==='longacre_square'?'sermon':scene==='ash_house'?'longacreRoad':scene==='longacre_jail'?'jailReport':'manorExit');
  if(!quest.decreesIssued)return result('Report the sermon to Razelago.',scene==='ash_house'?'razelago':scene==='longacre_square'?'ashReturn':scene==='longacre_jail'?'jailReport':'manorExit');
  const count=['noticePosted','tavernPosted','gatePosted','jailPosted'].filter(k=>quest[k]).length;
  if(count<4){let id=scene==='ash_house'?'longacreRoad':scene==='longacre_jail'?(!quest.gatePosted?'gateDecree':'jailDecree'):scene==='longacre_square'?(!quest.noticePosted?'noticeDecree':!quest.tavernPosted?'tavernDecree':'jailRoad'):'manorExit';return result('Post the public notices ['+count+'/4].',id);}
  if(!quest.rhonaDismissed)return result('Deliver Rhona’s dismissal.',scene==='longacre_jail'?'jailDecree':scene==='longacre_square'?'jailRoad':scene==='ash_house'?'longacreRoad':'manorExit');
  if(!quest.deputiesDefeated)return result('Leave the jail courtyard.',scene==='longacre_jail'?'jailReport':scene==='longacre_square'?'jailRoad':scene==='ash_house'?'longacreRoad':'manorExit');
  if(!quest.deputiesReported)return result('Report the deputies’ ambush.',scene==='ash_house'?'razelago':scene==='longacre_square'?'ashReturn':scene==='longacre_jail'?'jailReport':'manorExit');
  return result('Meet Archbaron Fex.',scene==='scarlet_manor'?'fexAudience':scene==='longacre_square'?'manorRoad':scene==='ash_house'?'longacreRoad':'jailReport');
 }
 if(quest.chapter2Complete)return result('Continue to the Longacre sermon.','chapterThree');
 if(quest.chapter2){if(scene==='bathroom')return result(quest.spiritCalmed?'Return downstairs.':!quest.bathStarted?'Investigate the tub with J’Mal.':'Rescue J’Mal and calm the spirit.',quest.spiritCalmed?'bathExit':'bath');return {text:$('objective').textContent,target:NextChapter.target()};}
 if(quest.done)return result('Continue aboard The Western Star.','nextChapter');
 if(quest.burned)return result('Leave Kintargo under cover.');
 if(scene==='street')return result('Find the Silver Star.','silver');
 if(scene==='tavern')return result(quest.ropeCut||quest.bell?'Descend into the hidden temple.':'Decide whether to silence the bell, then find the cellar.',quest.ropeCut||quest.bell?'stairs':'rope');
 if(quest.victory)return result(!quest.scimitar?'Take Viggo’s scimitar.':!quest.planted?'Plant the false evidence.':'Burn the temple.','aftermath');
 return result('Approach Viggo at the altar.','altar');
}};

