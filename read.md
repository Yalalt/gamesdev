## Subway Surfers вэб тоглоом — Төслийн товч танилцуулга

#### Бүтэц (Structure) — 21 JS файл + HTML/CSS

Scenes (6 — Үзэгдэл/Дэлгэцүүд)

BootScene — Бүх тоглоомын объектын текстур (placeholder график) үүсгэх

NameInputScene — Тоглогчийн нэр оруулах HTML давхарга, localStorage-д хадгална

MenuScene — Гарчиг, тоглох товч, шилдэг 10 тоглогчийн самбар (leaderboard), дуу асаах/унтраах, нэр солих

GameScene — Үндсэн тоглоом: параллакс дэвсгэр, замууд, тоглогч, саад тотгор, зоос, power-up-ууд

GameOverScene — Онооны задаргаа, шинэ рекорд анимейшн, leaderboard, дахин тоглох/меню товч

PauseScene — Түр зогсоох дэлгэц (resume/quit сонголттой)

#### Game Logic (8 — Тоглоомын логик)

GameState — Төв төлөв (оноо, хурд, зай, power-up төлөв)

PlayerController — 3 эгнээний хөдөлгөөн, үсрэх, гулгах (физиктэй)

ObstacleManager — 4 төрлийн саад (галт тэрэг, нам хаалт, өндөр хаалт, туннель) + объектын сан (object pooling)

CollectibleManager — Зоосны хэв маяг (шугам, нум, тархмал) + 4 төрлийн power-up

CollisionHandler — AABB мөргөлдөөн шалгах, саадад тохирсон дүрэмтэй (нам хаалтыг үсэрч давна, өндөр хаалтын доогуур гулгана)

StageManager — 5 хүндрэлийн шат (хурд, спаун, саад нэмэгдэх прогресс)

ScoreManager — Зай + зоосоор оноо тооцох, localStorage-д хадгалах

PowerUpEffects — Magnet, Jetpack, 2x Multiplier, Shield (таймертай)


#### Input & UI (4 — Удирдлага ба интерфейс)

InputManager — Гар (Arrow + WASD) + swipe дохио таних

TouchControls — Гар утсанд зориулсан дэлгэцэн дээрх D-pad

HUD — Оноо, зоос, шат, зай, power-up индикатор, pause товч

StorageManager — localStorage-д зориулсан wrapper (оноо, тохиргоо хадгална)


#### Тоглох заавар (How to Play)
```js
npx serve .

http://localhost:3000

```

#### Commanduuud

Desktop: Arrow товчнууд эсвэл WASD

Mobile: Swipe дохио эсвэл дэлгэцэн дээр товшчих

P / ESC: Pause


---

npx нь Node.js-тэй хамт ирдэг тул заавал танд Node.js суусан байх.

node.js web https://nodejs.org/en хуудаснаас суулгана.
**Macbook Pro** Apple silicon process тул **ARM 64** буюу **Apple silicon** гэснийг суулгана шүү.




The Subway Surfers web game has been fully implemented. Here's a summary of what was created:                                                                                                    
                                                                                                                                                                                                   
  Бүтэц (Structure) — 21 JS файл + HTML/CSS                                                                                                                                                        
                                                                                                                                                                                                   
  Scenes (6)                                                                                                                                                                                       
                                                                                                                                                                                                   
  - BootScene — Texture generation (placeholder graphics for all game objects)                                                                                                                     
  - NameInputScene — HTML overlay for player name input, saved to localStorage                                                                                                                     
  - MenuScene — Title, play button, top 10 leaderboard, sound toggle, name change                                                                                                                  
  - GameScene — Core gameplay with parallax background, tracks, player, obstacles, coins, power-ups                                                                                                
  - GameOverScene — Score breakdown, new record animation, leaderboard, retry/menu buttons                                                                                                         
  - PauseScene — Pause overlay with resume/quit options

  Game Logic (8)

  - GameState — Central state (score, speed, distance, power-up flags)
  - PlayerController — 3-lane movement, jump, slide with physics
  - ObstacleManager — 4 obstacle types (train, low barrier, high barrier, tunnel) with object pooling
  - CollectibleManager — Coin patterns (line, arc, scattered) + 4 power-up types
  - CollisionHandler — AABB collision with obstacle-specific rules (jump over low, slide under high)
  - StageManager — 5 difficulty stages with speed/spawn/obstacle progression
  - ScoreManager — Distance + coin scoring with localStorage persistence
  - PowerUpEffects — Magnet, Jetpack, 2x Multiplier, Shield with timers

  Input & UI (4)

  - InputManager — Keyboard (arrows + WASD) + swipe gesture detection
  - TouchControls — On-screen D-pad for mobile
  - HUD — Score, coins, stage, distance, power-up indicators, pause button
  - StorageManager — localStorage wrapper for scores and settings

  Тоглох (How to Play)

  npx serve .
  Then open http://localhost:3000 in browser.
  - Desktop: Arrow keys or WASD
  - Mobile: Swipe gestures or on-screen buttons
  - P / ESC: Pause