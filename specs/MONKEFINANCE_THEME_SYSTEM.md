# MonkeFinance Theme System Specification

Version: 1.0  
Purpose: Define complete visual identity, color palette, and theme rules for MonkeFinance gamified trading platform.

This document defines:

- Color palette
- Usage rules
- UI hierarchy
- Emotional design goals
- Theme consistency rules

Cursor should use this as the source of truth when implementing UI.

---

# 1. Theme Philosophy

MonkeFinance is a:

Trading Skill Game

NOT a brokerage.

The theme must feel like:

- Game
- Modern
- Playful
- Premium
- Competitive

NOT:

- Banking
- Corporate
- Traditional finance

The theme identity is:

"Neon Jungle Trading Arena"

---

# 2. Core Theme Structure

Theme consists of:

Dark Base  
Neon Highlights  
Banana Reward Color  
Monke Mascot Integration  

---

# 3. Base Background Colors

These form the foundation.

Primary Background:

#0F1116

Usage:

Main app background

---

Secondary Background:

#151922

Usage:

Secondary sections

---

Card Background:

#1C2230

Usage:

Cards
Panels
Containers

---

Elevated Card Background:

#222938

Usage:

Hover states
Focused cards

---

# 4. Primary Brand Color

Neon Profit Green:

#00FF9C

This is the PRIMARY brand color.

Usage:

Primary buttons

Active elements

Highlights

Profit values

Selected navigation items

Focus states

---

Hover State:

#00E68A

---

# 5. Banana Reward Color (XP System)

Banana Yellow:

#FFD84D

This is the MOST IMPORTANT identity color.

Represents:

XP
Bananas
Level ups
Rewards

Usage:

XP indicators

Progress bars

Level indicators

Reward text

Achievement highlights

DO NOT use Banana Yellow for normal UI.

Only for progression and rewards.

---

# 6. Accent Color

Energy Orange:

#FF9F1C

Usage:

Streak indicators

Important highlights

CTA hover effects

Notification accents

---

# 7. Loss / Danger Color

Loss Red:

#FF4D6D

Usage:

Loss values

Error states

Stop loss hit indicators

Negative feedback

Use sparingly.

---

# 8. Premium / Elite Color

Elite Purple:

#7C5CFF

Usage:

Elite ranks

Premium features

Special achievements

High-level players

---

# 9. Text Colors

Primary Text:

#E6EDF3

Usage:

Main content

---

Secondary Text:

#9BA3AF

Usage:

Descriptions

Labels

---

Muted Text:

#6B7280

Usage:

Disabled text

Hints

---

Inverse Text:

#0F1116

Usage:

Text on bright buttons

---

# 10. Border and Divider Colors

Primary Border:

#2A3244

Secondary Border:

#222938

Divider:

#1C2230

---

# 11. Chart Colors

Up Candle:

#00FF9C

Down Candle:

#FF4D6D

Wick:

#9BA3AF

Chart Grid:

#1C2230

Chart Background:

#0F1116

---

# 12. Button System

Primary Button:

Background:

#00FF9C

Text:

#0F1116

Hover:

#00E68A

---

Secondary Button:

Background:

transparent

Border:

#00FF9C

Text:

#00FF9C

Hover Background:

rgba(0,255,156,0.1)

---

Danger Button:

Background:

#FF4D6D

Text:

#FFFFFF

---

# 13. Progress Bar Colors

Background:

#222938

Progress Fill:

#FFD84D

Elite Progress:

#7C5CFF

---

# 14. Navigation Colors

Active Item:

#00FF9C

Inactive Item:

#9BA3AF

Hover Item:

#E6EDF3

Navigation Background:

#151922

---

# 15. Mascot Integration Colors

Monke Fur:

#8B5E3C

Banana:

#FFD84D

₹ Eye Glow:

#00FF9C

Shadow:

#0F1116

---

# 16. Gradient System

Primary Gradient:

linear-gradient(135deg, #00FF9C, #FFD84D)

Usage:

Level progress

Premium highlights

---

Elite Gradient:

linear-gradient(135deg, #7C5CFF, #00FF9C)

Usage:

Elite badges

Special achievements

---

Background Accent Gradient:

linear-gradient(180deg, #0F1116, #151922)

---

# 17. Shadow System

Primary Shadow:

rgba(0, 0, 0, 0.5)

Glow Shadow (Green):

rgba(0, 255, 156, 0.3)

Glow Shadow (Banana):

rgba(255, 216, 77, 0.3)

---

# 18. Hover Behavior

Interactive elements must:

Lighten background

Add glow

Use green highlight

Example:

box-shadow: 0 0 10px rgba(0,255,156,0.3)

---

# 19. Focus States

Focused elements use:

Border color:

#00FF9C

Glow effect:

rgba(0,255,156,0.3)

---

# 20. Theme Usage Rules

Rule 1:

80% Dark base

Rule 2:

15% Green highlights

Rule 3:

5% Banana yellow

Rule 4:

Never overuse Banana color

Rule 5:

Green represents skill

Rule 6:

Yellow represents reward

Rule 7:

Red represents mistakes

---

# 21. Emotional Design Mapping

Green:

Success

Yellow:

Reward

Purple:

Elite

Orange:

Energy

Red:

Loss

Dark:

Focus

---

# 22. Overall Emotional Goal

User should feel:

In a game

Not in banking software

The theme should feel:

Modern

Alive

Premium

Skill-based

Fun

---

# End of Theme Specification
