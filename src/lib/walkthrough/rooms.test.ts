import { describe, expect, it } from 'vitest';

import { nextRoom, pinSpot, roomById, roomBySlug, roomCenter, ROOMS } from './rooms';

describe('rooms', () => {
  it('tiles the 10 m by 7 m plan without overlaps', () => {
    const area = ROOMS.reduce((sum, { rect: [x0, y0, x1, y1] }) => sum + (x1 - x0) * (y1 - y0), 0);
    expect(area).toBe(70);
    for (const a of ROOMS)
      for (const b of ROOMS) {
        if (a === b) continue;
        const overlapX = Math.min(a.rect[2], b.rect[2]) - Math.max(a.rect[0], b.rect[0]);
        const overlapY = Math.min(a.rect[3], b.rect[3]) - Math.max(a.rect[1], b.rect[1]);
        expect(overlapX > 0 && overlapY > 0).toBe(false);
      }
  });

  it('finds rooms by slug and id', () => {
    expect(roomBySlug('living-room')?.id).toBe('living');
    expect(roomById('kitchen')?.slug).toBe('kitchen');
    expect(roomBySlug('garage')).toBeUndefined();
    expect(roomById('garage')).toBeUndefined();
  });

  it('converts the plan center to three.js space', () => {
    expect(roomCenter(roomById('kitchen')!)).toEqual([8, 1, -2]);
    expect(roomCenter(roomById('bedroom')!, 1.35)).toEqual([2.25, 1.35, -5.5]);
  });

  it('keeps pins inside their room and apart from each other', () => {
    for (const room of ROOMS) {
      const [x0, y0, x1, y1] = room.rect;
      const spots = Array.from({ length: 12 }, (_, i) => pinSpot(room, i));
      for (const [x, y, z] of spots) {
        expect(y).toBe(0);
        expect(x).toBeGreaterThan(x0);
        expect(x).toBeLessThan(x1);
        expect(-z).toBeGreaterThan(y0);
        expect(-z).toBeLessThan(y1);
      }
      expect(new Set(spots.map((s) => s.join())).size).toBe(spots.length);
    }
  });

  it('walks the rooms in order and stops after the last', () => {
    expect(nextRoom(ROOMS[0])).toBe(ROOMS[1]);
    expect(nextRoom(ROOMS[ROOMS.length - 1])).toBeUndefined();
  });
});
