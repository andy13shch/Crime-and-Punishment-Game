import { Scene, LocationId, Character } from './types';

export const CHARACTERS: Record<string, Character> = {
  sonia: {
    id: 'sonia',
    name: 'Соня Мармеладова',
    description: 'Тихая, самоотверженная девушка, вынужденная пойти на панель ради семьи.',
    color: 'text-blue-400',
  },
  porfiry: {
    id: 'porfiry',
    name: 'Порфирий Петрович',
    description: 'Хитрый и проницательный следователь, играющий в кошки-мышки с преступником.',
    color: 'text-amber-500',
  },
  svidrigailov: {
    id: 'svidrigailov',
    name: 'Свидригайлов',
    description: 'Загадочный и циничный дворянин, воплощение порока и скуки.',
    color: 'text-purple-400',
  },
  luzhin: {
    id: 'luzhin',
    name: 'Лужин',
    description: 'Расчетливый и самовлюбленный делец, жених сестры Раскольникова.',
    color: 'text-emerald-400',
  },
};

export const LOCATIONS: Record<LocationId, { name: string; description: string; color: string }> = {
  room: {
    name: "Каморка Раскольникова",
    description: "Крошечная, тесная каморка под самой крышей, похожая на шкаф или гроб.",
    color: "bg-stone-800",
  },
  pawnshop: {
    name: "Квартира процентщицы",
    description: "Квартира Алены Ивановны, наполненная пылью и запахом старых вещей.",
    color: "bg-amber-900",
  },
  tavern: {
    name: "Трактир",
    description: "Темное, шумное место, пропахшее дешевой водкой и безнадежностью.",
    color: "bg-red-950",
  },
  square: {
    name: "Сенная площадь",
    description: "Шумное, грязное сердце Петербурга, полное торговцев и нищих.",
    color: "bg-slate-700",
  },
  sonia_room: {
    name: "Комната Сони",
    description: "Бедно обставленная комната, но чистая и наполненная странным светом.",
    color: "bg-blue-900",
  },
  police_station: {
    name: "Полицейский участок",
    description: "Холодное, бюрократическое и пугающее место.",
    color: "bg-zinc-800",
  },
  luzhin_hotel: {
    name: "Номера Лужина",
    description: "Дорогие, но безвкусные комнаты, где остановился Петр Петрович.",
    color: "bg-emerald-950",
  },
  svidrigailov_den: {
    name: "Пристанище Свидригайлова",
    description: "Место, где обитает Аркадий Иванович, полное теней и секретов.",
    color: "bg-purple-950",
  },
  bridge: {
    name: "Николаевский мост",
    description: "Холодный ветер с Невы обжигает лицо. Внизу — темная, равнодушная вода.",
    color: "bg-cyan-950",
  },
};

