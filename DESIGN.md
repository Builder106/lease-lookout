# LeaseLookout design: the floor plan

Planning notes for the move-in walkthrough redesign. Scope for #BuildHybridAI (due 2026-11-30, 5 pm ET): `/walkthrough` becomes the floor plan, and the landing page links into it. The rest of the site keeps its current look until after the submission.

## Brand

LeaseLookout is the renter's side in a fight landlords usually win by paperwork. The brand is built the way the Gen Z brands that work are built (Gumroad, Cash App, Poppi, Partiful): one color owned everywhere, ink and paper for everything else, one recurring object, and a direct voice.

**One color: Lookout Pink `#FF2E88`.** Pink always means *the renter's side*: the logo's second word, every primary button, recorded rooms, the renter's evidence, the stat band, the one highlighted word in a headline. It never marks the landlord or a problem by itself.

| Role | Light | Dark | Meaning |
| --- | --- | --- | --- |
| Lookout Pink | `#FF2E88` | `#FF4D9E` | the renter's side |
| Pink tint | `#FFD3E7` | `#4A1830` | a recorded room, a highlighted row |
| Ink | `#0E0E0E` | `#F4F4F4` | text, borders, hard shadows, and the landlord's side |
| Paper | `#FFFFFF` | `#0E0E0E` | the ground |
| Concrete | `#EDEDED` | `#1C1C1C` | quiet surfaces, bare rooms |
| Graphite | `#5E5E5E` | `#A8A8A8` | secondary text |

No blue, no yellow, no cream. The landlord is drawn in ink and grey, the color of a property manager's spreadsheet; the renter's record turns pink as it fills in.

**Type, three jobs:**
- *Bricolage Grotesque Extra Bold*, capitals: headlines and room names. (Big Shoulders Stencil was tried and dropped: its cut letters were hard to read.)
- *Bricolage Grotesque*: everything people read.
- *JetBrains Mono*: citations, dates and stamps, the receipt voice.

**Shape:** square corners, 2 px ink lines, hard 4 px ink shadows that fall down and right, nothing soft or blurred.

**Object: the pin.** An ink stem with a head. Pink heads are the renter's evidence; ink heads are the landlord's claims. It appears in the apartment and as the brand's mark of proof.

**3D:** the apartment is a white card model (white walls, grey furniture, ink edges), like an architect's study model, so the only color in it is the renter's pink.

**Voice:** short, direct, on your side. "Landlords have spreadsheets. You have receipts." No legalese, no slang for its own sake.

## Brief

- **Subject:** tenants getting a security deposit back. First users are off-campus student renters in Connecticut and Massachusetts.
- **Audience:** a renter standing in an empty apartment on move-in day, phone in hand, often without Wi-Fi. Second audience: hackathon judges watching a three-minute video.
- **Job:** make recording every room feel quick and complete, so the tenant has dated evidence when the landlord sends deductions months later.
- **Assets:** none supplied. The apartment is a generic one-bedroom modelled in Blender; it is a stand-in for the tenant's own place and says so.
- **Assumption:** one layout (one-bedroom) for the hackathon. Studio and two-bedroom layouts come later.

## Concepts considered

| Concept | Territory | Structure | Verdict |
| --- | --- | --- | --- |
| Condition report | the form landlords hand out | document | rejected by the owner: documents are boring |
| Floor plan | the apartment itself | map or plan | **chosen** |
| The clock | the 21 or 30 day deadline | sequence | says nothing about move-in; becomes a detail inside the floor plan later |

## Concept card

```
Idea:        Your apartment as a small model; every photo you take pins to the room it shows.
Metaphor:    a dollhouse cutaway of the tenant's own place.
Signature:   tap a room and the camera settles into it; add a photo and a pin drops onto the
             room, stamped with where the AI ran (this device or the cloud). Recorded rooms
             turn from bare grey to blue.
Emotion:     "this is my place, and it is covered."
Motion verb: settle, like furniture set down: a short drop with a small give at the end.
Screenshot:  the ink-outlined one-bedroom from above, blue rooms, pink-free, pins standing on
             the kitchen counter and the bathroom tile.
Structure:   the page is the apartment. /walkthrough is the whole place at rest;
             /walkthrough/<room> is the same place with that room opened (camera in, its
             record beside it). One unit is a room and its photos. Rooms in the model replace
             the navbar.
Escape hatch: a plain list of rooms with counts, always under the model, every room a link.
```

Move-out (next milestone) uses the same model: each landlord charge pins to the room it names, in pink, beside the blue move-in evidence.

## System

**Palette** (no cream; the floor is the only warm surface and it is a material, not UI):

| Role | Light | Dark |
| --- | --- | --- |
| ground | `#eef0f4` | `#0f1013` |
| ink and wall caps | `#11110d` | `#f3f4f6` |
| muted text | `#555b68` | `#a3a9b6` |
| recorded room | `#2b4bf2` | `#5b7cff` |
| charge pin (move-out) | `#ff2e88` | `#ff3d95` |
| bare room floor | `#d9dce3` | `#2a2d35` |

**Type:** Bricolage Grotesque Extra Bold capitals for room names, tags and the headline, regular Bricolage for body, JetBrains Mono for stamps and timestamps.

**Shape:** square corners, 2 px ink borders (the brand's zine line), the same ink line on every edge of the model.

**Motion:** one ease (`power3.out` for settling, `back.out(1.2)` only for a pin landing). Camera moves 0.9 s, panels 0.5 s, pins 0.45 s, stagger 40 ms. Idle: the model turns a few degrees back and forth on the GSAP ticker, paused off screen and under reduced motion.

## Structure plan

```
DESKTOP (1440)                                   PHONE (390)
+--------------------------------------------+   +--------------------+
| LeaseLookout        Move-in record  2 of 5 |   | LeaseLookout  2/5  |
|                                            |   | [  model, 4:3     ]|
|   [ isometric apartment, ink lines ]  +---+|   | [ rooms as tags   ]|
|   [ room tags float over each room ]  |rec||   +--------------------+
|   [ pins stand on recorded spots   ]  |ord||   | Kitchen        2 > |
|                                       |   ||   | Living room    0 > |
|   Rooms: Kitchen 2, Living 0, ...     +---+|   | Bedroom        1 > |
+--------------------------------------------+   | ...  (escape hatch)|
 /walkthrough/kitchen: camera settles on the     +--------------------+
 kitchen, the record panel slides in at right    /walkthrough/kitchen: model
 with its photos and the add-photo control.      shrinks to a strip, the room
 Back closes it (history.back).                  sheet takes the screen.
```

Legal and footer links stay in the existing site footer below the room list.

## 3D route

Blender (interior with recognisable furniture). Modelled from a Python script on the Mac, exported as GLB with one named floor per room (`floor_<room>`) and one anchor empty per room (`anchor_<room>`). Flat Principled colors, no textures. Optimized with gltf-transform on the build host. Poster captured from the live canvas so the swap does not jump.

## Genericness check

- Skeleton: the page is the apartment, rooms are the navigation, and the list is the escape hatch. Not navbar, hero, sections, footer.
- Changed from the default: no feature cards, no numbered tags, no all-caps headline on this page, no cream ground.
