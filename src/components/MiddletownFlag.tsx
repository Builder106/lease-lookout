/** The flag of Middletown, CT, waving — a Blender-rendered cloth loop textured
 *  with the real city flag, framed in the zine ink border + hard offset shadow.
 *
 *  Plain <img>, not next/image: the animated WebP must bypass the image
 *  optimizer, which would re-encode it to a single frozen frame. The clip
 *  carries its own alpha, so it sits on the card mat in either theme. */
export function MiddletownFlag({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="ll-shadow inline-block -rotate-1 border-[3px] border-border bg-card p-1.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/middletown-flag.webp"
          alt="The flag of Middletown, Connecticut, waving"
          width={720}
          height={432}
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}
