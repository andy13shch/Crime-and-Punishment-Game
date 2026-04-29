import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Skull, 
  Coins, 
  Brain, 
  MapPin, 
  MessageSquare, 
  ArrowRight, 
  RotateCcw,
  Users,
  ChevronRight,
  Eye,
  Info,
  AlertTriangle,
  Bell
} from 'lucide-react';
import { GameState, Choice, LocationId, Ending } from './types';
import { LOCATIONS, INITIAL_SCENES, CHARACTERS } from './constants';
import { cn } from './lib/utils';

const INITIAL_STATE: GameState = {
  guilt: 0,
  sanity: 100,
  money: 2,
  currentLocation: 'room',
  currentSceneId: 'start',
  relationships: {
    sonia: 0,
    porfiry: 0,
    svidrigailov: 0,
    luzhin: 0,
  },
  inventory: [],
  day: 1,
  suspicion: 0,
  visitCounts: {},
  showStartScreen: true,
  murderCommitted: false,
  sanityRescueHappened: false,
  isGameOver: false,
  ending: null,
};

const HUB_SCENES = ['square_generic', 'start', 'square_walk', 'aftermath_guilt', 'room_neutral', 'room_planning'];

interface Notification {
  id: string;
  message: string;
  type: 'suspicion' | 'guilt' | 'sanity' | 'money';
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [showReputation, setShowReputation] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: Notification['type']) => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const currentScene = useMemo(() => {
    if (!gameState.currentSceneId) return null;
    return INITIAL_SCENES[gameState.currentSceneId] || null;
  }, [gameState.currentSceneId]);

  // Atmosphere calculation
  const atmosphere = useMemo(() => {
    const { guilt, sanity } = gameState;
    
    let filter = '';
    let overlayColor = 'rgba(0,0,0,0)';
    let moodText = 'Мрачно';
    let vignetteIntensity = 0.3;

    if (guilt > 70) {
      filter = `grayscale(0.6) contrast(1.3) brightness(0.6) blur(${guilt / 150}px)`;
      overlayColor = 'rgba(60, 0, 0, 0.4)';
      moodText = 'Кошмар';
      vignetteIntensity = 0.9;
    } else if (guilt > 40) {
      filter = 'grayscale(0.4) brightness(0.8)';
      overlayColor = 'rgba(30, 30, 30, 0.3)';
      moodText = 'Гнетуще';
      vignetteIntensity = 0.6;
    } else if (sanity < 30) {
      filter = 'sepia(0.6) hue-rotate(320deg) contrast(1.2)';
      overlayColor = 'rgba(100, 50, 0, 0.2)';
      moodText = 'Лихорадка';
      vignetteIntensity = 0.7;
    } else if (guilt < 10 && sanity > 80) {
      moodText = 'Ясно';
      vignetteIntensity = 0.2;
    }

    return { filter, overlayColor, moodText, vignetteIntensity };
  }, [gameState.guilt, gameState.sanity]);

  const handleChoice = (choice: Choice) => {
    if (choice.action) {
      choice.action();
    }

    setGameState(prev => {
      const newState = { ...prev };
      
      // Track visits to the destination scene
      if (choice.nextSceneId) {
        newState.visitCounts = {
          ...prev.visitCounts,
          [choice.nextSceneId]: (prev.visitCounts[choice.nextSceneId] || 0) + 1
        };

        // Increase suspicion if visiting same scene too often (repetitive behavior)
        // EXCLUDE hub scenes (leaving a place shouldn't be suspicious)
        const isHub = HUB_SCENES.includes(choice.nextSceneId);
        if (!isHub && newState.visitCounts[choice.nextSceneId] >= 3) {
          const suspicionGain = 15;
          newState.suspicion = Math.min(100, newState.suspicion + suspicionGain);
          addNotification("Ваше поведение кажется подозрительным...", "suspicion");
        }

        // Additional notifications for status changes
        if (choice.impact) {
          if (choice.impact.sanity && choice.impact.sanity < 0) addNotification("Рассудок туманится...", "sanity");
          if (choice.impact.guilt && choice.impact.guilt > 0) addNotification("Совесть терзает вас...", "guilt");
          if (choice.impact.money && choice.impact.money < 0) addNotification("Вы тратите последние гроши...", "money");
        }

        // Mark murder as committed if entering execution scenes
        if (choice.nextSceneId === 'the_crime_execution' || choice.nextSceneId === 'the_crime_lizaveta') {
          newState.murderCommitted = true;
        }
      }

      if (choice.impact) {
        if (choice.impact.guilt !== undefined) newState.guilt = Math.min(100, Math.max(0, newState.guilt + choice.impact.guilt));
        if (choice.impact.sanity !== undefined) newState.sanity = Math.min(100, Math.max(0, newState.sanity + choice.impact.sanity));
        
        // Prevent negative money
        if (choice.impact.money !== undefined) {
          newState.money = Math.max(0, newState.money + choice.impact.money);
        }
        
        if (choice.impact.relationship) {
          Object.entries(choice.impact.relationship).forEach(([charId, value]) => {
            newState.relationships[charId] = (newState.relationships[charId] || 0) + value;
          });
        }
      }

      if (choice.nextSceneId) {
        const nextScene = INITIAL_SCENES[choice.nextSceneId];
        if (nextScene) {
          newState.currentLocation = nextScene.locationId;
          newState.currentSceneId = choice.nextSceneId;
        } else {
          newState.currentSceneId = choice.nextSceneId;
        }
      }

      if (choice.ending) {
        newState.isGameOver = true;
        newState.ending = choice.ending;
      }

      // Check for Game Over / Endings
      if (newState.sanity <= 0) {
        if (!newState.sanityRescueHappened && newState.currentSceneId !== 'porfiry_sanity_rescue' && newState.currentSceneId !== 'madness_ending_scene') {
          newState.currentLocation = 'police_station';
          newState.currentSceneId = 'porfiry_sanity_rescue';
          newState.sanity = 20; // Give more sanity back to continue
          newState.sanityRescueHappened = true;
          addNotification("Вы теряете сознание... Тьма сгущается.", "sanity");
        } else if (newState.currentSceneId !== 'porfiry_sanity_rescue') {
          // If rescue already happened or in madness scene, end game
          newState.isGameOver = true;
          newState.ending = {
            title: "Безумие",
            description: "Вы окончательно потеряли рассудок в лихорадке Петербурга. Желтые стены каморки сомкнулись над вами навсегда. Даже Порфирий Петрович не смог вытащить вас из этой бездны.",
            image: "https://picsum.photos/seed/madness/800/600?grayscale&blur=2",
            isGood: false
          };
        }
      }

      if (newState.suspicion >= 100) {
        newState.isGameOver = true;
        if (newState.murderCommitted) {
          newState.ending = {
            title: "Арест",
            description: "Ваше странное поведение после преступления привлекло слишком много внимания. Полиция нашла достаточно улик, и Порфирий Петрович лично пришел за вами, предъявив обвинение в убийстве.",
            image: "https://picsum.photos/seed/prison/800/600?grayscale",
            isGood: false
          };
        } else {
          newState.ending = {
            title: "Задержание",
            description: "Вы вели себя настолько подозрительно, метаясь по городу в горячке, что квартальный надзиратель задержал вас для выяснения личности. Вас сочли опасным для общества сумасшедшим и отправили в лечебницу еще до того, как вы совершили задуманное.",
            image: "https://picsum.photos/seed/asylum/800/600?grayscale&blur=2",
            isGood: false
          };
        }
      }

      return newState;
    });
  };

  const resetGame = () => {
    setGameState(INITIAL_STATE);
  };

  if (gameState.isGameOver && gameState.ending) {
    return (
      <div className="min-h-dvh bg-stone-950 flex items-center justify-center p-4 md:p-8 text-center font-serif overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl w-full my-auto bg-stone-900/40 border border-stone-800/50 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img 
              src={gameState.ending.image} 
              alt={gameState.ending.title}
              className="w-full h-full object-cover grayscale opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-0 right-0">
               <h2 className={cn(
                 "text-3xl md:text-5xl font-bold uppercase tracking-widest",
                 gameState.ending.isGood ? "text-blue-400" : "text-red-900"
               )}>
                 {gameState.ending.title}
               </h2>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <p className="text-lg md:text-xl text-stone-300 leading-relaxed italic">
              "{gameState.ending.description}"
            </p>
            
            <div className="pt-4">
              <button 
                onClick={resetGame}
                className="px-10 py-4 bg-stone-900 border border-stone-800 hover:bg-stone-800 hover:border-stone-700 transition-all rounded-full text-stone-300 flex items-center gap-3 mx-auto group"
              >
                <RotateCcw className="w-5 h-5 group-hover:rotate-[-45deg] transition-transform" />
                Начать заново
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState.showStartScreen) {
    return (
      <div className="min-h-dvh bg-stone-950 flex items-start md:items-center justify-center p-3 md:p-8 font-serif text-stone-200 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full my-auto bg-stone-900/60 border border-stone-800/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col max-h-none md:max-h-[calc(100dvh-4rem)]"
        >
          <div className="relative h-40 sm:h-48 md:h-64 overflow-hidden">
            <img 
              src="https://picsum.photos/seed/petersburg/1200/400?grayscale&blur=2" 
              alt="Saint Petersburg"
              className="w-full h-full object-cover opacity-40 saturate-0"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent" />
            <div className="absolute left-5 right-5 bottom-5 md:left-8 md:right-auto md:bottom-8">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-tighter text-stone-100">
                Преступление и Наказание
              </h1>
              <p className="text-stone-400 italic text-sm md:text-base mt-2">Визуальная новелла по мотивам Ф. М. Достоевского</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-stone-100">
                <Info className="w-6 h-6 text-blue-400" />
                О игре
              </h2>
              <p className="text-stone-300 leading-relaxed">
                Вы — Родион Раскольников. Петербург 1860-х годов душит вас нищетой и жарой. 
                В вашей голове созрела теория: люди делятся на «обыкновенных», обязанных жить в повиновении, 
                и «необыкновенных», имеющих право на преступление ради великих целей.
              </p>
              <p className="text-stone-300 leading-relaxed">
                Каждое ваше решение меняет вашу судьбу. Сможете ли вы переступить через кровь 
                и остаться человеком? Или теория поглотит вас?
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-stone-100">
                <Brain className="w-6 h-6 text-stone-400" />
                Механики
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-red-950/50 rounded-lg"><Skull className="w-5 h-5 text-red-500" /></div>
                  <div>
                    <h3 className="font-bold text-red-200">Вина</h3>
                    <p className="text-xs text-stone-400">Растет с каждым действием против совести. Высокая вина вызывает лихорадку и галлюцинации.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-blue-950/50 rounded-lg"><Brain className="w-5 h-5 text-blue-400" /></div>
                  <div>
                    <h3 className="font-bold text-blue-200">Рассудок</h3>
                    <p className="text-xs text-stone-400">Ваше ментальное здоровье. Если оно упадет до нуля, вы потеряете связь с реальностью. Безумие — это конец.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-orange-950/50 rounded-lg"><Eye className="w-5 h-5 text-orange-500" /></div>
                  <div>
                    <h3 className="font-bold text-orange-200">Подозрение</h3>
                    <p className="text-xs text-stone-400">Внимание полиции. Повторяющиеся, странные или подозрительные действия увеличивают этот показатель. Арест неизбежен при 100%.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-yellow-950/50 rounded-lg"><Coins className="w-5 h-5 text-yellow-600" /></div>
                  <div>
                    <h3 className="font-bold text-yellow-200">Деньги</h3>
                    <p className="text-xs text-stone-400">Ваш единственный ресурс. Без денег невозможно выжить, но цена их получения может быть слишком высока.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 p-5 md:p-8 border-t border-stone-800 bg-stone-950/90 backdrop-blur-md flex justify-center">
            <button 
              onClick={() => setGameState(prev => ({ ...prev, showStartScreen: false }))}
              className="w-full sm:w-auto justify-center px-6 sm:px-12 py-4 sm:py-5 bg-stone-100 text-stone-950 rounded-full font-bold uppercase tracking-widest hover:bg-stone-200 transition-all flex items-center gap-3 active:scale-95"
            >
              Начать путь
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="h-dvh bg-stone-950 text-stone-200 font-serif selection:bg-red-900 selection:text-white overflow-hidden flex flex-col relative"
    >
      {/* Atmospheric Background Layer */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-1000"
        style={{ 
          filter: atmosphere.filter,
          backgroundColor: atmosphere.overlayColor,
          boxShadow: `inset 0 0 ${atmosphere.vignetteIntensity * 250}px rgba(0,0,0,${atmosphere.vignetteIntensity})`
        }}
      />

      {/* Header / HUD */}
      <header className="sticky top-0 shrink-0 p-3 md:p-4 border-b border-stone-800 bg-stone-900/80 backdrop-blur-md flex justify-between items-center gap-3 z-20 relative">
        <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-8 grow">
          <div className="hidden lg:block pr-4 border-r border-stone-800">
            <h2 className="text-xs uppercase tracking-[0.2em] text-stone-500 font-bold">Раскольников</h2>
          </div>
          
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 md:gap-6">
            <div className="flex items-center gap-2" title="Вина">
            <Skull className={cn("w-4 h-4 md:w-5 md:h-5 transition-colors", gameState.guilt > 50 ? "text-red-600" : "text-stone-500")} />
            <div className="w-16 md:w-24 h-1.5 md:h-2 bg-stone-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-red-600" 
                initial={{ width: 0 }}
                animate={{ width: `${gameState.guilt}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2" title="Подозрение">
            <Eye className={cn("w-4 h-4 md:w-5 md:h-5 transition-colors", gameState.suspicion > 70 ? "text-orange-600 animate-pulse" : "text-stone-500")} />
            <div className="w-16 md:w-24 h-1.5 md:h-2 bg-stone-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-orange-600" 
                initial={{ width: 0 }}
                animate={{ width: `${gameState.suspicion}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2" title="Рассудок">
            <Brain className={cn("w-4 h-4 md:w-5 md:h-5 transition-colors", gameState.sanity < 30 ? "text-amber-500" : "text-blue-400")} />
            <div className="w-16 md:w-24 h-1.5 md:h-2 bg-stone-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-400" 
                initial={{ width: '100%' }}
                animate={{ width: `${gameState.sanity}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2" title="Деньги">
            <Coins className={cn("w-4 h-4 md:w-5 md:h-5", gameState.money === 0 ? "text-red-500 animate-pulse" : "text-yellow-600")} />
            <span className={cn("font-mono text-xs md:text-sm", gameState.money === 0 && "text-red-500")}>
              {gameState.money} коп.
            </span>
            {gameState.money === 0 && (
              <span className="text-[8px] bg-red-900/50 text-red-200 px-1 rounded hidden sm:inline">Нужда</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={resetGame}
            className="p-2 hover:bg-stone-800 rounded-full transition-colors"
            title="Перезапуск"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        </div>

        {/* Floating Notifications */}
        <div className="fixed bottom-24 right-4 md:right-8 z-50 flex flex-col gap-2 pointer-events-none">
          <AnimatePresence>
            {notifications.map(notif => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                className={cn(
                  "px-4 py-3 rounded-lg border shadow-lg flex items-center gap-3 backdrop-blur-md text-xs font-bold uppercase tracking-wider",
                  notif.type === 'suspicion' && "bg-orange-950/40 border-orange-500/50 text-orange-200",
                  notif.type === 'guilt' && "bg-red-950/40 border-red-500/50 text-red-100",
                  notif.type === 'sanity' && "bg-blue-950/40 border-blue-500/50 text-blue-100",
                  notif.type === 'money' && "bg-stone-900/40 border-stone-500/50 text-stone-200"
                )}
              >
                {notif.type === 'suspicion' && <Eye className="w-4 h-4 text-orange-500" />}
                {notif.type === 'guilt' && <Skull className="w-4 h-4 text-red-500" />}
                {notif.type === 'sanity' && <Brain className="w-4 h-4 text-blue-500" />}
                {notif.type === 'money' && <Coins className="w-4 h-4 text-yellow-600" />}
                {notif.message}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Narrative Area */}
      <main className="flex-1 relative flex flex-col items-center justify-start md:justify-center p-3 md:p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentScene && (
            <motion.div
              key={gameState.currentSceneId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-4xl my-0 md:my-auto bg-stone-900/40 backdrop-blur-md border border-stone-800 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              {/* Scene Visual / Location Info */}
              <div className={cn(
                "w-full md:w-1/3 p-5 md:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-800",
                LOCATIONS[gameState.currentLocation].color.replace('bg-', 'bg-opacity-20 bg-')
              )}>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-stone-500 text-[10px] uppercase tracking-widest">
                    <MapPin className="w-3 h-3" />
                    <span>Локация</span>
                  </div>
                  <h2 className="text-2xl font-bold text-stone-100">
                    {LOCATIONS[gameState.currentLocation].name}
                  </h2>
                  <p className="text-sm text-stone-400 italic leading-relaxed">
                    {LOCATIONS[gameState.currentLocation].description}
                  </p>
                </div>

                <div className="pt-8 hidden md:block">
                  <div className="text-[10px] uppercase tracking-widest text-stone-600 mb-2">Атмосфера</div>
                  <div className="text-sm font-medium text-stone-500">{atmosphere.moodText}</div>
                </div>
              </div>

              {/* Narrative Content */}
              <div className="flex-1 p-5 md:p-10 flex flex-col">
                <div className="flex-1 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-stone-500 text-[10px] uppercase tracking-widest">
                      <MessageSquare className="w-3 h-3" />
                      <span>{currentScene.characterId ? CHARACTERS[currentScene.characterId].name : 'Мысли'}</span>
                    </div>
                    <p className="text-lg md:text-xl leading-relaxed text-stone-200 first-letter:text-3xl first-letter:font-bold first-letter:mr-1">
                      {currentScene.text}
                      {gameState.money === 0 && (
                        <span className="block mt-4 text-sm text-red-900/80 italic">
                          * Вы чувствуете сосущую пустоту в желудке. Без денег Петербург кажется еще более враждебным.
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {currentScene.choices
                      .filter(choice => {
                        let visible = true;
                        if (choice.excludeIfVisited) {
                          visible = visible && !choice.excludeIfVisited.some(id => (gameState.visitCounts[id] || 0) > 0);
                        }
                        if (choice.onlyIfVisited) {
                          visible = visible && choice.onlyIfVisited.every(id => (gameState.visitCounts[id] || 0) > 0);
                        }
                        return visible;
                      })
                      .map((choice, idx) => {
                      const isReputationLocked = choice.requiredReputation && 
                        (gameState.relationships[choice.requiredReputation.charId] || 0) < choice.requiredReputation.min;
                      
                      const isMoneyLocked = choice.requiredMoney !== undefined && gameState.money < choice.requiredMoney;
                      
                      // Repetition logic
                      const visitCount = choice.nextSceneId ? (gameState.visitCounts[choice.nextSceneId] || 0) : 0;
                      const isHub = choice.nextSceneId ? HUB_SCENES.includes(choice.nextSceneId) : false;
                      const isStrange = !isHub && visitCount >= 2;
                      const isHighlySuspicious = !isHub && visitCount >= 4;
                      // Block if it's been done too many times AND there are other choices to prevent softlock
                      const isBlockedBySuspicion = isHighlySuspicious && currentScene.choices.length > 1;

                      const isLocked = isReputationLocked || isMoneyLocked || isBlockedBySuspicion;

                      return (
                        <button
                          key={idx}
                          disabled={isLocked}
                          onClick={() => handleChoice(choice)}
                          className={cn(
                            "group flex items-center justify-between p-4 border transition-all text-left rounded-xl",
                            isLocked 
                              ? "bg-stone-900/20 border-stone-900 text-stone-700 cursor-not-allowed" 
                              : isStrange
                                ? "bg-orange-950/20 border-orange-900/40 hover:bg-orange-800/20"
                                : "bg-stone-900/50 border-stone-800 hover:border-red-900/50 hover:bg-stone-800/80"
                          )}
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-sm md:text-base transition-colors",
                                isLocked ? "text-stone-700" : isStrange ? "text-orange-200" : "text-stone-300 group-hover:text-white"
                              )}>
                                {choice.text}
                              </span>
                              {isStrange && !isLocked && (
                                <span className="text-[9px] bg-orange-900/50 text-orange-200 px-1.5 py-0.5 rounded border border-orange-800/50 flex items-center gap-1">
                                  <Eye className="w-2.5 h-2.5" />
                                  Странно
                                </span>
                              )}
                            </div>
                            
                            {isBlockedBySuspicion && (
                              <span className="text-[10px] text-stone-600 italic mt-1 font-sans">
                                Вы чувствуете, что это привлечет слишком много внимания...
                              </span>
                            )}
                            
                            {isReputationLocked && (
                              <span className="text-[10px] text-red-900 uppercase mt-1">
                                Требуется репутация: {CHARACTERS[choice.requiredReputation!.charId].name} ({choice.requiredReputation!.min})
                              </span>
                            )}
                            {isMoneyLocked && (
                              <span className="text-[10px] text-yellow-900 uppercase mt-1">
                                Недостаточно денег (нужно {choice.requiredMoney} коп.)
                              </span>
                            )}
                          </div>
                          {!isLocked && (
                            <ChevronRight className={cn(
                              "w-4 h-4 transition-all",
                              isStrange ? "text-orange-900 group-hover:translate-x-1" : "text-stone-600 group-hover:text-red-600 group-hover:translate-x-1"
                            )} />
                          )}
                          {isBlockedBySuspicion && <Eye className="w-4 h-4 text-stone-900" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <footer className="mt-8 pt-6 border-t border-stone-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] uppercase tracking-widest text-stone-600">
                  <span>Санкт-Петербург, 1866</span>
                  <span>День {gameState.day}</span>
                </footer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
