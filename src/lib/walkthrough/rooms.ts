// The one-bedroom apartment in public/models/apartment.glb. Rectangles are the
// Blender plan in meters (x right, y away from the camera); keep them in sync
// with ROOMS in scripts/blender/apartment.py. Each room's floor mesh is named
// floor_<id> in the model.

export type RoomId = 'entry' | 'kitchen' | 'living' | 'bathroom' | 'bedroom';

export type Room = {
  id: RoomId;
  slug: string;
  name: string;
  /** What to photograph, in the order a tenant walks the room. */
  checklist: string;
  /** Plan rectangle: [x0, y0, x1, y1] in meters. */
  rect: [number, number, number, number];
};

// In the order a tenant walks through the front door.
export const ROOMS: Room[] = [
  {
    id: 'entry',
    slug: 'entry',
    name: 'Entry',
    checklist: 'The front door and its lock, the frame, the floor by the door, and any closet.',
    rect: [7, 4, 10, 7],
  },
  {
    id: 'kitchen',
    slug: 'kitchen',
    name: 'Kitchen',
    checklist:
      'Counters and the stove top, inside the oven and fridge, under the sink, and the cabinet doors.',
    rect: [6, 0, 10, 4],
  },
  {
    id: 'living',
    slug: 'living-room',
    name: 'Living room',
    checklist: 'Each wall, the floor or carpet, windows and blinds, outlets, and the ceiling.',
    rect: [0, 0, 6, 4],
  },
  {
    id: 'bathroom',
    slug: 'bathroom',
    name: 'Bathroom',
    checklist: 'The tub and its caulk, the toilet, the sink and mirror, tiles, and the fan.',
    rect: [4.5, 4, 7, 7],
  },
  {
    id: 'bedroom',
    slug: 'bedroom',
    name: 'Bedroom',
    checklist: 'Walls, the floor, the closet door and track, windows and screens.',
    rect: [0, 4, 4.5, 7],
  },
];

export function roomBySlug(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug);
}

export function roomById(id: string): Room | undefined {
  return ROOMS.find((r) => r.id === id);
}

/** Room center in three.js space (Y up; Blender y becomes -z). */
export function roomCenter(room: Room, height = 1): [number, number, number] {
  const [x0, y0, x1, y1] = room.rect;
  return [(x0 + x1) / 2, height, -(y0 + y1) / 2];
}

/** Where the i-th pin stands in a room: a sunflower spiral around the center. */
export function pinSpot(room: Room, i: number): [number, number, number] {
  const [x0, y0, x1, y1] = room.rect;
  const [cx, , cz] = roomCenter(room);
  const reach = Math.min(x1 - x0, y1 - y0) * 0.32;
  const r = reach * Math.sqrt((i + 0.5) / 8);
  const a = i * 2.39996;
  return [cx + Math.cos(a) * r, 0, cz + Math.sin(a) * r];
}

/** The room after this one in walking order, or undefined at the end. */
export function nextRoom(room: Room): Room | undefined {
  return ROOMS[ROOMS.indexOf(room) + 1];
}
