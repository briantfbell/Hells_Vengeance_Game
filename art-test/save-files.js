'use strict';
window.SaveFiles=(()=>{
 let cfg,pending=null;
 const flags=new Set('nidalOperationSought dinyarReached dinyarSurveyed dinyarEntranceFound dinyarReconComplete molthuneReached molthuneScouted molthuneBaitSet molthuneCoffinLifted molthuneBreach molthuneEscaped molthuneIntroduced molthuneComplete skadiYardReached skadiScouted skadiCovered skadiFeastReached skadiComplete darkrainReached darkrainPact darkrainSlopeReached darkrainColdSeen darkrainBearWon darkrainClothed darkrainSkullSeen darkrainComplete tathlumOrdersReached tathlumBriefed tathlumNidalReached tathlumThrallMade tathlumLairReached tathlumBaitSet tathlumHuntComplete menadorBriefed menadorReached menadorComplete covenantReached covenantLoyal covenantBattleWon covenantSacrificeMade covenantTrueForm covenantClaimed covenantQueenArrived covenantJasonRaised covenantComplete barrowRoadReached barrowScoutsDefeated barrowGroveReached barrowGuardiansDefeated barrowTrailComplete vyreWishReached vyreWishGranted vyreBobHealed vyreWishComplete sethicMansionReached sethicMansionGuardsDown sethicMansionCellarEntered sethicMansionBobFreed sethicMansionWaited sethicMansionSethicDown sethicMansionBound sethicMansionComplete bellflowerBarnReached bellflowerBarnScouted bellflowerBarnLeveled bellflowerBarnComplete bellflowerReached bellflowerPrepared bellflowerPartyStarted bellflowerHeld bellflowerBargeComplete pezzackReached pezzackManseBurned pezzackPrisonersFreed pezzackStrixSeen pezzackComplete rachikanReached rachikanSurveyed rachikanRaidWon rachikanComplete corentynReached ballerinaBoarded ballerinaCargoChecked ballerinaWatchTaken hinjiTavernReached hinjiTavernToast hinjiTavernArrested beldeReached beldeWatchSeen beldeLiberated beldeTriviaStarted beldeTriviaFirst beldeTriviaSecond beldeTriviaWon beldeComplete paleBallReached paleGuestsMet paleShowSeen paleQueenMet paleChallenged paleArmorSummoned paleDuelWon paleLootSeen paleBallComplete nicoloLaneReached nicoloAmbushed nicoloGrayMenDriven nicoloChecked nicoloRescueComplete sethicRecordsReached sethicPaymentsFound sethicRegisterMatched sethicJudgesIndicted sethicLoanReached sethicLoanTraced sethicLoanFailed sethicFinanceComplete sethicFarmReached sethicFarmSurveyed sethicHogsDriven sethicFarmDestroyed sethicFarmComplete egorianFeudReached egorianSethicHeard egorianVasvionHeard egorianFeudPressure egorianVasvionChosen egorianStingReached egorianStingBriefed egorianStingComplete egorianStandingRestored egorianStingDebriefed hinjiReached hinjiDeclined hinjiPapersSent hinjiComplete efisioApartmentReached efisioContractInvoked efisioReeseRestrained efisioGuardsDefeated efisioWindowFollowed efisioDefeated westcrownReached westcrownHired westcrownManifestChecked westcrownNoteDelivered westcrownBerthChecked westcrownComplete remesianaFlorioMet remesianaMarketReached remesianaMarketBaysOpen remesianaMarketEvacuated remesianaMarketDestroyed remesianaMarketWithdrawn remesianaFlorioReported egorianTailorOrdersCarriedOut egorianTailorAftermathSeen remesianaReturned remesianaFlorioLead egorianVisionSeen egorianFountainOrders egorianTailorStreetReached egorianTailorShopSeen egorianTailorHomeSeen egorianTailorSchoolsSeen egorianTailorScouted egorianJasonBack egorianDischargeRumor egorianFreyaDischarged egorianWalkBegan egorianZaraStoppedCrowd egorianDischargeHome egorianDischargeComplete aregoCorrineArrived aregoExitTerms aregoGateSealed aregoEgorianEscaped aregoReportsSent aregoReeseContract aregoBoneDevilsSummoned aregoReeseReturned aregoCompanyFreed aregoFexSlain aregoFexAftermath aregoFexArrived aregoReeseCrossed aregoReeseSheltered aregoDungeonEntered aregoCellDevilsDefeated aregoStairParley aregoGateReached aregoGateSurveyed aregoTalismanExposed aregoFirstPact aregoApproachReached aregoBetrayalKnown aregoFexOpposed aregoYardReached aregoVionaFell aregoChampionsDefeated aregoExteriorSecured senaraGuildRevisited senaraGraveTip senaraGraveReached senaraBalisseDefeated senaraAngelHeart senaraLockdownObserved senaraWagonReached senaraWagonChallenged senaraEscortDefeated senaraPrisonerFreed senaraOrnRecruited senaraWagonReturned senaraReturnPatrolsSeen whisperwoodGladeReached whisperwoodUnicornsDefeated whisperwoodThreeHorns whisperwoodGladeCamped whisperwoodFourthHorn whisperwoodGladeComplete whisperwoodCampReached whisperwoodWatchSet whisperwoodWebsCleared whisperwoodGiantCleared whisperwoodBobMauled whisperwoodBearDrivenOff whisperwoodBobRescued whisperwoodNightComplete senaraCitadelVisited senaraChapterGreeted senaraDraymusTrained senaraForestIntel senaraCarriageDeparted senaraWhisperwoodReady senaraSewersEntered senaraJmalFound senaraGuildEntered senaraGuildScouted senaraGuildSurrendered senaraTalismanRecovered senaraPartyStarted senaraPartyPlayed senaraOrphanApproach senaraOrphanEntered senaraOrphanClue senaraWitnessesSeen senaraOrphanageComplete egorianInquiryVisited egorianChargesDropped senaraOrders senaraGarrisonSeen senaraTalismanMissing egorianExcruciationStarted egorianChargesRead egorianTracked egorianAssassination egorianDuelWon egorianLastGuardDown egorianJmalEscaped egorianDottariHeard egorianExcruciated egorianDraymusStarted egorianAmbushResolved egorianJoeRaised egorianChairBought egorianDisguiseReady egorianDraymusReturned egorianTrialStarted egorianZaraMet egorianFreyaTestified egorianJasonTestified egorianVerdict egorianSmithMet zaraGeitta egorianPlateReturned egorianNightStarted egorianSvetlanaMet egorianGuardLeadChecked egorianContractAccepted egorianNightReturned egorianBridgeMet oppianDelivered egorianTempleSupplied triaWelcomed egorianArrivalComplete roadSentryMarked roadScouted roadInfantryCleared roadKnightsCleared roadClericsCleared roadDraymusTreated roadRested southRoadComplete kantariaMayorMet uskwoodDeedSigned kantariaGiftsReceived kantariaDepartureReady fastnessSummitWon fastnessOppianRescued fastnessOppianCaptured chapter15Complete fastnessMageCleared fastnessWarpriestCleared fastnessLenciaSlain fastnessAscentComplete fastnessHallCleared fastnessChapelCleared fastnessInteriorComplete chapter15 fastnessMustered fastnessGateCleared fastnessGateComplete chapter14 supplyBriefed mineObserved mineDefendersCleared minesSecured cultLocated cultDefeated cultDestroyed tradeObserved merchantStruck captainStruck fortObserved fortIsolated perimeterCleared supplyReported chapter14Complete chapter13 covertBriefed marketSurveyed marketRiot patrolAmbushed falseBlame guildEntered guildRecordsTampered manorObserved manorArtifactsTaken uskwoodReturned uskwoodBurned escapeOpened cavesReached caveRested corrineAssigned chapter13Complete chapter12 disruptionBriefed docksObserved dockDefendersCleared dockPierBurned dockStoresBurned dockOfficeBurned docksBurned jonasEscaped southTowerDamaged northTowerCleared westTowerReached angelBroDefeated westTowerBurned disruptionReported chapter12Complete chapter11 uskwoodBriefed kantariaAssessed patrolsThinned prisonObserved prisonYardCleared prisonHallCleared zaraIdentified zaraGearRecovered zaraFreed zaraHidden chapter11Complete chapter10 courtBriefed lowerCleared rhonaDefeated upperReached lenciaDefeated lenciaEscaped courtSecured courtReported chapter10Complete chapter9 fortScouted scoutRetreated fortPrepared archerAmbushed manticoreDefeated fortSearched forestMarked patrolQuestioned chapter9Complete chapter8 smearHeard accuserSilenced bodyDisposed heistTip ambushPrepared armoryCleared jailReached porchCleared cimriRecovered prisonersQuestioned chapter8Complete chapter7 bodiesMissing churchTrail churchBreach churchLoadout entryCleared hallCleared resurrectionBroken sanctuaryCleared allamarDefeated ghastDestroyed altarBroken assassinKnowledge mantisTraining churchConverted chapter7Complete reeseJoined guapoReturned templeWound chapter6 chapter6Complete gateOpened ovinnikSubdued ovinnikReported churchStandoff watchStarted jailbreakHeard jailbreakInspected escapeTrailLost bolgartReleased executionOrdered boCaptured executionPrepared boExecuted executionResolved chapter5 chapter5Complete doctorAlliance churchEntered churchDoorsRepaired ingoeAgreement chapter4 chapter4Complete bolgartSubdued rileyCaptured prisonersJailed rileyQuestioned hillSearched bolgartSecured chapter3 chapter3Complete sermonDispersed decreesIssued noticePosted tavernPosted gatePosted jailPosted rhonaDismissed deputiesDefeated deputiesReported compactSworn scimitarDisposed briefed ropeCut bell victory scimitar planted burned done entered stairsKnown smokeUsed chapter2 chapter2Complete guapoAway supplied metCimri voyageSeen scouted ownerDeal payroll reward rested bathStarted jamalRescued spiritCalmed'.split(' '));
 const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
 function integer(v,min,max,label){if(!Number.isInteger(v)||v<min||v>max)throw Error('Invalid '+label+'.');return v;}
 function validate(data){if(!cfg)throw Error('The game is still loading.');if(!object(data)||![1,2].includes(data.version))throw Error('Unsupported checkpoint version. Update the game if this save is newer.');if(!Object.hasOwn(cfg.scenes,data.scene)||!cfg.core.includes(data.lead))throw Error('This checkpoint uses an unavailable scene or character.');if(!object(data.quest)||!object(data.hp))throw Error('Incomplete checkpoint.');const q={};
 for(const [key,value] of Object.entries(data.quest)){if(flags.has(key)){if(typeof value!=='boolean')throw Error('Invalid quest flag: '+key);q[key]=value;}else if(key==='activeRoster'){if(!Array.isArray(value)||value.length<1||value.length>cfg.core.length||new Set(value).size!==value.length||!value.every(id=>cfg.core.includes(id)))throw Error('Invalid party roster.');q[key]=[...value];}else if(key==='sermonApproach'){if(!['challenge','whispers'].includes(value))throw Error('Invalid sermon approach.');q[key]=value;}else if(key==='originalLead'){if(!cfg.core.includes(value))throw Error('Invalid original character.');q[key]=value;}else if(key==='goldReward'){q[key]=integer(value,0,100000,'gold reward');}else if(key==='skadiArguments'){q[key]=integer(value,0,3,key);}else if(key==='tathlumDuels'){q[key]=integer(value,0,3,key);}else if(key==='barrowStones'){q[key]=integer(value,0,14,key);}else if(key==='mosswaterSpent'||key==='dragonHelmSpent'){q[key]=integer(value,0,key==='mosswaterSpent'?5:3,key);}else throw Error('Unknown quest field: '+key+'. This save may need a newer game.');}
 // Legacy saves after the dockside chapter predate El Guapo’s recorded return.
 if(q.chapter6&&!Object.hasOwn(q,'guapoReturned')){q.guapoReturned=true;q.guapoAway=false;q.activeRoster=[...cfg.core];}
 if(!Object.hasOwn(q,'reeseJoined')&&q.chapter3Complete)q.reeseJoined=true;
 if(q.reeseJoined&&!q.chapter3Complete)throw Error('Reese joins after the Hellfire Compact.');
 const available=cfg.core.filter(id=>id!=='reese'||q.reeseJoined);
 if(q.activeRoster&&q.reeseJoined&&cfg.core.includes('reese')&&!q.activeRoster.includes('reese'))q.activeRoster.push('reese');
 if(q.activeRoster?.includes('reese')&&!q.reeseJoined)throw Error('Reese is not yet in the party.');
 const roster=q.activeRoster||(q.guapoAway?available.filter(id=>id!=='guapo'):available);if(q.chapter2&&!q.activeRoster)q.activeRoster=[...roster];if(!roster.includes(data.lead)||q.guapoAway&&roster.includes('guapo'))throw Error('The selected character does not match the active party.');if(!['street','tavern','temple'].includes(data.scene)&&!q.chapter2)throw Error('Chapter state does not match the location.');if(['longacre_square','longacre_jail','scarlet_manor'].includes(data.scene)&&!q.chapter3)throw Error('Chapter Three state does not match the location.');if(q.chapter3&&!q.chapter2Complete)throw Error('Chapter Three requires the Ash House briefing.');if(q.chapter3Complete&&!q.compactSworn)throw Error('Invalid chapter completion state.');if(q.chapter2Complete&&!q.chapter2)throw Error('Invalid chapter completion state.');
 if(q.chapter4&&!q.chapter3Complete)throw Error('The Last Stand requires the Hellfire Compact.');for(const [flag,previous] of [['bolgartSubdued','chapter4'],['rileyCaptured','bolgartSubdued'],['prisonersJailed','rileyCaptured'],['rileyQuestioned','prisonersJailed'],['hillSearched','rileyQuestioned'],['bolgartSecured','hillSearched'],['chapter4Complete','chapter4']])if(q[flag]&&!q[previous])throw Error('Invalid Last Stand sequence: '+flag);if(q.chapter4Complete&&(!q.bolgartSecured||!q.hillSearched))throw Error('Invalid Last Stand completion state.');if(['last_stand','angel_hill'].includes(data.scene)&&!q.chapter4)throw Error('Chapter Four state does not match the location.');
 for(const [flag,previous]of [['chapter5','chapter4Complete'],['churchEntered','doctorAlliance'],['churchDoorsRepaired','churchEntered'],['ingoeAgreement','churchDoorsRepaired'],['chapter5Complete','ingoeAgreement'],['chapter5Complete','chapter5']])if(q[flag]&&!q[previous])throw Error('Invalid Debts and Rumors sequence: '+flag);if(q.doctorAlliance&&!q.rileyQuestioned&&!q.chapter5)throw Error('The hospice visit requires Riley’s interrogation.');if(['rohalendi_hospice','longacre_church'].includes(data.scene)&&!q.chapter5&&!(q.chapter4&&q.rileyQuestioned))throw Error('The first church visit requires Riley’s interrogation.');if(data.scene==='longacre_north_docks'&&!q.chapter5)throw Error('Chapter Five state does not match the location.');
 for(const[flag,previous]of [['chapter6','chapter5Complete'],['gateOpened','chapter6'],['ovinnikSubdued','gateOpened'],['ovinnikReported','ovinnikSubdued'],['churchStandoff','ovinnikReported'],['watchStarted','churchStandoff'],['jailbreakHeard','watchStarted'],['jailbreakInspected','jailbreakHeard'],['escapeTrailLost','jailbreakInspected'],['bolgartReleased','escapeTrailLost'],['executionOrdered','bolgartReleased'],['boCaptured','executionOrdered'],['executionPrepared','boCaptured'],['boExecuted','executionPrepared'],['executionResolved','boExecuted'],['chapter6Complete','executionResolved']])if(q[flag]&&!q[previous])throw Error('Invalid Political Movement sequence: '+flag);if(['gate_watch','church_watch','escape_jail','gramel_gate','execution_manor','execution_square'].includes(data.scene)&&!q.chapter6)throw Error('Chapter Six state does not match the location.');
 for(const[flag,previous]of [['chapter7','chapter6Complete'],['bodiesMissing','chapter7'],['churchTrail','bodiesMissing'],['churchBreach','churchTrail'],['churchLoadout','churchBreach'],['entryCleared','churchBreach'],['hallCleared','entryCleared'],['resurrectionBroken','hallCleared'],['sanctuaryCleared','resurrectionBroken'],['allamarDefeated','sanctuaryCleared'],['ghastDestroyed','allamarDefeated'],['altarBroken','ghastDestroyed'],['assassinKnowledge','altarBroken'],['mantisTraining','assassinKnowledge'],['churchConverted','mantisTraining'],['chapter7Complete','churchConverted']])if(q[flag]&&!q[previous])throw Error('Invalid Church Assault sequence: '+flag);
 if(q.churchBreach&&!q.churchLoadout)throw Error('Church assault loadout is missing.');
 if(['church_night','church_approach','church_entry','church_hall','church_sanctuary','church_ruins','mantis_training','church_asmodeus'].includes(data.scene)&&!q.chapter7)throw Error('Chapter Seven state does not match the location.');
 for(const[flag,previous]of [['chapter8', 'chapter7Complete'], ['smearHeard', 'chapter8'], ['accuserSilenced', 'smearHeard'], ['bodyDisposed', 'accuserSilenced'], ['heistTip', 'bodyDisposed'], ['ambushPrepared', 'heistTip'], ['armoryCleared', 'ambushPrepared'], ['jailReached', 'armoryCleared'], ['porchCleared', 'jailReached'], ['cimriRecovered', 'porchCleared'], ['prisonersQuestioned', 'cimriRecovered'], ['chapter8Complete', 'prisonersQuestioned']])if(q[flag]&&!q[previous])throw Error('Invalid Armory sequence: '+flag);
 if(['smear_docks','accuser_home','river_disposal','heist_church','longacre_armory','burning_jail','heist_aftermath'].includes(data.scene)&&!q.chapter8)throw Error('Chapter Eight state does not match the location.');
 for(const[flag,previous]of [['chapter9', 'chapter8Complete'], ['fortScouted', 'chapter9'], ['scoutRetreated', 'fortScouted'], ['fortPrepared', 'scoutRetreated'], ['archerAmbushed', 'fortPrepared'], ['manticoreDefeated', 'archerAmbushed'], ['fortSearched', 'manticoreDefeated'], ['forestMarked', 'fortSearched'], ['patrolQuestioned', 'forestMarked'], ['chapter9Complete', 'patrolQuestioned']])if(q[flag]&&!q[previous])throw Error('Invalid Fort Estazano sequence: '+flag);
 if(['fort_scout','fort_rest','fort_assault','fort_search','whisperwood_trail','fort_patrol'].includes(data.scene)&&!q.chapter9)throw Error('Chapter Nine state does not match the location.');
 for(const[flag,previous]of [['chapter10', 'chapter9Complete'], ['courtBriefed', 'chapter10'], ['lowerCleared', 'courtBriefed'], ['rhonaDefeated', 'lowerCleared'], ['upperReached', 'rhonaDefeated'], ['lenciaDefeated', 'upperReached'], ['lenciaEscaped', 'lenciaDefeated'], ['courtSecured', 'lenciaEscaped'], ['courtReported', 'courtSecured'], ['chapter10Complete', 'courtReported']])if(q[flag]&&!q[previous])throw Error('Invalid Court of Spears sequence: '+flag);
 if(['court_approach','court_lower','court_upper','court_report'].includes(data.scene)&&!q.chapter10)throw Error('Chapter Ten state does not match the location.');
 for(const[flag,previous]of [["chapter11", "chapter10Complete"],["uskwoodBriefed", "chapter11"],["kantariaAssessed", "uskwoodBriefed"],["patrolsThinned", "kantariaAssessed"],["prisonObserved", "patrolsThinned"],["prisonYardCleared", "prisonObserved"],["prisonHallCleared", "prisonYardCleared"],["zaraIdentified", "prisonHallCleared"],["zaraGearRecovered", "zaraIdentified"],["zaraFreed", "zaraGearRecovered"],["zaraHidden", "zaraFreed"],["chapter11Complete", "zaraHidden"]])if(q[flag]&&!q[previous])throw Error('Invalid Kantaria opening sequence: '+flag);
 if(['uskwood_inn','kantaria_streets','hardship_yard','hardship_hall','uskwood_hideout'].includes(data.scene)&&!q.chapter11)throw Error('Chapter Eleven state does not match the location.');
 for(const[flag,previous]of [["chapter12", "chapter11Complete"], ["disruptionBriefed", "chapter12"], ["docksObserved", "disruptionBriefed"], ["dockDefendersCleared", "docksObserved"], ["docksBurned", "dockDefendersCleared"], ["jonasEscaped", "docksBurned"], ["southTowerDamaged", "jonasEscaped"], ["northTowerCleared", "southTowerDamaged"], ["westTowerReached", "northTowerCleared"], ["angelBroDefeated", "westTowerReached"], ["westTowerBurned", "angelBroDefeated"], ["disruptionReported", "westTowerBurned"], ["chapter12Complete", "disruptionReported"]])if(q[flag]&&!q[previous])throw Error('Invalid Kantaria disruption sequence: '+flag);
 for(const flag of ['dockPierBurned','dockStoresBurned','dockOfficeBurned'])if(q[flag]&&!q.dockDefendersCleared)throw Error('Dock fires require cleared defenders.');
 if(q.docksBurned&&(!q.dockPierBurned||!q.dockStoresBurned||!q.dockOfficeBurned))throw Error('Incomplete dock fires.');
 if(['disruption_briefing','kantaria_docks','kantaria_north_tower','kantaria_west_tower','disruption_report'].includes(data.scene)&&!q.chapter12)throw Error('Chapter Twelve state does not match the location.');
 for(const[location,required]of [['kantaria_docks','disruptionBriefed'],['kantaria_north_tower','southTowerDamaged'],['kantaria_west_tower','westTowerReached'],['disruption_report','westTowerBurned']])if(data.scene===location&&!q[required])throw Error('Premature Chapter Twelve location: '+location);

 for(const[flag,previous]of [["chapter13", "chapter12Complete"], ["covertBriefed", "chapter13"], ["marketSurveyed", "covertBriefed"], ["marketRiot", "marketSurveyed"], ["patrolAmbushed", "marketRiot"], ["falseBlame", "patrolAmbushed"], ["guildEntered", "falseBlame"], ["guildRecordsTampered", "guildEntered"], ["manorObserved", "guildRecordsTampered"], ["manorArtifactsTaken", "manorObserved"], ["uskwoodReturned", "manorArtifactsTaken"], ["uskwoodBurned", "uskwoodReturned"], ["escapeOpened", "uskwoodBurned"], ["cavesReached", "escapeOpened"], ["caveRested", "cavesReached"], ["corrineAssigned", "caveRested"], ["chapter13Complete", "corrineAssigned"]])if(q[flag]&&!q[previous])throw Error('Invalid Kantaria covert sequence: '+flag);
 if(["covert_briefing", "kantaria_market", "kantaria_patrol_lane", "kantaria_guild", "kantaria_manor", "uskwood_last_night", "fungus_shelter"].includes(data.scene)&&!q.chapter13)throw Error('Chapter Thirteen state does not match the location.');
 for(const[location,required]of [["kantaria_market", "covertBriefed"], ["kantaria_patrol_lane", "marketRiot"], ["kantaria_guild", "falseBlame"], ["kantaria_manor", "guildRecordsTampered"], ["uskwood_last_night", "uskwoodReturned"], ["fungus_shelter", "cavesReached"]])if(data.scene===location&&!q[required])throw Error('Premature Chapter Thirteen location: '+location);
 for(const [flag,previous] of [
  ['chapter15','chapter14Complete'], ['fastnessMustered','chapter15'],
  ['fastnessGateCleared','fastnessMustered'], ['fastnessGateComplete','fastnessGateCleared'],
  ['fastnessHallCleared','fastnessGateComplete'], ['fastnessChapelCleared','fastnessHallCleared'],
  ['fastnessInteriorComplete','fastnessChapelCleared'],
  ['fastnessMageCleared','fastnessInteriorComplete'], ['fastnessWarpriestCleared','fastnessMageCleared'],
  ['fastnessLenciaSlain','fastnessWarpriestCleared'], ['fastnessAscentComplete','fastnessLenciaSlain'],
  ['fastnessSummitWon','fastnessAscentComplete'], ['fastnessOppianRescued','fastnessSummitWon'],
  ['fastnessOppianCaptured','fastnessOppianRescued'], ['chapter15Complete','fastnessOppianCaptured']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Valor’s Fastness sequence: '+flag);
 const fastnessScenes=['fastness_gate','fastness_hall','fastness_chapel','fastness_study','fastness_landing','fastness_gallery','fastness_summit','fastness_tower_base'];
 if((fastnessScenes.includes(data.scene)||['kantaria_council','south_road','south_road_camp','egorian_bridge','egorian_square','egorian_temple','egorian_manor','egorian_lantern_lane','egorian_guard_lane','egorian_court','egorian_forge','egorian_lower_lane','egorian_excruciation','egorian_inquiry','senara_waterfront','senara_fex_villa','senara_party','senara_orphan_yard','senara_orphanage','senara_sewers','senara_daggers_hideout','senara_hellknight_citadel','whisperwood_road','whisperwood_night_camp','whisperwood_unicorn_glade','senara_prison_road','senara_patrolled_quay','senara_daggers_return','senara_graveyard','senara_locked_quay','arego_forest_approach','arego_outer_yard','arego_prison_cells','arego_inferno_gate','arego_malebolge_ledge','egorian_hotel_barato','egorian_discharge_square','egorian_fountain','egorian_tailor_street','remesiana_return','remesiana_rival_market','westcrown_quay','egorian_efisio_apartment','egorian_efisio_street','hinji_shipyard','egorian_sting_hall','egorian_feud_salon','sethic_devil_hog_farm','egorian_judicial_records','egorian_loan_strongroom','egorian_nicolo_lane','egorian_pale_graveyard','belde_square','hinji_tavern','corentyn_quay','ballerina_deck','rachikan_ruins','pezzack_manse','pezzack_egorian','egorian_bellflower_barge','egorian_migos_hideaway','egorian_bellflower_barn','egorian_sethic_mansion','egorian_sethic_cellar','vyre_wish_room','barrow_road','barrow_grove','barrow_covenant','menador_pass','tathlum_orders','nidal_hunt_village','nidal_giant_lair','darkrain_pass','darkrain_skull_slope','frost_giant_yard','frost_giant_hall','molthune_remorhaz_slope','molthune_waystation','nidal_arrival_court','dinyar_ridge'].includes(data.scene))!==!!q.chapter15)throw Error('Valor’s Fastness state does not match the location.');
 for(const [room,entryFlag,nextVictory] of [
  ['fastness_gate','chapter15','fastnessHallCleared'],
  ['fastness_hall','fastnessGateComplete','fastnessChapelCleared'],
  ['fastness_chapel','fastnessHallCleared','fastnessMageCleared'],
  ['fastness_study','fastnessInteriorComplete','fastnessWarpriestCleared'],
  ['fastness_landing','fastnessMageCleared','fastnessLenciaSlain'],
  ['fastness_gallery','fastnessWarpriestCleared','fastnessSummitWon'],
  ['fastness_summit','fastnessAscentComplete','fastnessOppianRescued'],
  ['fastness_tower_base','fastnessOppianRescued','kantariaMayorMet']
 ]){
  if(data.scene!==room)continue;
  if(!q[entryFlag])throw Error('Premature Valor’s Fastness location: '+data.scene);
  if(nextVictory&&q[nextVictory])throw Error('Valor’s Fastness progress does not match the location.');
 }
 for(const [flag,previous] of [
  ['kantariaMayorMet','chapter15Complete'], ['uskwoodDeedSigned','kantariaMayorMet'],
  ['kantariaGiftsReceived','uskwoodDeedSigned'], ['kantariaDepartureReady','kantariaGiftsReceived']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Kantaria aftermath sequence: '+flag);
 for(const [flag,previous] of [
  ['roadScouted','kantariaDepartureReady'], ['roadSentryMarked','roadScouted'],
  ['roadInfantryCleared','roadScouted'], ['roadKnightsCleared','roadInfantryCleared'],
  ['roadClericsCleared','roadKnightsCleared'], ['roadDraymusTreated','roadClericsCleared'],
  ['roadRested','roadDraymusTreated'], ['southRoadComplete','roadRested']
 ])if(q[flag]&&!q[previous])throw Error('Invalid South Road sequence: '+flag);
 if(data.scene==='south_road'&&(!q.kantariaDepartureReady||q.roadRested))throw Error('South Road progress does not match the road.');
 if(data.scene==='south_road_camp'&&!q.roadDraymusTreated)throw Error('Premature South Road camp.');
 for(const [flag,previous] of [
  ['egorianBridgeMet','southRoadComplete'], ['oppianDelivered','egorianBridgeMet'],
  ['egorianTempleSupplied','oppianDelivered'], ['triaWelcomed','egorianTempleSupplied'],
  ['egorianArrivalComplete','triaWelcomed']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Egorian arrival sequence: '+flag);
 for(const [map,required,invalid] of [
  ['south_road_camp',null,'egorianBridgeMet'],
  ['egorian_bridge','southRoadComplete','oppianDelivered'],
  ['egorian_square','egorianBridgeMet','triaWelcomed'],
  ['egorian_temple','oppianDelivered','triaWelcomed'],
  ['egorian_manor','egorianTempleSupplied',null]
 ])if(data.scene===map&&((required&&!q[required])||(invalid&&q[invalid])))throw Error('Egorian progress does not match the location.');
 for(const [flag,previous] of [
  ['egorianNightStarted','egorianArrivalComplete'], ['egorianSvetlanaMet','egorianNightStarted'],
  ['egorianGuardLeadChecked','egorianSvetlanaMet'], ['egorianContractAccepted','egorianGuardLeadChecked'],
  ['egorianNightReturned','egorianContractAccepted']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Egorian night sequence: '+flag);
 if(data.scene==='egorian_lantern_lane'&&(!q.egorianNightStarted||q.egorianGuardLeadChecked))throw Error('Egorian night progress does not match Lantern Lane.');
 if(data.scene==='egorian_guard_lane'&&(!q.egorianSvetlanaMet||q.egorianNightReturned))throw Error('Egorian night progress does not match the guard’s lane.');
 if(data.scene==='egorian_manor'&&q.egorianNightStarted&&!q.egorianNightReturned)throw Error('The pair has not returned to Falco Manor.');
 for(const [flag,previous] of [
  ['egorianTrialStarted','egorianNightReturned'], ['egorianZaraMet','egorianTrialStarted'],
  ['egorianFreyaTestified','egorianZaraMet'], ['egorianJasonTestified','egorianFreyaTestified'],
  ['egorianVerdict','egorianJasonTestified'], ['egorianSmithMet','egorianVerdict'],
  ['zaraGeitta','egorianSmithMet'], ['egorianPlateReturned','zaraGeitta']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Egorian trial sequence: '+flag);
 if(data.scene==='egorian_court'&&(!q.egorianTrialStarted||q.egorianSmithMet))throw Error('Egorian trial progress does not match the court.');
 if(data.scene==='egorian_forge'&&(!q.egorianVerdict||q.egorianPlateReturned))throw Error('Egorian trial progress does not match the forge.');
 if(data.scene==='egorian_manor'&&q.egorianTrialStarted&&!q.egorianPlateReturned)throw Error('Freya has not returned from the forge.');
 for(const [flag,previous] of [
  ['egorianDraymusStarted','egorianPlateReturned'], ['egorianAmbushResolved','egorianDraymusStarted'],
  ['egorianJoeRaised','egorianAmbushResolved'], ['egorianChairBought','egorianJoeRaised'],
  ['egorianDisguiseReady','egorianChairBought'], ['egorianDraymusReturned','egorianDisguiseReady']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Draymus outing sequence: '+flag);
 if(data.scene==='egorian_lower_lane'&&(!q.egorianDraymusStarted||q.egorianDraymusReturned))throw Error('Draymus’s progress does not match Lower Lane.');
 if(data.scene==='egorian_manor'&&q.egorianDraymusStarted&&!q.egorianDraymusReturned)throw Error('Draymus has not returned from Lower Lane.');
 for(const [flag,previous] of [
  ['egorianExcruciationStarted','egorianDraymusReturned'], ['egorianChargesRead','egorianExcruciationStarted'],
  ['egorianTracked','egorianChargesRead'], ['egorianAssassination','egorianTracked'],
  ['egorianDuelWon','egorianAssassination'], ['egorianLastGuardDown','egorianDuelWon'],
  ['egorianJmalEscaped','egorianLastGuardDown'], ['egorianDottariHeard','egorianJmalEscaped'],
  ['egorianExcruciated','egorianDottariHeard']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Egorian excruciation sequence: '+flag);
 if(data.scene==='egorian_excruciation'&&!q.egorianExcruciationStarted)throw Error('Premature Egorian excruciation location.');
 if(data.scene==='egorian_manor'&&q.egorianExcruciationStarted)throw Error('The company has already left for the excruciation.');
 for(const [flag,previous] of [
  ['egorianInquiryVisited','egorianExcruciated'], ['egorianChargesDropped','egorianInquiryVisited'],
  ['senaraOrders','egorianChargesDropped'], ['senaraGarrisonSeen','senaraOrders'],
  ['senaraTalismanMissing','senaraGarrisonSeen']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Senara arrival sequence: '+flag);
 if(data.scene==='egorian_excruciation'&&q.egorianInquiryVisited)throw Error('The company has already left the square.');
 if(data.scene==='egorian_inquiry'&&(!q.egorianInquiryVisited||q.senaraGarrisonSeen))throw Error('Egorian inquiry progress does not match the court.');
 if(data.scene==='senara_waterfront'&&(!q.senaraOrders||q.senaraTalismanMissing))throw Error('Senara progress does not match the river road.');
 if(data.scene==='senara_fex_villa'&&!q.senaraGarrisonSeen)throw Error('Premature Senara residence.');
 for(const [flag,previous] of [
  ['senaraPartyStarted','senaraTalismanMissing'], ['senaraPartyPlayed','senaraPartyStarted'],
  ['senaraOrphanApproach','senaraPartyPlayed'], ['senaraOrphanEntered','senaraOrphanApproach'],
  ['senaraOrphanClue','senaraOrphanEntered'], ['senaraWitnessesSeen','senaraOrphanClue'],
  ['senaraOrphanageComplete','senaraWitnessesSeen']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Senara reconnaissance sequence: '+flag);
 for(const [location,required,invalid] of [
  ['senara_party','senaraPartyStarted','senaraOrphanApproach'],
  ['senara_orphan_yard','senaraOrphanApproach','senaraOrphanEntered'],
  ['senara_orphanage','senaraOrphanEntered','senaraOrphanageComplete']
 ])if(data.scene===location&&(!q[required]||q[invalid]))throw Error('Senara reconnaissance progress does not match the location.');
 for(const [flag,previous] of [
  ['senaraSewersEntered','senaraOrphanageComplete'], ['senaraJmalFound','senaraSewersEntered'],
  ['senaraGuildEntered','senaraJmalFound'], ['senaraGuildScouted','senaraGuildEntered'],
  ['senaraGuildSurrendered','senaraGuildScouted'], ['senaraTalismanRecovered','senaraGuildSurrendered']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Black Daggers sequence: '+flag);
 for(const [location,required,invalid] of [
  ['senara_sewers','senaraSewersEntered','senaraGuildEntered'],
  ['senara_daggers_hideout','senaraGuildEntered','senaraTalismanRecovered']
 ])if(data.scene===location&&(!q[required]||q[invalid]))throw Error('Black Daggers progress does not match the location.');
 for(const [flag,previous] of [
  ['senaraCitadelVisited','senaraTalismanRecovered'], ['senaraChapterGreeted','senaraCitadelVisited'],
  ['senaraDraymusTrained','senaraChapterGreeted'], ['senaraForestIntel','senaraDraymusTrained'],
  ['senaraCarriageDeparted','senaraForestIntel'], ['senaraWhisperwoodReady','senaraCarriageDeparted']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Hellknight citadel sequence: '+flag);
 if(data.scene==='senara_hellknight_citadel'&&(!q.senaraCitadelVisited||q.senaraCarriageDeparted))throw Error('Progress does not match the Hellknight citadel.');
 if(data.scene==='whisperwood_road'&&(!q.senaraCarriageDeparted||q.whisperwoodCampReached))throw Error('Progress does not match the Whisperwood road.');
 for(const [flag,previous] of [
  ['whisperwoodCampReached','senaraWhisperwoodReady'], ['whisperwoodWatchSet','whisperwoodCampReached'],
  ['whisperwoodWebsCleared','whisperwoodWatchSet'], ['whisperwoodGiantCleared','whisperwoodWebsCleared'],
  ['whisperwoodBobMauled','whisperwoodGiantCleared'], ['whisperwoodBearDrivenOff','whisperwoodBobMauled'],
  ['whisperwoodBobRescued','whisperwoodBearDrivenOff'], ['whisperwoodNightComplete','whisperwoodBobRescued']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Whisperwood camp sequence: '+flag);
 if(data.scene==='whisperwood_night_camp'&&!q.whisperwoodCampReached)throw Error('Premature Whisperwood camp checkpoint.');
 for(const [flag,previous] of [
  ['whisperwoodGladeReached','whisperwoodNightComplete'], ['whisperwoodUnicornsDefeated','whisperwoodGladeReached'],
  ['whisperwoodThreeHorns','whisperwoodUnicornsDefeated'], ['whisperwoodGladeCamped','whisperwoodThreeHorns'],
  ['whisperwoodFourthHorn','whisperwoodGladeCamped'], ['whisperwoodGladeComplete','whisperwoodFourthHorn']
 ])if(q[flag]&&!q[previous])throw Error('Invalid unicorn glade sequence: '+flag);
 if(q.whisperwoodFourthHorn&&!q.whisperwoodGladeComplete)throw Error('The fourth horn is saved after the retreat.');
 if(data.scene==='whisperwood_unicorn_glade'&&(!q.whisperwoodGladeReached||q.whisperwoodGladeComplete))throw Error('Progress does not match the unicorn glade.');
 if(data.scene==='whisperwood_night_camp'&&q.whisperwoodGladeReached&&!q.whisperwoodGladeComplete)throw Error('The company has not yet returned from the glade.');
 for(const [flag,previous] of [
  ['senaraWagonReached','whisperwoodGladeComplete'], ['senaraWagonChallenged','senaraWagonReached'],
  ['senaraEscortDefeated','senaraWagonChallenged'], ['senaraPrisonerFreed','senaraEscortDefeated'],
  ['senaraOrnRecruited','senaraPrisonerFreed'], ['senaraWagonReturned','senaraOrnRecruited'],
  ['senaraReturnPatrolsSeen','senaraWagonReturned']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Senara prison wagon sequence: '+flag);
 if(data.scene==='senara_prison_road'&&(!q.senaraWagonReached||q.senaraWagonReturned))throw Error('Progress does not match the prison road.');
 if(data.scene==='senara_patrolled_quay'&&(!q.senaraWagonReturned||q.senaraGuildRevisited))throw Error('Progress does not match the patrolled quay.');
 for(const [flag,previous] of [
  ['senaraGuildRevisited','senaraReturnPatrolsSeen'], ['senaraGraveTip','senaraGuildRevisited'],
  ['senaraGraveReached','senaraGraveTip'], ['senaraBalisseDefeated','senaraGraveReached'],
  ['senaraAngelHeart','senaraBalisseDefeated'], ['senaraLockdownObserved','senaraAngelHeart']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Senara graveyard sequence: '+flag);
 for(const [location,required,invalid] of [
  ['senara_daggers_return','senaraGuildRevisited','senaraGraveReached'],
  ['senara_graveyard','senaraGraveReached','senaraAngelHeart'],
  ['senara_locked_quay','senaraAngelHeart']
 ])if(data.scene===location&&(!q[required]||q[invalid]))throw Error('Progress does not match the Senara graveyard route.');
 for(const [flag,previous] of [
  ['aregoApproachReached','senaraLockdownObserved'], ['aregoBetrayalKnown','aregoApproachReached'],
  ['aregoFexOpposed','aregoBetrayalKnown'], ['aregoYardReached','aregoFexOpposed'],
  ['aregoVionaFell','aregoYardReached'], ['aregoChampionsDefeated','aregoVionaFell'],
  ['aregoExteriorSecured','aregoChampionsDefeated']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Fort Arego exterior sequence: '+flag);
 if(data.scene==='senara_locked_quay'&&q.aregoApproachReached)throw Error('The company has already left for Fort Arego.');
 if(data.scene==='arego_forest_approach'&&(!q.aregoApproachReached||q.aregoYardReached))throw Error('Progress does not match the Fort Arego approach.');
 if(data.scene==='arego_outer_yard'&&(!q.aregoYardReached||q.aregoDungeonEntered))throw Error('Progress does not match the Fort Arego yard.');
 for(const [flag,previous] of [
  ['aregoDungeonEntered','aregoExteriorSecured'], ['aregoCellDevilsDefeated','aregoDungeonEntered'],
  ['aregoStairParley','aregoCellDevilsDefeated'], ['aregoGateReached','aregoStairParley'],
  ['aregoGateSurveyed','aregoGateReached'], ['aregoTalismanExposed','aregoGateSurveyed'],
  ['aregoFirstPact','aregoTalismanExposed']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Inferno Gate sequence: '+flag);
 if(data.scene==='arego_prison_cells'&&(!q.aregoDungeonEntered||q.aregoGateReached))throw Error('Progress does not match the Fort Arego cells.');
 if(data.scene==='arego_inferno_gate'&&(!q.aregoGateReached||q.aregoEgorianEscaped||q.aregoReeseCrossed&&!q.aregoReeseReturned))throw Error('Progress does not match the Inferno Gate.');
 for(const [flag,previous] of [
  ['aregoFexArrived','aregoFirstPact'], ['aregoReeseCrossed','aregoFexArrived'],
  ['aregoReeseSheltered','aregoReeseCrossed']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Fort Arego ambush sequence: '+flag);
 if(data.scene==='arego_malebolge_ledge'&&(!q.aregoReeseCrossed||q.aregoReeseReturned))throw Error('Progress does not match the Malebolge ledge.');
 for(const [flag,previous] of [
  ['aregoReeseContract','aregoReeseSheltered'], ['aregoBoneDevilsSummoned','aregoReeseContract'],
  ['aregoReeseReturned','aregoBoneDevilsSummoned'], ['aregoCompanyFreed','aregoReeseReturned'],
  ['aregoFexSlain','aregoCompanyFreed'], ['aregoFexAftermath','aregoFexSlain']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Fort Arego rematch sequence: '+flag);
 for(const [flag,previous] of [
  ['aregoCorrineArrived','aregoFexAftermath'], ['aregoExitTerms','aregoCorrineArrived'],
  ['aregoGateSealed','aregoExitTerms'], ['aregoEgorianEscaped','aregoGateSealed'],
  ['aregoReportsSent','aregoEgorianEscaped']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Fort Arego evacuation sequence: '+flag);
 if(data.scene==='egorian_hotel_barato'&&(!q.aregoEgorianEscaped||q.egorianFreyaDischarged&&!q.egorianDischargeHome))throw Error('Progress does not match Hotel Barato.');
 for(const [flag,previous] of [
  ['egorianJasonBack','aregoReportsSent'], ['egorianDischargeRumor','egorianJasonBack'],
  ['egorianFreyaDischarged','egorianDischargeRumor'], ['egorianWalkBegan','egorianFreyaDischarged'],
  ['egorianZaraStoppedCrowd','egorianWalkBegan'], ['egorianDischargeHome','egorianZaraStoppedCrowd'],
  ['egorianDischargeComplete','egorianDischargeHome']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Egorian discharge sequence: '+flag);
 if(data.scene==='egorian_discharge_square'&&(!q.egorianFreyaDischarged||q.egorianDischargeHome))throw Error('Progress does not match the keep square.');
 for(const [flag,previous] of [
  ['egorianVisionSeen','egorianDischargeComplete'], ['egorianFountainOrders','egorianVisionSeen'],
  ['egorianTailorStreetReached','egorianFountainOrders'], ['egorianTailorShopSeen','egorianTailorStreetReached'],
  ['egorianTailorHomeSeen','egorianTailorShopSeen'], ['egorianTailorSchoolsSeen','egorianTailorHomeSeen'],
  ['egorianTailorScouted','egorianTailorSchoolsSeen'], ['egorianTailorOrdersCarriedOut','egorianTailorScouted'],
  ['egorianTailorAftermathSeen','egorianTailorOrdersCarriedOut'], ['remesianaReturned','egorianTailorAftermathSeen'],
  ['remesianaFlorioLead','remesianaReturned']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Egorian fountain sequence: '+flag);
 if(data.scene==='egorian_fountain'&&(!q.egorianVisionSeen||q.egorianTailorStreetReached))throw Error('Progress does not match the fountain.');
 if(data.scene==='egorian_tailor_street'&&(!q.egorianTailorStreetReached||(q.egorianTailorScouted&&!q.egorianTailorOrdersCarriedOut)||q.remesianaReturned))throw Error('Progress does not match the tailor’s quarter.');
 if(data.scene==='egorian_hotel_barato'&&q.egorianVisionSeen&&(!q.egorianTailorScouted||q.egorianTailorOrdersCarriedOut))throw Error('Progress does not match the tailor’s assignment at Hotel Barato.');
 for(const [flag,previous] of [
  ['remesianaFlorioMet','remesianaFlorioLead'], ['remesianaMarketReached','remesianaFlorioMet'],
  ['remesianaMarketBaysOpen','remesianaMarketReached'], ['remesianaMarketEvacuated','remesianaMarketBaysOpen'],
  ['remesianaMarketDestroyed','remesianaMarketEvacuated'], ['remesianaMarketWithdrawn','remesianaMarketDestroyed'],
  ['remesianaFlorioReported','remesianaMarketWithdrawn']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Remesiana market sequence: '+flag);
 if(data.scene==='remesiana_return'&&(!q.remesianaReturned||(q.remesianaMarketReached&&!q.remesianaMarketWithdrawn)))throw Error('Progress does not match the return to Remesiana.');
 if(data.scene==='remesiana_rival_market'&&(!q.remesianaMarketReached||q.remesianaMarketWithdrawn))throw Error('Progress does not match the rival market.');
 for(const [flag,previous] of [
  ['westcrownReached','remesianaFlorioReported'], ['westcrownHired','westcrownReached'],
  ['westcrownManifestChecked','westcrownHired'], ['westcrownNoteDelivered','westcrownHired'],
  ['westcrownBerthChecked','westcrownHired'], ['westcrownComplete','westcrownManifestChecked'],
  ['westcrownComplete','westcrownNoteDelivered'], ['westcrownComplete','westcrownBerthChecked']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Westcrown sequence: '+flag);
 for(const [flag,previous] of [
  ['hinjiReached','remesianaFlorioReported'], ['hinjiDeclined','hinjiReached'],
  ['hinjiPapersSent','hinjiDeclined'], ['hinjiComplete','hinjiPapersSent']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Hinji sequence: '+flag);
 // Older checkpoints may already be in Westcrown without having entered the inserted section.
 if(q.westcrownReached&&q.hinjiReached&&!q.hinjiComplete)throw Error('Hinji is still in progress.');
 if(data.scene==='hinji_shipyard'&&(!q.hinjiReached||q.westcrownReached))throw Error('Progress does not match the Hinji shipyard.');
 if(data.scene==='remesiana_return'&&q.hinjiReached)throw Error('The company has already left for Hinji.');
 if(data.scene==='westcrown_quay'&&!q.westcrownReached)throw Error('Progress does not match Westcrown.');
 if(data.scene==='remesiana_return'&&q.westcrownReached)throw Error('The company has already left for Westcrown.');
 for(const [flag,previous] of [
  ['efisioApartmentReached','westcrownComplete'], ['efisioContractInvoked','efisioApartmentReached'],
  ['efisioReeseRestrained','efisioContractInvoked'], ['efisioGuardsDefeated','efisioReeseRestrained'],
  ['efisioWindowFollowed','efisioGuardsDefeated'], ['efisioDefeated','efisioWindowFollowed']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Efisio sequence: '+flag);
 if(data.scene==='westcrown_quay'&&q.efisioApartmentReached)throw Error('The company has already left for Egorian.');
 if(data.scene==='egorian_efisio_apartment'&&(!q.efisioApartmentReached||q.efisioWindowFollowed))throw Error('Progress does not match Efisio’s apartment.');
 if(data.scene==='egorian_efisio_street'&&!q.efisioWindowFollowed)throw Error('Progress does not match the street pursuit.');
 for(const [flag,previous] of [
  ['egorianStingReached','efisioDefeated'], ['egorianStingBriefed','egorianStingReached'],
  ['egorianStingComplete','egorianStingBriefed'], ['egorianStandingRestored','egorianStingComplete'],
  ['egorianStingDebriefed','egorianStandingRestored']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Egorian sting sequence: '+flag);
 if(data.scene==='egorian_sting_hall'&&!q.egorianStingReached)throw Error('Progress does not match the Crown’s debrief.');
 if(data.scene==='egorian_efisio_street'&&q.egorianStingReached)throw Error('The company has already left for Corrine’s debrief.');
 for(const [flag,previous] of [
  ['egorianFeudReached','egorianStingDebriefed'], ['egorianSethicHeard','egorianFeudReached'],
  ['egorianVasvionHeard','egorianFeudReached'], ['egorianFeudPressure','egorianSethicHeard'],
  ['egorianFeudPressure','egorianVasvionHeard'], ['egorianVasvionChosen','egorianFeudPressure']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Egorian feud sequence: '+flag);
 if(data.scene==='egorian_feud_salon'&&!q.egorianFeudReached)throw Error('Progress does not match the reception.');
 if(data.scene==='egorian_sting_hall'&&q.egorianFeudReached)throw Error('The company has already left for the reception.');
 for(const [flag,previous] of [
  ['sethicFarmReached','egorianVasvionChosen'], ['sethicFarmSurveyed','sethicFarmReached'],
  ['sethicHogsDriven','sethicFarmSurveyed'], ['sethicFarmDestroyed','sethicHogsDriven'],
  ['sethicFarmComplete','sethicFarmDestroyed']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Sethic farm sequence: '+flag);
 if(data.scene==='sethic_devil_hog_farm'&&(!q.sethicFarmReached||q.sethicFarmComplete))throw Error('Progress does not match the devil-hog farm.');
 if(data.scene==='egorian_feud_salon'&&q.sethicFarmReached&&!q.sethicFarmComplete)throw Error('The company has not returned from Sethic’s farm.');
 for(const [flag,previous] of [
  ['sethicRecordsReached','sethicFarmComplete'], ['sethicPaymentsFound','sethicRecordsReached'],
  ['sethicRegisterMatched','sethicRecordsReached'], ['sethicJudgesIndicted','sethicPaymentsFound'],
  ['sethicJudgesIndicted','sethicRegisterMatched'], ['sethicLoanReached','sethicJudgesIndicted'],
  ['sethicLoanTraced','sethicLoanReached'], ['sethicLoanFailed','sethicLoanTraced'],
  ['sethicFinanceComplete','sethicLoanFailed']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Sethic finance sequence: '+flag);
 if(data.scene==='egorian_judicial_records'&&(!q.sethicRecordsReached||q.sethicLoanReached))throw Error('Progress does not match the judicial records.');
 if(data.scene==='egorian_loan_strongroom'&&(!q.sethicLoanReached||q.sethicFinanceComplete))throw Error('Progress does not match the loan strongroom.');
 if(data.scene==='egorian_feud_salon'&&q.sethicRecordsReached&&!q.sethicFinanceComplete)throw Error('The company has not finished following Sethic’s loan.');
 for(const [flag,previous] of [
  ['nicoloLaneReached','sethicFinanceComplete'], ['nicoloAmbushed','nicoloLaneReached'],
  ['nicoloGrayMenDriven','nicoloAmbushed'], ['nicoloChecked','nicoloGrayMenDriven'],
  ['nicoloRescueComplete','nicoloChecked']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Nicolo rescue sequence: '+flag);
 if(data.scene==='egorian_nicolo_lane'&&(!q.nicoloLaneReached||q.nicoloRescueComplete))throw Error('Progress does not match the Gray Men’s ambush.');
 if(data.scene==='egorian_feud_salon'&&q.nicoloLaneReached&&!q.nicoloRescueComplete)throw Error('The company has not returned from the ambush.');
 for(const [flag,previous] of [
  ['paleBallReached','nicoloRescueComplete'], ['paleGuestsMet','paleBallReached'],
  ['paleShowSeen','paleGuestsMet'], ['paleQueenMet','paleShowSeen'],
  ['paleChallenged','paleQueenMet'], ['paleArmorSummoned','paleChallenged'],
  ['paleDuelWon','paleArmorSummoned'], ['paleLootSeen','paleDuelWon'],
  ['paleBallComplete','paleLootSeen']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Night of the Pale sequence: '+flag);
 if(data.scene==='egorian_pale_graveyard'&&(!q.paleBallReached||q.paleBallComplete))throw Error('Progress does not match the Night of the Pale.');
 if(data.scene==='egorian_feud_salon'&&q.paleBallReached&&!q.paleBallComplete)throw Error('The company has not returned from the Night of the Pale.');
 for(const [flag,previous] of [
  ['beldeReached','paleBallComplete'], ['beldeWatchSeen','beldeReached'],
  ['beldeLiberated','beldeWatchSeen'], ['beldeTriviaStarted','beldeLiberated'],
  ['beldeTriviaFirst','beldeTriviaStarted'], ['beldeTriviaSecond','beldeTriviaFirst'],
  ['beldeTriviaWon','beldeTriviaSecond'], ['beldeComplete','beldeTriviaWon']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Belde sequence: '+flag);
 if(data.scene==='belde_square'&&!q.beldeReached)throw Error('Progress does not match Belde.');
 if(data.scene==='egorian_feud_salon'&&q.beldeReached)throw Error('The company has already left for Belde.');
 for(const [flag,previous] of [
  ['hinjiTavernReached','beldeComplete'],['hinjiTavernToast','hinjiTavernReached'],
  ['hinjiTavernArrested','hinjiTavernToast']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Hinji tavern sequence: '+flag);
 if(data.scene==='hinji_tavern'&&!q.hinjiTavernReached)throw Error('Progress does not match the Hinji tavern.');
 if(data.scene==='belde_square'&&q.hinjiTavernReached)throw Error('The company has already left Belde.');
 for(const [flag,previous] of [
  ['corentynReached','hinjiTavernArrested'],['ballerinaBoarded','corentynReached'],
  ['ballerinaCargoChecked','ballerinaBoarded'],['ballerinaWatchTaken','ballerinaCargoChecked']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Ballerina sequence: '+flag);
 if(data.scene==='corentyn_quay'&&(!q.corentynReached||q.ballerinaBoarded))throw Error('Progress does not match the Corentyn quay.');
 if(data.scene==='ballerina_deck'&&!q.ballerinaBoarded)throw Error('The company has not boarded the Ballerina.');
 if(data.scene==='hinji_tavern'&&q.corentynReached)throw Error('The company has already left Hinji.');
 for(const [flag,previous] of [
  ['rachikanReached','ballerinaWatchTaken'],['rachikanSurveyed','rachikanReached'],
  ['rachikanRaidWon','rachikanSurveyed'],['rachikanComplete','rachikanRaidWon']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Rachikan sequence: '+flag);
 if(data.scene==='rachikan_ruins'&&!q.rachikanReached)throw Error('Progress does not match Rachikan.');
 if(data.scene==='ballerina_deck'&&q.rachikanReached)throw Error('The company has already landed at Rachikan.');
 for(const [flag,previous] of [
  ['pezzackReached','rachikanComplete'],['pezzackManseBurned','pezzackReached'],
  ['pezzackPrisonersFreed','pezzackManseBurned'],['pezzackStrixSeen','pezzackPrisonersFreed'],
  ['pezzackComplete','pezzackStrixSeen']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Pezzack sequence: '+flag);
 if(data.scene==='pezzack_manse'&&(!q.pezzackReached||q.pezzackComplete))throw Error('Progress does not match the Pezzack manse.');
 if(data.scene==='pezzack_egorian'&&!q.pezzackComplete)throw Error('The company has not returned from Pezzack.');
 if(data.scene==='rachikan_ruins'&&q.pezzackReached)throw Error('The company has already left Rachikan.');
 for(const [flag,previous] of [
  ['bellflowerReached','pezzackComplete'],['bellflowerPrepared','bellflowerReached'],
  ['bellflowerPartyStarted','bellflowerPrepared'],['bellflowerHeld','bellflowerPartyStarted'],
  ['bellflowerBargeComplete','bellflowerHeld']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Bellflower barge sequence: '+flag);
 if(data.scene==='egorian_bellflower_barge'&&(!q.bellflowerReached||q.bellflowerBargeComplete))throw Error('Progress does not match the Bellflower barge.');
 if(data.scene==='egorian_migos_hideaway'&&!q.bellflowerBargeComplete)throw Error('The company has not recalled to Migos Street.');
 if(data.scene==='pezzack_egorian'&&q.bellflowerReached)throw Error('The company has already left for the barge.');
 for(const [flag,previous] of [
  ['bellflowerBarnReached','bellflowerBargeComplete'],['bellflowerBarnScouted','bellflowerBarnReached'],
  ['bellflowerBarnLeveled','bellflowerBarnScouted'],['bellflowerBarnComplete','bellflowerBarnLeveled']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Bellflower barn sequence: '+flag);
 if(data.scene==='egorian_bellflower_barn'&&!q.bellflowerBarnReached)throw Error('The company has not reached the Bellflower barn.');
 if(data.scene==='egorian_migos_hideaway'&&q.bellflowerBarnReached)throw Error('The company has already left for the Bellflower barn.');
 for(const [flag,previous] of [
  ['sethicMansionReached','bellflowerBarnComplete'],['sethicMansionGuardsDown','sethicMansionReached'],
  ['sethicMansionCellarEntered','sethicMansionGuardsDown'],['sethicMansionBobFreed','sethicMansionCellarEntered'],
  ['sethicMansionWaited','sethicMansionBobFreed'],['sethicMansionSethicDown','sethicMansionWaited'],
  ['sethicMansionBound','sethicMansionSethicDown'],['sethicMansionComplete','sethicMansionBound']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Sethic mansion sequence: '+flag);
 if(data.scene==='egorian_sethic_mansion'&&(!q.sethicMansionReached||q.sethicMansionCellarEntered&&!q.sethicMansionWaited))throw Error('Progress does not match Sethic’s mansion.');
 if(data.scene==='egorian_sethic_cellar'&&(!q.sethicMansionCellarEntered||q.sethicMansionWaited))throw Error('Progress does not match Sethic’s cellar.');
 if(data.scene==='egorian_bellflower_barn'&&q.sethicMansionReached)throw Error('The company has already left for Sethic’s mansion.');
 for(const [flag,previous] of [
  ['vyreWishReached','sethicMansionComplete'],['vyreWishGranted','vyreWishReached'],
  ['vyreBobHealed','vyreWishGranted'],['vyreWishComplete','vyreBobHealed']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Vyre Wish sequence: '+flag);
 if(data.scene==='vyre_wish_room'&&!q.vyreWishReached)throw Error('The company has not reached Vyre.');
 if(data.scene==='egorian_sethic_mansion'&&q.vyreWishReached)throw Error('The company has already left for Vyre.');
 const marked=q.barrowStones??0;
 if(q.barrowRoadReached&&!q.vyreWishComplete||marked>0&&!q.barrowRoadReached||
  q.barrowScoutsDefeated&&marked<3||marked>3&&!q.barrowScoutsDefeated||
  q.barrowGroveReached&&marked<6||marked>6&&!q.barrowGroveReached||
  q.barrowGuardiansDefeated&&marked<9||marked>9&&!q.barrowGuardiansDefeated||
  q.barrowTrailComplete&&marked<13)throw Error('Invalid Barrowood pilgrimage sequence.');
 if(data.scene==='barrow_road'&&(!q.barrowRoadReached||q.barrowGroveReached))throw Error('Progress does not match the pilgrim road.');
 if(data.scene==='barrow_grove'&&!q.barrowGroveReached)throw Error('The company has not reached the old grove.');
 if(data.scene==='vyre_wish_room'&&q.barrowRoadReached)throw Error('The company has already left for the Barrowood.');
 for(const [flag,previous] of [
  ['covenantReached','barrowTrailComplete'],['covenantLoyal','covenantReached'],
  ['covenantBattleWon','covenantLoyal'],['covenantSacrificeMade','covenantBattleWon'],
  ['covenantTrueForm','covenantSacrificeMade'],['covenantClaimed','covenantTrueForm'],
  ['covenantQueenArrived','covenantClaimed'],['covenantJasonRaised','covenantQueenArrived'],
  ['covenantComplete','covenantJasonRaised']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Barrowood covenant sequence: '+flag);
 if((marked===14)!==!!q.covenantSacrificeMade)throw Error('The final stone does not match the covenant.');
 if(data.scene==='barrow_covenant'&&!q.covenantReached)throw Error('The company has not reached the final stone.');
 if(data.scene==='barrow_grove'&&q.covenantReached)throw Error('The company has already left the old grove.');
 for(const [flag,previous] of [
  ['menadorBriefed','covenantComplete'],['menadorReached','menadorBriefed'],['menadorComplete','menadorReached']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Menador sequence: '+flag);
 if(data.scene==='menador_pass'&&!q.menadorReached)throw Error('The company has not reached Menador.');
 if(data.scene==='barrow_covenant'&&q.menadorReached)throw Error('The company has already left for Menador.');
 for(const [flag,previous] of [
  ['tathlumOrdersReached','menadorComplete'],['tathlumBriefed','tathlumOrdersReached'],
  ['tathlumNidalReached','tathlumBriefed'],['tathlumThrallMade','tathlumNidalReached'],
  ['tathlumLairReached','tathlumThrallMade'],['tathlumBaitSet','tathlumLairReached']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Tathlum hunt sequence: '+flag);
 if((q.tathlumDuels??0)>0&&!q.tathlumBaitSet||q.tathlumHuntComplete&&q.tathlumDuels!==3)throw Error('Invalid cave-giant duel progress.');
 if(data.scene==='tathlum_orders'&&(!q.tathlumOrdersReached||q.tathlumNidalReached))throw Error('Progress does not match the Tathlum orders.');
 if(data.scene==='nidal_hunt_village'&&(!q.tathlumNidalReached||q.tathlumLairReached))throw Error('Progress does not match the Nidal village.');
 if(data.scene==='nidal_giant_lair'&&!q.tathlumLairReached)throw Error('The company has not reached the giants’ lair.');
 if(data.scene==='menador_pass'&&q.tathlumOrdersReached)throw Error('The company has already returned from Menador.');
 for(const [flag,previous] of [
  ['darkrainReached','tathlumHuntComplete'],['darkrainPact','darkrainReached'],['darkrainSlopeReached','darkrainPact'],
  ['darkrainColdSeen','darkrainSlopeReached'],['darkrainBearWon','darkrainColdSeen'],['darkrainClothed','darkrainBearWon'],
  ['darkrainSkullSeen','darkrainClothed'],['darkrainComplete','darkrainSkullSeen']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Dark Rain sequence: '+flag);
 if(data.scene==='darkrain_pass'&&(!q.darkrainReached||q.darkrainSlopeReached))throw Error('Progress does not match the Pass of Dark Rain.');
 if(data.scene==='darkrain_skull_slope'&&!q.darkrainSlopeReached)throw Error('The company has not climbed to the skull.');
 if(data.scene==='nidal_giant_lair'&&q.darkrainReached)throw Error('The company has already left for Dark Rain.');
 for(const [flag,previous] of [
  ['skadiYardReached','darkrainComplete'],['skadiScouted','skadiYardReached'],['skadiCovered','skadiScouted'],['skadiFeastReached','skadiCovered']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Skadi sequence: '+flag);
 if((q.skadiArguments??0)>0&&!q.skadiFeastReached||q.skadiComplete&&q.skadiArguments!==3)throw Error('Invalid Skadi negotiation progress.');
 if(data.scene==='frost_giant_yard'&&(!q.skadiYardReached||q.skadiFeastReached))throw Error('Progress does not match the Frost Giant settlement.');
 if(data.scene==='frost_giant_hall'&&!q.skadiFeastReached)throw Error('The company has not entered Skadi’s hall.');
 if(data.scene==='darkrain_skull_slope'&&q.skadiYardReached)throw Error('The company has already left for Frost Giant territory.');
 for(const [flag,previous] of [
  ['molthuneReached','skadiComplete'],['molthuneScouted','molthuneReached'],['molthuneBaitSet','molthuneScouted'],
  ['molthuneCoffinLifted','molthuneBaitSet'],['molthuneBreach','molthuneCoffinLifted'],['molthuneEscaped','molthuneBreach'],
  ['molthuneIntroduced','molthuneEscaped'],['molthuneComplete','molthuneIntroduced']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Molthune sequence: '+flag);
 if(data.scene==='molthune_remorhaz_slope'&&(!q.molthuneReached||q.molthuneEscaped))throw Error('Progress does not match the remorhaz slope.');
 if(data.scene==='molthune_waystation'&&!q.molthuneEscaped)throw Error('The company has not reached the wayside.');
 for(const [flag,previous] of [
  ['nidalOperationSought','molthuneComplete'],['dinyarReached','nidalOperationSought'],
  ['dinyarSurveyed','dinyarReached'],['dinyarEntranceFound','dinyarSurveyed'],['dinyarReconComplete','dinyarEntranceFound']
 ])if(q[flag]&&!q[previous])throw Error('Invalid Dinyar scouting sequence: '+flag);
 if(data.scene==='molthune_waystation'&&q.nidalOperationSought)throw Error('The company has already split up.');
 if(data.scene==='nidal_arrival_court'&&(!q.nidalOperationSought||q.dinyarReached))throw Error('Progress does not match the Nidal arrival court.');
 if(data.scene==='dinyar_ridge'&&!q.dinyarReached)throw Error('The company has not reached Citadel Dinyar.');
 if(data.scene==='frost_giant_hall'&&q.molthuneReached)throw Error('The company has already left for Molthune.');
 if(data.scene==='whisperwood_night_camp'&&q.senaraWagonReached)throw Error('The company has already left for Senara.');
 if(data.scene==='senara_fex_villa'&&q.senaraCitadelVisited)throw Error('The company has already left for the Hellknight citadel.');
 if(data.scene==='senara_fex_villa'&&q.senaraSewersEntered&&!q.senaraTalismanRecovered)throw Error('The company has not returned from the Black Daggers’ hideout.');
 if(data.scene==='senara_fex_villa'&&q.senaraPartyStarted&&!q.senaraOrphanageComplete)throw Error('The orphanage team has not returned to the residence.');
 if(data.scene==='kantaria_council'&&q.roadScouted)throw Error('South Road progress does not match the council hall.');
 if(data.scene==='kantaria_council'&&!q.chapter15Complete)throw Error('Premature Kantaria council location.');
 if(!q.kantariaGiftsReceived&&(Object.hasOwn(q,'mosswaterSpent')||Object.hasOwn(q,'dragonHelmSpent')))throw Error('Kantaria gear has not been awarded.');
 for(const[flag,previous]of [["chapter14", "chapter13Complete"], ["supplyBriefed", "chapter14"], ["mineObserved", "supplyBriefed"], ["mineDefendersCleared", "mineObserved"], ["minesSecured", "mineDefendersCleared"], ["cultLocated", "minesSecured"], ["cultDefeated", "cultLocated"], ["cultDestroyed", "cultDefeated"], ["tradeObserved", "cultDestroyed"], ["merchantStruck", "tradeObserved"], ["captainStruck", "merchantStruck"], ["fortObserved", "captainStruck"], ["fortIsolated", "fortObserved"], ["perimeterCleared", "fortIsolated"], ["supplyReported", "perimeterCleared"], ["chapter14Complete", "supplyReported"]])if(q[flag]&&!q[previous])throw Error('Invalid Stranglehold sequence: '+flag);
 if(['supply_caves','kantaria_mines','lamashtu_grotto','kantaria_supply_wharf','kantaria_perimeter','supply_report'].includes(data.scene)&&!q.chapter14)throw Error('Chapter Fourteen state does not match the location.');
 for(const[location,required]of [['kantaria_mines','supplyBriefed'],['lamashtu_grotto','minesSecured'],['kantaria_supply_wharf','cultDestroyed'],['kantaria_perimeter','captainStruck'],['supply_report','perimeterCleared']])if(data.scene===location&&!q[required])throw Error('Premature Chapter Fourteen location: '+location);
 // A chapter flag alone cannot place an imported save beyond its unfinished encounters.
 for(const[location,required]of [['church_approach','churchTrail'],['church_entry','churchBreach'],['church_hall','entryCleared'],['church_sanctuary','hallCleared'],['church_ruins','ghastDestroyed'],['mantis_training','assassinKnowledge'],['church_asmodeus','mantisTraining'],['accuser_home','smearHeard'],['river_disposal','accuserSilenced'],['heist_church','bodyDisposed'],['longacre_armory','heistTip'],['burning_jail','jailReached'],['heist_aftermath','cimriRecovered'],['fort_rest','scoutRetreated'],['fort_assault','fortPrepared'],['fort_search','manticoreDefeated'],['whisperwood_trail','fortSearched'],['fort_patrol','forestMarked'],['court_lower','courtBriefed'],['court_upper','upperReached'],['court_report','courtSecured'],['kantaria_streets','uskwoodBriefed'],['hardship_yard','patrolsThinned'],['hardship_hall','prisonYardCleared'],['uskwood_hideout','zaraFreed']])if(data.scene===location&&!q[required])throw Error('Premature campaign location: '+location);
 // Older checkpoints beyond Corentyn retain the recovery flag, but the blade has left the party.
 if(q.chapter2&&q.scimitar&&(q.chapter2Complete||q.supplied||q.guapoAway||data.scene==='remesiana'))q.scimitarDisposed=true;
 if(q.scimitarDisposed&&(!q.scimitar||!q.chapter2))throw Error('Invalid scimitar disposal.');
 if(q.guapoReturned&&(!q.chapter6||q.guapoAway||!roster.includes('guapo')))throw Error('Invalid El Guapo return state.');
 const progression=data.version===1?Progression.migrate(q):Progression.validate(data.progression,q);
 const hp={},uses={};for(const id of cfg.core){const stat=Progression.stats(cfg.stats[id],id,progression.levels[id]),skill=Inventory.skill(Progression.skill(cfg.special[id],progression.levels[id],id),id,q);hp[id]=integer(data.hp[id]??(id==='reese'?stat.hp:undefined),0,data.version===1?cfg.stats[id].hp:stat.hp,id+' HP');if(data.version===1&&hp[id]>0)hp[id]+=stat.hp-cfg.stats[id].hp;uses[id]=integer(data.uses?.[id]??0,0,data.version===1?cfg.special[id].uses:skill.uses,id+' ability uses');}
 if(q.covenantBattleWon&&!q.covenantJasonRaised)hp.jason=0;
 const out={version:2,inventory:Inventory.validate(data.inventory,q),progression,scene:data.scene,lead:data.lead,quest:q,hp,uses,potions:integer(data.potions??2,0,2,'potions'),mendUses:q.egorianJasonBack?0:integer(data.mendUses??2,0,2,'mending uses')};
 if(data.position!=null){if(!object(data.position)||!Number.isFinite(data.position.x)||!Number.isFinite(data.position.y)||data.position.x<0||data.position.x>=640||data.position.y<0||data.position.y>=400)throw Error('Invalid checkpoint position.');const x=Math.floor(data.position.x/16)*16+8,y=Math.floor(data.position.y/16)*16+8,s=cfg.scenes[data.scene],inside=r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h;if(!s.walk.some(inside)||s.blocks.some(inside))throw Error('Checkpoint position is outside the walkable map.');out.position={x,y};}return out;}
 function decode(text){if(text.length>131072)throw Error('Save file is too large.');let value;try{value=JSON.parse(text);}catch{throw Error('This file is not valid JSON.');}if(value?.format==='hells-bubbies-save'){if(value.formatVersion!==1)throw Error('Unsupported save-file version.');return validate(value.checkpoint);}return validate(value);}
 function encode(checkpoint){return JSON.stringify({format:'hells-bubbies-save',formatVersion:1,exportedAt:new Date().toISOString(),checkpoint:validate(checkpoint)},null,2);}
 function message(text){document.getElementById('save-file-status').textContent=text;}
 function exportSave(){try{if(cfg.safeToCapture())cfg.capture();const checkpoint=cfg.read();if(!checkpoint)throw Error('Start a game and reach a checkpoint before exporting.');const blob=new Blob([encode(checkpoint)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='hells-bubbies-'+checkpoint.scene+'-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Save exported. Import this file on your other device.');}catch(e){message(e.message);}}
 async function preview(file){pending=null;try{if(!cfg.canImport())throw Error('Finish the current conversation or fight before importing.');if(!file) return;if(file.size>131072)throw Error('Save file is too large.');pending=decode(await file.text());if(!cfg.canImport())throw Error('Finish the current conversation or fight before importing.');const roster=pending.quest.activeRoster||(pending.quest.guapoAway?cfg.core.filter(id=>id!=='guapo'&&(id!=='reese'||pending.quest.reeseJoined)):cfg.core.filter(id=>id!=='reese'||pending.quest.reeseJoined));document.getElementById('import-summary').textContent=cfg.names[pending.lead]+' · '+cfg.scenes[pending.scene].name+' · '+roster.length+' companions · Lv '+pending.progression.levels[pending.lead]+' · '+pending.potions+'/2 potions. Importing replaces this browser’s current checkpoint.';document.getElementById('save-import-dialog').showModal();}catch(e){pending=null;message('Import failed: '+e.message);}finally{document.getElementById('save-import-file').value='';}}
 function confirm(){if(!pending)return;try{if(!cfg.canImport())throw Error('The game is busy. Finish the current scene first.');const previous=localStorage.getItem(cfg.key);if(previous)localStorage.setItem(cfg.key+'-before-import',previous);localStorage.setItem(cfg.key,JSON.stringify(pending));document.getElementById('save-import-dialog').close();pending=null;cfg.resume();message('Save imported.'+(previous?' Your previous checkpoint is available with Restore previous save.':''));document.getElementById('save-restore').hidden=!previous;}catch(e){message('Import failed: '+e.message);}}
 function restore(){try{if(!cfg.canImport())throw Error('Finish the current scene before restoring.');const raw=localStorage.getItem(cfg.key+'-before-import');if(!raw)throw Error('No previous checkpoint is available.');const previous=decode(raw),current=localStorage.getItem(cfg.key);if(current)localStorage.setItem(cfg.key+'-before-import',current);localStorage.setItem(cfg.key,JSON.stringify(previous));cfg.resume();message('Previous checkpoint restored.');}catch(e){message(e.message);}}
 function install(config){cfg=config;document.getElementById('save-export').onclick=exportSave;document.getElementById('save-import').onclick=()=>{if(!cfg.canImport())return message('Finish the current conversation or fight before importing.');document.getElementById('save-import-file').click();};document.getElementById('intro-import').onclick=()=>document.getElementById('save-import').click();document.getElementById('save-import-file').onchange=e=>preview(e.target.files[0]);document.getElementById('import-confirm').onclick=confirm;document.getElementById('import-cancel').onclick=()=>{pending=null;document.getElementById('save-import-dialog').close();};document.getElementById('save-restore').onclick=restore;try{document.getElementById('save-restore').hidden=!localStorage.getItem(cfg.key+'-before-import');}catch{}}
 return {install,validate,decode,encode,preview,confirm,restore};
})();
