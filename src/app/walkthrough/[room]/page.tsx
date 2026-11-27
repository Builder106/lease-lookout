import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RoomRecord } from '@/components/walkthrough/RoomRecord';
import { ROOMS, roomBySlug } from '@/lib/walkthrough/rooms';

type Props = { params: Promise<{ room: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ROOMS.map((r) => ({ room: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const room = roomBySlug((await params).room);
  return room
    ? {
        title: `${room.name}: move-in walkthrough, LeaseLookout`,
        description: `What to photograph in the ${room.name.toLowerCase()} on move-in day: ${room.checklist}`,
      }
    : {};
}

export default async function RoomPage({ params }: Props) {
  const room = roomBySlug((await params).room);
  if (!room) notFound();
  return <RoomRecord roomId={room.id} />;
}