export const INITIAL_SCENES: Record<string, Scene> = {
  start: {
    id: 'start',
    locationId: 'room',
    text: "Вы просыпаетесь в своем 'гробу'. Желтые обои отклеиваются. Голова гудит от голода и ужасной идеи. Вы — Родион Раскольников, бывший студент. На столе лежит письмо от матери: она пишет о приезде сестры Дуни и её женихе, Петре Петровиче Лужине. Мать рада, но вы видите в словах Лужина лишь желание подчинить себе вашу сестру, воспользовавшись её нищетой. В дверь стучит хозяйка, требуя плату.",
    choices: [
      {
        text: "Попытаться объясниться с хозяйкой",
        nextSceneId: 'landlady_confrontation',
      },
      {
        text: "Тихо проскользнуть мимо нее на улицу",
        nextSceneId: 'square_walk',
        impact: { sanity: -5 }
      }
    ]
  },
  landlady_confrontation: {
    id: 'landlady_confrontation',
    locationId: 'room',
    text: "Хозяйка кричит, что вы не платите уже второй месяц. 'Или деньги, или вон из каморки!' У вас в кармане лишь пара копеек. Нужно срочно что-то предпринять.",
    choices: [
      {
        text: "Обещать заплатить завтра (нужно найти деньги)",
        nextSceneId: 'square_generic',
        impact: { sanity: -10 }
      },
      {
        text: "Пойти к Разумихину за работой",
        nextSceneId: 'razumikhin_visit',
      },
      {
        text: "Пойти к процентщице... это единственный быстрый выход",
        nextSceneId: 'pawnshop_rehearsal',
      }
    ]
  },
  room_neutral: {
    id: 'room_neutral',
    locationId: 'room',
    text: "Ваша каморка кажется еще меньше, чем прежде. Хозяйка больше не беспокоит вас, но тишина здесь давит сильнее криков. Желтый свет заходящего солнца падает на пол, напоминая о неумолимом беге времени. Письмо матери всё ещё лежит на столе — немой укор вашему бездействию.",
    choices: [
      {
        text: "Лечь на диван и перечитать письмо матери",
        nextSceneId: 'room_read_letter',
        excludeIfVisited: ['room_read_letter'],
        impact: { sanity: 15, guilt: 5 }
      },
      {
        text: "Сесть за стол и пытаться сосредоточиться на теории",
        nextSceneId: 'room_planning',
        impact: { guilt: 10 }
      },
      {
        text: "Выйти обратно на площадь",
        nextSceneId: 'square_generic'
      }
    ]
  },
  room_read_letter: {
    id: 'room_read_letter',
    locationId: 'room',
    text: "Вы читаете о том, как Дуня готова пожертвовать собой ради вашего будущего, выйдя за Лужина. Мать надеется на вас. Горячие слезы обжигают глаза. Вы чувствуете, как сильно они вас любят, и как далеки вы стали от их чистого мира. Это дает вам силы, но и усиливает муку совести.",
    choices: [
      {
        text: "Вернуться к своим мыслям",
        nextSceneId: 'room_neutral',
      }
    ]
  },
  razumikhin_visit: {
    id: 'razumikhin_visit',
    locationId: 'square',
    text: "Разумихин рад вас видеть, хоть вы и выглядите как мертвец. Он предлагает вам работу — перевод немецких текстов. 'Деньги небольшие, но честные, Родя! Это поможет тебе расплатиться с хозяйкой'.",
    choices: [
      {
        text: "Принять предложение и начать работать",
        nextSceneId: 'honest_work_path',
        impact: { money: 10, sanity: 15, guilt: -10 }
      },
      {
        text: "Отказаться. 'Я не за этим пришел'.",
        nextSceneId: 'square_generic',
        impact: { sanity: -10 }
      }
    ]
  },
  honest_work_path: {
    id: 'honest_work_path',
    locationId: 'room',
    text: "Вы проводите дни за переводами. Голова занята делом, а не 'мыслью'. Разумихин платит вам аванс. 'Вот, Родя, за первую главу!' Вы чувствуете облегчение, имея хоть какие-то деньги на еду и квартиру.",
    choices: [
      {
        text: "Продолжать работать и копить деньги",
        nextSceneId: 'sonia_friendship_start',
        impact: { money: 15, sanity: 10 }
      },
      {
        text: "Бросить все. 'Это копейки, а мне нужно все сразу!'",
        nextSceneId: 'room_planning',
        impact: { sanity: -20, guilt: 10 }
      }
    ]
  },
  sonia_friendship_start: {
    id: 'sonia_friendship_start',
    locationId: 'square',
    text: "Работая, вы случайно встречаете Соню на улице. Она выглядит испуганной. Лужин публично обвиняет ее в краже сторублевого билета.",
    choices: [
      {
        text: "Вступиться за нее. Вы видели, как он сам подложил ей деньги!",
        nextSceneId: 'sonia_friendship',
        impact: { relationship: { sonia: 40, luzhin: -60 }, sanity: 20 }
      },
      {
        text: "Промолчать. Вы боитесь привлечь внимание.",
        nextSceneId: 'sonia_suffering_witness',
        impact: { relationship: { sonia: -20 }, sanity: -15 }
      }
    ]
  },
  sonia_suffering_witness: {
    id: 'sonia_suffering_witness',
    locationId: 'tavern',
    text: "Соню опозорили. Вы сидите в трактире, чувствуя себя соучастником несправедливости. К вам подсаживается Свидригайлов. 'Мир полон грязи, не так ли?'",
    choices: [
      {
        text: "Слушать его циничные речи",
        nextSceneId: 'svidrigailov_meeting',
        impact: { relationship: { svidrigailov: 20 }, sanity: -10 }
      },
      {
        text: "Уйти. Вам противно его присутствие.",
        nextSceneId: 'room_neutral',
        impact: { sanity: 5 }
      }
    ]
  },
  tavern_intro: {
    id: 'tavern_intro',
    locationId: 'tavern',
    text: "К вам подходит человек в поношенном фраке. Это Мармеладов. 'Понимаете ли вы, милостивый государь, что значит, когда уже некуда больше идти?'",
    choices: [
      {
        text: "Выслушать его историю о дочери Соне",
        nextSceneId: 'marmeladov_story',
        impact: { sanity: -10, relationship: { sonia: 5 } }
      },
      {
        text: "Купить чекушку и сидеть в углу",
        nextSceneId: 'tavern_drunk_stupor',
        impact: { money: -1, sanity: -15 },
        requiredMoney: 1
      },
      {
        text: "Игнорировать пьяницу и уйти",
        nextSceneId: 'square_generic',
        impact: { relationship: { sonia: -5 } }
      }
    ]
  },
  tavern_drunk_stupor: {
    id: 'tavern_drunk_stupor',
    locationId: 'tavern',
    text: "Водка обжигает горло, но не дает забвения. Вы слышите смех за соседним столом, который кажется вам издевательским. Голова тяжелеет. Кажется, пора уходить, пока не стало совсем дурно.",
    choices: [
      {
        text: "Выйти на свежий воздух",
        nextSceneId: 'square_generic',
        impact: { sanity: 5 }
      }
    ]
  },
  marmeladov_story: {
    id: 'marmeladov_story',
    locationId: 'tavern',
    text: "Он рассказывает о своей дочери Соне, которая пошла по желтому билету, чтобы спасти семью от голода. 'Она святая', — плачет он. Вы чувствуете странное родство с этим страданием.",
    choices: [
      {
        text: "Отдать ему последние копейки",
        nextSceneId: 'marmeladov_death_witness',
        impact: { money: -2, sanity: 5, relationship: { sonia: 15 } },
        requiredMoney: 2
      },
      {
        text: "Уйти из трактира в отвращении",
        nextSceneId: 'square_generic',
        impact: { sanity: -5 }
      }
    ]
  },
  marmeladov_death_witness: {
    id: 'marmeladov_death_witness',
    locationId: 'square',
    text: "Выходя из трактира, вы видите толпу. Мармеладов попал под лошадей. Он умирает на ваших глазах. Вы помогаете донести его до дома.",
    choices: [
      {
        text: "Отдать все оставшиеся деньги его вдове Катерине Ивановне",
        nextSceneId: 'sonia_meeting_first',
        impact: { money: -5, sanity: 10, relationship: { sonia: 30 } },
        requiredMoney: 5
      },
      {
        text: "Уйти, пока вас не втянули в чужую беду",
        nextSceneId: 'square_generic',
        impact: { sanity: -10 }
      }
    ]
  },
  sonia_meeting_first: {
    id: 'sonia_meeting_first',
    locationId: 'sonia_room',
    text: "Вы впервые видите Соню в ее комнате. Она благодарит вас за помощь отцу. В ее глазах — бездонная печаль и вера.",
    choices: [
      {
        text: "Попросить ее прочитать вам Библию",
        nextSceneId: 'sonia_bible_reading',
        impact: { sanity: 20, relationship: { sonia: 20 } }
      },
      {
        text: "Уйти. Вы недостойны находиться здесь.",
        nextSceneId: 'square_generic',
        impact: { sanity: -5 }
      }
    ]
  },
  sonia_bible_reading: {
    id: 'sonia_bible_reading',
    locationId: 'sonia_room',
    text: "Она читает о воскрешении Лазаря. Вы чувствуете, как ваша 'идея' начинает трещать по швам. Но гордость все еще сильна.",
    choices: [
      {
        text: "Пообещать ей прийти снова",
        nextSceneId: 'redemption_path_start',
        impact: { sanity: 15, relationship: { sonia: 15 } }
      },
      {
        text: "Сказать, что вы больше не придете. 'Мы разные'.",
        nextSceneId: 'room_planning',
        impact: { sanity: -15, guilt: 5 }
      }
    ]
  },
  pawnshop_rehearsal: {
    id: 'pawnshop_rehearsal',
    locationId: 'pawnshop',
    text: "Алена Ивановна подозрительно смотрит на вас. 'Что вам угодно, батюшка?' Вы чувствуете тяжесть топора в своих мыслях. Она всего лишь 'вошь' или человек?",
    choices: [
      {
        text: "Заложить серебряные часы и осмотреть комнату",
        nextSceneId: 'pawn_watch',
        impact: { money: 5, guilt: 5 }
      },
      {
        text: "Быстро уйти, чувствуя тошноту",
        nextSceneId: 'square_generic',
        impact: { sanity: -5 }
      }
    ]
  },
  pawn_watch: {
    id: 'pawn_watch',
    locationId: 'pawnshop',
    text: "Она дает вам гроши. Уходя, вы замечаете ключи на ее поясе. План обретает форму. 'Одна смерть — сто жизней спасены', — шепчете вы.",
    choices: [
      {
        text: "Вернуться в каморку и готовиться",
        nextSceneId: 'room_planning',
        impact: { guilt: 15 }
      },
      {
        text: "Пойти в трактир и пропить эти деньги",
        nextSceneId: 'tavern_intro',
        impact: { sanity: -10, money: -5 }
      }
    ]
  },
  square_walk: {
    id: 'square_walk',
    locationId: 'square',
    text: "Сенная площадь встречает вас невыносимой духотой и вонью. Толпы людей, крики торговцев, пьяные выкрики. В голове всё еще звучат слова из письма матери: Петр Петрович Лужин, 'деловой человек', предложил руку вашей сестре Дуне. Вы знаете правду — он хочет взять бесприданницу, чтобы она всю жизнь была ему обязана. Вон он, стоит неподалеку у лавки, поправляя свой безупречный воротничок среди этой грязи.",
    choices: [
      {
        text: "Подойти и высказать Лужину всё в лицо",
        nextSceneId: 'luzhin_confrontation',
        impact: { relationship: { luzhin: -40 }, sanity: 5 }
      },
      {
        text: "Игнорировать его и прислушаться к разговорам в толпе",
        nextSceneId: 'overhear_lizaveta',
        impact: { guilt: 10, sanity: -5 }
      },
      {
        text: "Просто бродить по площади",
        nextSceneId: 'square_generic',
        impact: { sanity: -10 }
      }
    ]
  },
  square_generic: {
    id: 'square_generic',
    locationId: 'square',
    text: "Вы на Сенной. Духота, пыль и тот особенный петербургский запах, от которого кружится голова. Здесь легко затеряться, но трудно убежать от самого себя.",
    choices: [
      {
        text: "Вернуться в каморку",
        nextSceneId: 'aftermath_guilt',
        onlyIfVisited: ['the_crime_execution']
      },
      {
        text: "Вернуться в каморку",
        nextSceneId: 'room_planning',
        onlyIfVisited: ['overhear_lizaveta'],
        excludeIfVisited: ['the_crime_execution']
      },
      {
        text: "Вернуться в каморку",
        nextSceneId: 'room_neutral',
        excludeIfVisited: ['overhear_lizaveta', 'the_crime_execution']
      },
      {
        text: "Пойти в трактир",
        nextSceneId: 'tavern_intro',
      },
      {
        text: "Пойти к Разумихину",
        nextSceneId: 'razumikhin_visit',
      },
      {
        text: "Прислушаться к разговорам в толпе",
        nextSceneId: 'overhear_lizaveta',
        excludeIfVisited: ['overhear_lizaveta', 'the_crime_execution'],
        impact: { guilt: 10, sanity: -5 }
      }
    ]
  },
  overhear_lizaveta: {
    id: 'overhear_lizaveta',
    locationId: 'square',
    text: "Лизавета уходит. Вы стоите как громом пораженный. 'Завтра, в семь часов, одна...' — стучит в висках. Это само провидение указывает вам путь. Судьба ли это или дьявол?",
    choices: [
      {
        text: "Вернуться в каморку и обдумать это",
        nextSceneId: 'room_planning',
        impact: { guilt: 10 }
      },
      {
        text: "Пойти в трактир, чтобы заглушить мысли",
        nextSceneId: 'tavern_intro',
        impact: { sanity: -10 }
      },
      {
        text: "Продолжить блуждать по площади",
        nextSceneId: 'square_generic',
      }
    ]
  },
  luzhin_confrontation: {
    id: 'luzhin_confrontation',
    locationId: 'square',
    text: "Вы подходите к Лужину. Он смотрит на вас свысока, как на насекомое. Вы кричите ему, что знаете его истинные намерения — купить Дуню за её бедность. Лужин возмущен вашей дерзостью. Он угрожает лишить вашу семью всякой поддержки, если вы не замолчите.",
    choices: [
      {
        text: "Прогнать его. 'Нам не нужны твои деньги!'",
        nextSceneId: 'luzhin_breakup',
        impact: { relationship: { luzhin: -100 }, sanity: 20, money: -20 }
      },
      {
        text: "Сдержаться ради матери и сестры",
        nextSceneId: 'square_generic',
        impact: { relationship: { luzhin: 10 }, sanity: -20, guilt: 10 }
      }
    ]
  },
  luzhin_breakup: {
    id: 'luzhin_breakup',
    locationId: 'room',
    text: "Лужин ушел. Семья спасена от него, но теперь вы совсем без средств. Дуня смотрит на вас с надеждой и страхом. 'Что же теперь будет, Родя?' У вас в кармане ни гроша.",
    choices: [
      {
        text: "Пообещать, что вы найдете выход (честный)",
        nextSceneId: 'razumikhin_visit',
        impact: { sanity: 10 }
      },
      {
        text: "Решиться на преступление ради них. Это единственный способ получить много денег сразу.",
        nextSceneId: 'room_planning',
        impact: { guilt: 20 }
      }
    ]
  },
  gossip_scene: {
    id: 'gossip_scene',
    locationId: 'square',
    text: "Вы встречаете Лужина. Он рассуждает о 'целом кафтане' и о том, что нужно любить прежде всего самого себя. Его эгоизм поражает вас.",
    choices: [
      {
        text: "Согласиться с его теорией выгоды",
        nextSceneId: 'square_generic',
        impact: { relationship: { luzhin: 20 }, guilt: 10, sanity: -5 }
      },
      {
        text: "Оспорить его взгляды",
        nextSceneId: 'square_generic',
        impact: { relationship: { luzhin: -20 }, sanity: 5 }
      }
    ]
  },
  room_planning: {
    id: 'room_planning',
    locationId: 'room',
    text: "Вы лежите на диване. Идея пустила корни. Вы — 'необыкновенный' человек, как Наполеон. Завтра в семь. Нужно подготовить петлю для топора под пальто и сам топор.",
    choices: [
      {
        text: "Подготовить петлю и ждать часа",
        nextSceneId: 'preparation_fever',
        impact: { guilt: 20, sanity: -10 }
      },
      {
        text: "Нет. Я не убийца. Я найду другой путь.",
        nextSceneId: 'redemption_path_start',
        impact: { guilt: -10, sanity: 10 }
      }
    ]
  },
  preparation_fever: {
    id: 'preparation_fever',
    locationId: 'room',
    text: "Бьет семь часов. Вы проспали! В ужасе вы вскакиваете. Нужно незаметно взять топор в дворницкой. Сердце колотится так, что, кажется, его слышно на всей улице.",
    choices: [
      {
        text: "Рискнуть и прокрасться в дворницкую за топором",
        nextSceneId: 'the_crime_start',
        impact: { sanity: -20, guilt: 10 }
      },
      {
        text: "Бросить все. Слишком поздно, я не готов.",
        nextSceneId: 'room_neutral',
        impact: { sanity: 10, guilt: -5 }
      }
    ]
  },
  the_crime_start: {
    id: 'the_crime_start',
    locationId: 'pawnshop',
    text: "Вы у двери. Звонок дребезжит. Алена Ивановна открывает, подозрительно глядя через щелку. Вы протягиваете ей 'заклад' — плотно завернутую дощечку.",
    choices: [
      {
        text: "Ударить топором, пока она развязывает узел",
        nextSceneId: 'the_crime_execution',
        impact: { guilt: 50, sanity: -30 }
      },
      {
        text: "Рука не поднимается. Убежать прочь.",
        nextSceneId: 'square_walk',
        impact: { sanity: -10, guilt: -10 }
      }
    ]
  },
  the_crime_execution: {
    id: 'the_crime_execution',
    locationId: 'pawnshop',
    text: "Она падает. Мертва. Вы хватаете ключи. Руки дрожат, вы не можете попасть в замок комода. Вдруг... скрип двери. Входит Лизавета. Она видит все.",
    choices: [
      {
        text: "Убить и Лизавету. Свидетелей быть не должно.",
        nextSceneId: 'the_crime_lizaveta',
        impact: { guilt: 40, sanity: -40 }
      },
      {
        text: "Замереть в ужасе. Может, она не заметит?",
        nextSceneId: 'the_crime_caught',
        impact: { sanity: -50 }
      }
    ]
  },
  the_crime_lizaveta: {
    id: 'the_crime_lizaveta',
    locationId: 'pawnshop',
    text: "Второй удар. Кровь невинной Лизаветы на ваших руках. Вы в оцепенении. Слышны шаги на лестнице. Кто-то идет к квартире!",
    choices: [
      {
        text: "Запереться изнутри и затаить дыхание",
        nextSceneId: 'the_crime_escape',
        impact: { sanity: -30 }
      },
      {
        text: "Выбежать на лестницу, пока не поздно",
        nextSceneId: 'the_crime_caught',
        impact: { sanity: -40 }
      }
    ]
  },
  the_crime_escape: {
    id: 'the_crime_escape',
    locationId: 'square',
    text: "Люди за дверью ушли звать дворника. Вы выскальзываете из квартиры, прячетесь в пустой комнате этажом ниже, пока они пробегают мимо. Вы на улице. Вы свободны... или прокляты?",
    choices: [
      {
        text: "Спрятать награбленное под камень",
        nextSceneId: 'aftermath_guilt',
        impact: { guilt: 30, sanity: -40 }
      },
      {
        text: "Оставить деньги себе и начать новую жизнь",
        nextSceneId: 'cynical_success_ending',
        impact: { guilt: 50, sanity: -50 }
      }
    ]
  },
  the_crime_caught: {
    id: 'the_crime_caught',
    locationId: 'police_station',
    text: "Вас поймали на месте преступления. Толпа линчует вас взглядами. Вы признаетесь во всем сразу, не в силах вынести тяжести содеянного.",
    choices: [
      {
        text: "Принять каторгу как избавление",
        ending: {
          title: "Позорный конец",
          description: "Вы не Наполеон. Вы просто убийца, пойманный как жалкий воришка. Ваша теория рассыпалась в прах в первую же минуту.",
          image: "https://picsum.photos/seed/prison_bars/800/600?grayscale",
          isGood: false
        }
      }
    ]
  },
  aftermath_guilt: {
    id: 'aftermath_guilt',
    locationId: 'room',
    text: "Дни проходят в лихорадке. Каждый стук в дверь — удар сердца. Порфирий Петрович, следователь, наблюдает за вами. Он ведет психологическую игру.",
    choices: [
      {
        text: "Навестить Соню, чтобы найти утешение",
        nextSceneId: 'sonia_confession_choice',
        impact: { sanity: 10, relationship: { sonia: 10 } }
      },
      {
        text: "Пойти в трактир 'Хрустальный дворец'",
        nextSceneId: 'tavern_intro',
        impact: { sanity: -10 }
      },
      {
        text: "Пойти на мост и смотреть на Неву",
        nextSceneId: 'bridge_scene',
        impact: { sanity: -20 }
      },
      {
        text: "Сдаться безумию",
        nextSceneId: 'madness_ending_scene',
        impact: { sanity: -100 }
      },
      {
        text: "Попытаться перехитрить Порфирия в участке",
        nextSceneId: 'police_confrontation',
        excludeIfVisited: ['porfiry_final_offer'],
        impact: { sanity: -20, relationship: { porfiry: 5 } }
      },
      {
        text: "Вспомнить последнее предложение Порфирия",
        nextSceneId: 'porfiry_final_offer',
        onlyIfVisited: ['porfiry_final_offer'],
        impact: { sanity: -5 }
      },
      {
        text: "Навестить Свидригайлова. Он что-то знает.",
        nextSceneId: 'svidrigailov_meeting',
        impact: { relationship: { svidrigailov: 10 }, sanity: -10 }
      }
    ]
  },
  bridge_scene: {
    id: 'bridge_scene',
    locationId: 'bridge',
    text: "Вы стоите у перил. Вода кажется такой спокойной. 'А что, если это и есть выход?' — шепчет голос в голове. Все страдания, все теории, вся кровь — всё может исчезнуть в один миг.",
    choices: [
      {
        text: "Сделать последний шаг (Концовка: Нева)",
        ending: {
          title: "Тьма Невы",
          description: "Вы выбрали путь Свидригайлова, не вынеся тяжести собственного 'права'. Нева приняла вашу тайну навсегда. О вас забудут, как о дурном сне.",
          image: "https://picsum.photos/seed/dark_river/800/600?grayscale&blur=1",
          isGood: false
        }
      },
      {
        text: "Отойти от края. Я должен донести свой крест.",
        nextSceneId: 'aftermath_guilt',
        impact: { sanity: 10, guilt: 5 }
      }
    ]
  },
  zametov_meeting: {
    id: 'zametov_meeting',
    locationId: 'tavern',
    text: "Вы сидите в трактире. К вам подсаживается Заметов, письмоводитель из участка. Вы начинаете говорить о недавнем убийстве. 'А что, если это я убил?' — вырывается у вас с безумной улыбкой.",
    choices: [
      {
        text: "Продолжать играть с огнем, описывая, как бы вы это сделали",
        nextSceneId: 'aftermath_guilt',
        impact: { sanity: -30, guilt: 20, relationship: { porfiry: 10 } }
      },
      {
        text: "Опомниться и перевести все в шутку",
        nextSceneId: 'aftermath_guilt',
        impact: { sanity: -5, relationship: { porfiry: -5 } }
      }
    ]
  },
  police_confrontation: {
    id: 'police_confrontation',
    locationId: 'police_station',
    characterId: 'porfiry',
    text: "Порфирий Петрович встречает вас с необычайной любезностью. 'А я вас ждал, Родион Романович! Читал вашу статью... Про необыкновенных людей. Помните? Тем всё позволено?' Он пристально смотрит вам в глаза, улыбаясь одними губами.",
    choices: [
      {
        text: "Защищать свою теорию: 'Да, есть люди, имеющие право переступить'.",
        nextSceneId: 'porfiry_second_round',
        impact: { relationship: { porfiry: 20 }, sanity: -10, guilt: 10 }
      },
      {
        text: "Смутиться и попытаться уйти: 'Я плохо себя чувствую'.",
        nextSceneId: 'aftermath_guilt',
        impact: { relationship: { porfiry: -10 }, sanity: -20 }
      }
    ]
  },
  porfiry_second_round: {
    id: 'porfiry_second_round',
    locationId: 'police_station',
    characterId: 'porfiry',
    text: "Порфирий начинает ходить по кабинету. 'Так-с, так-с... А что, если этот необыкновенный человек... ну, скажем, убил старушку? И думает, что он Наполеон? А на самом деле он просто... больной студент?'",
    choices: [
      {
        text: "Вспылить: 'Вы меня подозреваете? Где улики?!'",
        nextSceneId: 'porfiry_final_offer',
        impact: { sanity: -30, relationship: { porfiry: 10 } }
      },
      {
        text: "Сохранять холодное спокойствие: 'Ваши фантазии меня не касаются'.",
        nextSceneId: 'porfiry_final_offer',
        impact: { sanity: -10, relationship: { porfiry: 30 } }
      }
    ]
  },
  porfiry_final_offer: {
    id: 'porfiry_final_offer',
    locationId: 'police_station',
    characterId: 'porfiry',
    text: "Следователь внезапно серьезнеет. 'Родион Романович, я ведь всё знаю. Улик нет, но вы сами себя выдаете. Придите с повинной. Я вам срок скощу, честное слово. Станьте снова человеком, а не вошью. Идите к Софье Семеновне, она вас ждет'.",
    choices: [
      {
        text: "Уйти в лихорадке. 'Мне нужно время...'",
        nextSceneId: 'aftermath_guilt',
        impact: { sanity: -20 }
      },
      {
        text: "Искать Соню. Порфирий прав, она — спасение.",
        nextSceneId: 'sonia_confession_choice',
        impact: { sanity: 10, relationship: { sonia: 15 } }
      },
      {
        text: "Признаться прямо здесь и сейчас.",
        nextSceneId: 'confession_path',
        impact: { guilt: -30 }
      }
    ]
  },
  sonia_confession_choice: {
    id: 'sonia_confession_choice',
    locationId: 'sonia_room',
    text: "Соня читает вам Библию. Воскрешение Лазаря. Она смотрит на вас с такой жалостью. 'Что вы, что вы над собой сделали!' — шепчет она.",
    choices: [
      {
        text: "Признаться ей в преступлении",
        nextSceneId: 'confession_path',
        impact: { guilt: -20, sanity: 30, relationship: { sonia: 50 } }
      },
      {
        text: "Скрыть свою тайну и уйти",
        nextSceneId: 'svidrigailov_meeting',
        impact: { guilt: 20, sanity: -30, relationship: { sonia: -10 } }
      }
    ]
  },
  svidrigailov_meeting: {
    id: 'svidrigailov_meeting',
    locationId: 'svidrigailov_den',
    text: "Свидригайлов подслушал ваш разговор. 'Мы одного поля ягоды, Родион Романович', — говорит он с усмешкой. Он предлагает вам деньги и побег. А еще он упоминает вашу сестру Дуню.",
    choices: [
      {
        text: "Принять его циничную дружбу",
        nextSceneId: 'svidrigailov_ending',
        impact: { relationship: { svidrigailov: 40 }, guilt: 20, sanity: -20 }
      },
      {
        text: "Отвергнуть его и уйти к Порфирию",
        nextSceneId: 'confession_path',
        impact: { relationship: { svidrigailov: -30 }, sanity: 10 }
      },
      {
        text: "Угрожать ему, чтобы он оставил Дуню в покое",
        nextSceneId: 'svidrigailov_threat',
        impact: { relationship: { svidrigailov: -50 }, sanity: 5 }
      }
    ]
  },
  svidrigailov_threat: {
    id: 'svidrigailov_threat',
    locationId: 'svidrigailov_den',
    text: "Свидригайлов смеется. 'Вы забавны, Родион Романович'. Но в его глазах видна усталость. Он отпускает вас. Вскоре вы узнаете, что он покончил с собой.",
    choices: [
      {
        text: "Это знак. Пора идти в полицию.",
        nextSceneId: 'confession_path',
        impact: { sanity: 10 }
      },
      {
        text: "Бежать из города",
        nextSceneId: 'escape_ending',
        impact: { guilt: 50, sanity: -50 }
      }
    ]
  },
  confession_path: {
    id: 'confession_path',
    locationId: 'police_station',
    text: "Вы входите в участок. Порфирий ждет вас. 'Я знал, что вы придете'. Соня стоит на улице, молясь за вашу душу. Вы чувствуете, как огромная тяжесть спадает с плеч... Вы признаетесь во всем.",
    choices: [
      {
        text: "Смиренно принять приговор",
        nextSceneId: 'siberia_epilogue',
        impact: { guilt: -50, sanity: 30 }
      }
    ]
  },
  siberia_epilogue: {
    id: 'siberia_epilogue',
    locationId: 'square',
    text: "Прошли месяцы. Сибирь. Бесконечные степи и холод. Но здесь, на берегах широкой реки, вы наконец нашли покой. Соня последовала за вами, и её любовь стала вашим воскрешением. Старая жизнь умерла, началась новая — жизнь, которую нужно ещё заслужить великим будущим подвигом.",
    choices: [
      {
        text: "Войти в новую жизнь (Концовка: Воскрешение)",
        ending: {
          title: "Воскрешение",
          description: "Через страдание и безграничную любовь Сони вы нашли путь обратно к людям. Теория о 'праве на кровь' забыта как страшный сон. Вы снова человек.",
          image: "https://picsum.photos/seed/sunrise_hope/800/600?sepia",
          isGood: true
        }
      }
    ]
  },
  madness_ending_scene: {
    id: 'madness_ending_scene',
    locationId: 'room',
    text: "Стены начинают шептать. Лица старухи и Лизаветы проступают на желтых обоях. Вы смеетесь, потому что поняли: вы и есть Наполеон, а весь мир — это ваша каморка.",
    choices: [
      {
        text: "Уйти в мир грез (Концовка: Желтый дом)",
        ending: {
          title: "Желтый дом",
          description: "Безумие. Вы окончательно потеряли связь с реальностью. Теперь вы живете в мире, где вы — великий император, а санитары — ваши верные маршалы. Страдание окончено, но человека больше нет.",
          image: "https://picsum.photos/seed/mad_eyes/800/600?blur=3",
          isGood: false
        }
      }
    ]
  },
  cynical_success_ending: {
    id: 'cynical_success_ending',
    locationId: 'luzhin_hotel',
    text: "Вы использовали украденные деньги, чтобы подняться. Вы теперь уважаемый человек, делец, как Лужин. Прошлое кажется лишь дурным сном, но иногда, глядя в зеркало, вы видите там чудовище.",
    choices: [
      {
        text: "Принять свою новую суть (Концовка: Новый Лужин)",
        ending: {
          title: "Новый Лужин",
          description: "Циничный триумф. Вы доказали свою теорию — вы переступили и выжили. Вы богаты и успешны, но ваша душа мертва. Вы стали тем, кого презирали больше всего.",
          image: "https://picsum.photos/seed/gold_coins/800/600?contrast=2",
          isGood: false
        }
      }
    ]
  },
  svidrigailov_ending: {
    id: 'svidrigailov_ending',
    locationId: 'svidrigailov_den',
    text: "Вы выбираете путь Свидригайлова. Мораль — это лишь оковы. Но пустота внутри становится невыносимой.",
    choices: [
      {
        text: "Уехать в Америку... или 'в вечность'",
        ending: {
          title: "Пустота",
          description: "Вы избежали каторги, но потеряли душу. Ваша жизнь превращается в бесконечную скуку и призраков прошлого.",
          image: "https://picsum.photos/seed/void/800/600?grayscale",
          isGood: false
        }
      }
    ]
  },
  escape_ending: {
    id: 'escape_ending',
    locationId: 'square',
    text: "Вы бежите из Петербурга. Но куда бы вы ни пошли, вы берете себя с собой. Лицо Лизаветы преследует вас в каждом встречном.",
    choices: [
      {
        text: "Жить в вечном страхе (Конец)",
        ending: {
          title: "Вечный бег",
          description: "Свобода оказалась страшнее тюрьмы. Вы живете под чужим именем, вздрагивая от каждого шороха. Ваша совесть — ваш единственный судья.",
          image: "https://picsum.photos/seed/running_shadow/800/600?grayscale",
          isGood: false
        }
      }
    ]
  },
  redemption_path_start: {
    id: 'redemption_path_start',
    locationId: 'square',
    text: "Вы решили не совершать преступление. Вам легче, но голод остается. Вы видите, как Соню оскорбляет Лужин, обвиняя ее в краже.",
    choices: [
      {
        text: "Заступиться за нее и разоблачить Лужина",
        nextSceneId: 'sonia_friendship',
        impact: { relationship: { sonia: 30, luzhin: -50 }, sanity: 15 }
      },
      {
        text: "Пройти мимо, у вас своих проблем хватает",
        nextSceneId: 'square_generic',
        impact: { sanity: -5, relationship: { sonia: -20 } }
      }
    ]
  },
  porfiry_sanity_rescue: {
    id: 'porfiry_sanity_rescue',
    locationId: 'police_station',
    characterId: 'porfiry',
    text: "Вы открываете глаза. Вместо желтых обоев — серые стены полицейской конторы. Над вами склонился Порфирий Петрович. 'Что же вы так, Родион Романович? В обморок прямо в коридоре упали... А я как раз хотел с вами об одной статье поговорить. Про необыкновенных людей, помните? Тех, кому всё позволено?'",
    choices: [
      {
        text: "Попытаться прийти в себя и ответить",
        nextSceneId: 'porfiry_second_round',
        impact: { sanity: 20 }
      },
      {
        text: "Смотреть на него в безумном оцепенении",
        nextSceneId: 'madness_ending_scene',
        impact: { guilt: 10 }
      }
    ]
  },
  sonia_friendship: {
    id: 'sonia_friendship',
    locationId: 'sonia_room',
    text: "Соня благодарна вам. 'Вы добрый человек, Родион Романович'. Вы понимаете, что величие не в убийстве, а в сострадании.",
    choices: [
      {
        text: "Начать новую жизнь (Концовка Человека)",
        ending: {
          title: "Путь Человека",
          description: "Вы не стали убийцей. Жизнь будет трудной, но ваша совесть чиста. Вы нашли друга в лице Сони и смысл в помощи другим.",
          image: "https://picsum.photos/seed/kindness/800/600?sepia",
          isGood: true
        }
      }
    ]
  }
};
