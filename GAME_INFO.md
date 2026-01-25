# Plane Game 🛩️

A side-scrolling plane shooter game built with Phaser 3. Dodge enemies, shoot missiles, and survive as long as possible!

## 🎮 Game Features

### Implemented
- **Player Controls**: Smooth up/down movement with arrow keys
- **Smooth Rotation**: Plane tilts dynamically based on movement direction
- **Scrolling Background**: Parallax scrolling with seamless terrain wrapping
- **Speed Control**: Hold right arrow to boost speed
- **Shooting System**: Fire missiles with spacebar (cooldown enabled)
- **Enemy Spawning**: Enemies spawn from the right with random diagonal movement
- **Combat System**: 
  - Destroy enemies with missiles (+10 points each)
  - Collision with enemies reduces health (-25 HP)
  - Collision with terrain reduces overs game!
- **UI System**: 
  - Real-time score display
  - Health tracking (100 HP total)
  - Game Over detection when health reaches 0

## 🕹️ Controls

| Key | Action |
|-----|--------|
| ↑ Arrow Up | Move plane up |
| ↓ Arrow Down | Move plane down |
| → Arrow Right | Boost speed |
| ← Arrow Left | Move left |
| Spacebar | Fire missile |

## 🛠️ Technologies Used

- **Phaser 3** - HTML5 game framework
- **JavaScript** - Game logic
- **Arcade Physics** - Collision and movement system

## 📁 Project Structure

```
Limitless_jet/
├── Plane.html          # Main HTML file
├── Plane.js            # Game logic and mechanics
├── assets/             # Game assets
│   ├── skys.png        # Background image
│   ├── trees.png       # Terrain texture
│   ├── plane.png       # Player sprite
│   ├── enemy.png       # Enemy sprite
│   └── missile.png     # Bullet sprite
└── GAME_INFO.md           # This file
```

##  Current Game Stats

- **Starting Health**: 100 HP
- **Enemy Collision Damage**: -25 HP
- **Terrain Collision Damage**: -25 HP
- **Points per Enemy**: +10
- **Enemy Spawn Rate**: Every 3 seconds
- **Missile Cooldown**: 500ms

## 📝 Development Progress

### Phase 1:  Setup & Basic Movement
- Player plane with physics
- Up/down movement controls

### Phase 2:  Scrolling Background
- Seamless terrain scrolling
- Parallax background effect

### Phase 3: Speed Control
- Variable scroll speed
- Right arrow boost mechanic

### Phase 4: Player Shooting
- Missile firing system
- Bullet physics and cleanup

### Phase 5:  UI - Score & Health
- Score tracking and display
- Health system with UI

### Phase 6:  Enemy Spawning
- Random enemy generation
- Diagonal movement patterns

### Phase 7: Bullet vs Enemy Collision
- Destroy enemies with bullets
- Score increment on hits

### Phase 8:  Enemy vs Player Collision
- Health reduction on collision
- Game over detection

### Phase 9:  Enemy Missiles 
- Enemies shoot projectiles
- Missile collision damage

### Phase 10:  Difficulty Scaling
- Progressive speed increases
- Higher spawn rates with score

### Phase 11:  Game Over Screen 
- Game over UI with final score
- Restart functionality

### Phase 12:  Polish & Effects 
- Explosions and visual effects
- Sound effects and music
- Additional features



## 📜 License

This project is open source and available for educational purposes.

## 👤 Author

Created as a learning project with Phaser 3

---

**Status**: Active Development 🚀
**Last Updated**: January 23, 2026
