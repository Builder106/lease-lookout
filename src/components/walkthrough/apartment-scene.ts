import { gsap } from 'gsap';
import type { Box3, Color, Group, Mesh, MeshStandardMaterial, Object3D } from 'three';

import { pinSpot, roomCenter, ROOMS, type Room, type RoomId } from '@/lib/walkthrough/rooms';

export type SceneApi = {
  focus: (id: RoomId | undefined) => void;
  setCounts: (counts: Record<RoomId, number>) => void;
  /** The sample move-out charge: pink while open, blue once a move-in photo answers it. */
  setCharge: (answered: boolean) => void;
  dispose: () => void;
};

const INK = 0x11110d;
const RECORDED = 0x2b4bf2;
const CHARGE = 0xff2e88;

export type MarkId = 'door' | 'charge';
// Where the two story labels sit, in three.js space: above the front door, and
// above the sample charge pin by the living room's back wall.
const MARKS: Record<MarkId, [number, number, number]> = {
  door: [10, 2.55, -5.5],
  charge: [4.7, 1.45, -3.45],
};
const CHARGE_SPOT: [number, number, number] = [4.7, 0, -3.45];
// Camera looks from the near corner (plan x 0, y 0) across the apartment, like
// the Blender look-dev camera: 60 degrees down from vertical, turned 45.
const OFFSET = [-0.612, 0.5, 0.612] as const;

/**
 * Mounts the apartment into `host`. `tags` are DOM labels positioned over each
 * room every frame. Three.js loads here, never in the page's first bundle.
 */
export async function mountApartment(
  host: HTMLElement,
  tags: Map<RoomId, HTMLElement>,
  marks: Map<MarkId, HTMLElement>,
  reduced: boolean
): Promise<SceneApi> {
  const [THREE, { GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
    import('three'),
    import('three/addons/loaders/GLTFLoader.js'),
    import('three/addons/libs/meshopt_decoder.module.js'),
  ]);
  const gltf = await new GLTFLoader()
    .setMeshoptDecoder(MeshoptDecoder)
    .loadAsync('/models/apartment.glb');

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping;
  const canvas = renderer.domElement;
  canvas.className = 'apartment__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.prepend(canvas);

  const scene = new THREE.Scene();
  const model = gltf.scene;
  const ink = new THREE.LineBasicMaterial({ color: INK });
  const floors = new Map<RoomId, { mat: MeshStandardMaterial; base: Color }>();
  model.traverse((o: Object3D) => {
    const mesh = o as Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    // The zine's ink line, drawn on every hard edge of the model.
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 35), ink));
    const id = mesh.name.startsWith('floor_') ? (mesh.name.slice(6) as RoomId) : null;
    if (id) {
      const mat = (mesh.material as MeshStandardMaterial).clone();
      mesh.material = mat;
      floors.set(id, { mat, base: mat.color.clone() });
    }
  });
  scene.add(model);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xb9bfcc, 1.9));
  const sun = new THREE.DirectionalLight(0xffffff, 1.7);
  sun.position.set(-3, 12, 4);
  sun.target.position.set(5, 0, -3.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 30 });
  sun.shadow.bias = -0.0005;
  scene.add(sun, sun.target);

  // Pins: one per photo, standing on the floor of its room.
  const stemGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8);
  const headGeo = new THREE.SphereGeometry(0.12, 16, 12);
  const stemMat = new THREE.MeshStandardMaterial({ color: INK, roughness: 0.5 });
  // Ink heads read on both a bare floor and a blue recorded one.
  const headMat = new THREE.MeshStandardMaterial({ color: INK, roughness: 0.35 });
  const pins = new Map<RoomId, Group[]>(ROOMS.map((r) => [r.id, []]));
  const makePin = (room: Room, i: number, drop: boolean) => {
    const pin = new THREE.Group();
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 0.35;
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.75;
    head.castShadow = true;
    pin.add(stem, head);
    const [x, , z] = pinSpot(room, i);
    pin.position.set(x, drop ? 2.4 : 0, z);
    scene.add(pin);
    if (drop) gsap.to(pin.position, { y: 0, duration: 0.45, ease: 'back.out(1.2)' });
    return pin;
  };

  // The sample charge pin: taller than a photo pin, pink until it is answered.
  const chargeMat = new THREE.MeshStandardMaterial({ color: CHARGE, roughness: 0.35 });
  const charge = new THREE.Group();
  const chargeStem = new THREE.Mesh(stemGeo, stemMat);
  chargeStem.scale.y = 1.4;
  chargeStem.position.y = 0.49;
  const chargeHead = new THREE.Mesh(headGeo, chargeMat);
  chargeHead.scale.setScalar(1.3);
  chargeHead.position.y = 1.02;
  charge.add(chargeStem, chargeHead);
  charge.position.set(...CHARGE_SPOT);
  scene.add(charge);

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 120);
  const baseOffset = new THREE.Vector3(...OFFSET).normalize().multiplyScalar(45);
  const baseQuat = new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().lookAt(baseOffset, new THREE.Vector3(), new THREE.Vector3(0, 1, 0))
  );
  const inverse = baseQuat.clone().invert();
  const view = { x: 5, y: 0.6, z: -3.5, half: 4 };

  const whole = new THREE.Box3().setFromObject(model);
  const roomBox = (room: Room): Box3 => {
    const [x0, y0, x1, y1] = room.rect;
    return new THREE.Box3(new THREE.Vector3(x0, 0, -y1), new THREE.Vector3(x1, 1.2, -y0));
  };
  const aspect = () => Math.max(host.clientWidth, 1) / Math.max(host.clientHeight, 1);
  // Center and half-height that fit `box` in view from the fixed camera angle.
  const frameFor = (box: Box3, margin: number) => {
    const c = box.getCenter(new THREE.Vector3());
    let w = 0;
    let h = 0;
    for (const x of [box.min.x, box.max.x])
      for (const y of [box.min.y, box.max.y])
        for (const z of [box.min.z, box.max.z]) {
          const v = new THREE.Vector3(x, y, z).sub(c).applyQuaternion(inverse);
          w = Math.max(w, Math.abs(v.x));
          h = Math.max(h, Math.abs(v.y));
        }
    return { x: c.x, y: c.y, z: c.z, half: Math.max(h, w / aspect()) * margin };
  };

  let focused: RoomId | undefined;
  let synced = false;
  const targetFrame = () => {
    const room = ROOMS.find((r) => r.id === focused);
    return room ? frameFor(roomBox(room), 1.35) : frameFor(whole, 1.06);
  };

  const tilt = new THREE.Quaternion();
  const axis = new THREE.Vector3(0, 1, 0);
  const place = (time: number) => {
    const sway = reduced ? 0 : Math.sin(time * 0.35) * 0.04;
    tilt.setFromAxisAngle(axis, sway);
    const a = aspect();
    camera.position.set(view.x, view.y, view.z).add(baseOffset.clone().applyQuaternion(tilt));
    camera.lookAt(view.x, view.y, view.z);
    Object.assign(camera, {
      left: -view.half * a,
      right: view.half * a,
      top: view.half,
      bottom: -view.half,
    });
    camera.updateProjectionMatrix();
  };

  const fit = () => {
    renderer.setSize(host.clientWidth, host.clientHeight, false);
    Object.assign(view, targetFrame());
  };
  fit();
  const resize = new ResizeObserver(fit);
  resize.observe(host);

  let visible = true;
  const seen = new IntersectionObserver(([e]) => {
    visible = !!e?.isIntersecting;
  });
  seen.observe(host);

  const probe = new THREE.Vector3();
  const tick = (time: number) => {
    if (!visible || document.hidden) return;
    place(time);
    renderer.render(scene, camera);
    const w = host.clientWidth;
    const h = host.clientHeight;
    for (const room of ROOMS) {
      const tag = tags.get(room.id);
      if (!tag) continue;
      probe.set(...roomCenter(room, 1.35)).project(camera);
      // Keep the whole label inside the frame when the camera is close in.
      const hw = tag.offsetWidth / 2 + 6;
      const hh = tag.offsetHeight / 2 + 6;
      const x = Math.min(Math.max(((probe.x + 1) / 2) * w, hw), w - hw);
      const y = Math.min(Math.max(((1 - probe.y) / 2) * h, hh), h - hh);
      tag.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
    }
    for (const [id, el] of marks) {
      probe.set(...MARKS[id]).project(camera);
      const x = ((probe.x + 1) / 2) * w;
      const y = ((1 - probe.y) / 2) * h;
      // Story labels hide when their spot leaves the frame instead of piling up at the edge.
      const inside = x > 0 && x < w && y > 0 && y < h;
      el.style.opacity = inside ? '1' : '0';
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`;
    }
  };
  gsap.ticker.add(tick);
  host.dataset.ready = '';

  return {
    focus(id) {
      focused = id;
      gsap.to(view, { ...targetFrame(), duration: reduced ? 0 : 0.9, ease: 'power3.out' });
    },
    setCounts(counts) {
      // The first sync restores a saved record: pins appear in place, without the drop.
      const animate = synced && !reduced;
      synced = true;
      for (const room of ROOMS) {
        const n = counts[room.id] ?? 0;
        const list = pins.get(room.id)!;
        while (list.length < n) list.push(makePin(room, list.length, animate));
        while (list.length > n) scene.remove(list.pop()!);
        const floor = floors.get(room.id);
        if (!floor) continue;
        const goal = floor.base.clone().lerp(new THREE.Color(RECORDED), n > 0 ? 0.45 : 0);
        gsap.to(floor.mat.color, {
          r: goal.r,
          g: goal.g,
          b: goal.b,
          duration: animate ? 0.6 : 0,
          ease: 'power3.out',
        });
      }
    },
    setCharge(answered) {
      const goal = new THREE.Color(answered ? RECORDED : CHARGE);
      gsap.to(chargeMat.color, {
        r: goal.r,
        g: goal.g,
        b: goal.b,
        duration: reduced ? 0 : 0.6,
        ease: 'power3.out',
      });
      if (answered && !reduced)
        gsap.fromTo(charge.scale, { y: 0.6 }, { y: 1, duration: 0.5, ease: 'back.out(1.2)' });
    },
    dispose() {
      gsap.ticker.remove(tick);
      gsap.killTweensOf(view);
      resize.disconnect();
      seen.disconnect();
      scene.traverse((o) => {
        const m = o as Mesh;
        if (m.geometry) m.geometry.dispose();
        const mats = ([] as unknown[]).concat(m.material ?? []) as { dispose?: () => void }[];
        mats.forEach((mat) => mat.dispose?.());
      });
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      delete host.dataset.ready;
    },
  };
}
