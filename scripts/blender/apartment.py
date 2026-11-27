"""Build the one-bedroom apartment used by /walkthrough.

Run headless on a machine with Blender 5.x:

    blender -b --python scripts/blender/apartment.py -- <out_dir>

Writes <out_dir>/apartment.blend, <out_dir>/apartment.glb and a look-dev render
<out_dir>/preview.png from the isometric camera the site uses.

Units are meters, Z up. The plan is 10 m by 7 m. Each room has one floor mesh
named floor_<room> and one empty named anchor_<room> at its center; the web app
finds both by name. Colors are flat Principled materials, no textures.
"""

import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

OUT = Path(sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else ".").expanduser()
OUT.mkdir(parents=True, exist_ok=True)

ROOMS = {
    # id: (x0, y0, x1, y1, floor color)
    "living": (0.0, 0.0, 6.0, 4.0, "#d9c6a5"),
    "kitchen": (6.0, 0.0, 10.0, 4.0, "#d9dce3"),
    "bedroom": (0.0, 4.0, 4.5, 7.0, "#d9c6a5"),
    "bathroom": (4.5, 4.0, 7.0, 7.0, "#cfd8e6"),
    "entry": (7.0, 4.0, 10.0, 7.0, "#d9dce3"),
}

WALL_T = 0.12
TALL = 2.5  # far outer walls
LOW = 1.0  # interior walls, cut so the rooms behind them stay visible
CURB = 0.25  # near outer walls

PALETTE = {
    "wall": ("#eef0f4", 0.9),
    "cap": ("#11110d", 0.6),
    "ink": ("#11110d", 0.5),
    "white": ("#f7f8fa", 0.5),
    "wood": ("#b98b5e", 0.7),
    # Blue is reserved for recorded rooms on the site, so furniture avoids it.
    "sofa": ("#d9a521", 0.85),
    "duvet": ("#8fa05a", 0.9),
    "door": ("#2a2d35", 0.6),
    "paleblue": ("#bcd0ff", 0.3),
    "steel": ("#b8bec9", 0.3),
    "counter": ("#3a3d45", 0.5),
    "dark": ("#1a1b20", 0.6),
    "green": ("#3f8f5a", 0.8),
    "pot": ("#c46a4a", 0.8),
    "rug": ("#b9b3a8", 1.0),
    "mat": ("#2a2d35", 1.0),
}


def srgb(hex_color):
    h = hex_color.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i : i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0)


def material(name, hex_color, rough):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = srgb(hex_color)
    bsdf.inputs["Roughness"].default_value = rough
    m.diffuse_color = srgb(hex_color)
    return m


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def link(obj):
    bpy.context.scene.collection.objects.link(obj)
    return obj


def box(name, x0, y0, z0, x1, y1, z1, mat):
    bpy.ops.mesh.primitive_cube_add(size=1)
    o = bpy.context.active_object
    o.name = name
    o.location = ((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)
    o.scale = (abs(x1 - x0), abs(y1 - y0), abs(z1 - z0))
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.data.materials.append(MATS[mat])
    return o


def cyl(name, cx, cy, z0, r, h, mat, verts=20):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=h, location=(cx, cy, z0 + h / 2))
    o = bpy.context.active_object
    o.name = name
    o.data.materials.append(MATS[mat])
    return o


def ball(name, cx, cy, cz, r, mat):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=r, location=(cx, cy, cz))
    o = bpy.context.active_object
    o.name = name
    o.data.materials.append(MATS[mat])
    return o


def wall_x(name, x, y0, y1, h, gaps=()):
    """Wall along Y at x, with gaps as (start, end) spans."""
    spans, cur = [], y0
    for g0, g1 in sorted(gaps):
        spans.append((cur, g0))
        cur = g1
    spans.append((cur, y1))
    for i, (a, b) in enumerate(spans):
        if b - a > 0.01:
            box(f"{name}_{i}", x - WALL_T / 2, a, 0, x + WALL_T / 2, b, h, "wall")
            box(f"{name}_{i}_cap", x - WALL_T / 2, a, h, x + WALL_T / 2, b, h + 0.02, "cap")


def wall_y(name, y, x0, x1, h, gaps=()):
    spans, cur = [], x0
    for g0, g1 in sorted(gaps):
        spans.append((cur, g0))
        cur = g1
    spans.append((cur, x1))
    for i, (a, b) in enumerate(spans):
        if b - a > 0.01:
            box(f"{name}_{i}", a, y - WALL_T / 2, 0, b, y + WALL_T / 2, h, "wall")
            box(f"{name}_{i}_cap", a, y - WALL_T / 2, h, b, y + WALL_T / 2, h + 0.02, "cap")


def table(name, x0, y0, x1, y1, h, mat="wood"):
    box(f"{name}_top", x0, y0, h - 0.04, x1, y1, h, mat)
    leg = 0.05
    for i, (lx, ly) in enumerate([(x0, y0), (x1 - leg, y0), (x0, y1 - leg), (x1 - leg, y1 - leg)]):
        box(f"{name}_leg{i}", lx, ly, 0, lx + leg, ly + leg, h - 0.04, mat)


def chair(name, x0, y0, back_side):
    box(f"{name}_seat", x0, y0, 0.42, x0 + 0.42, y0 + 0.42, 0.46, "wood")
    for i, (lx, ly) in enumerate([(0, 0), (0.38, 0), (0, 0.38), (0.38, 0.38)]):
        box(f"{name}_leg{i}", x0 + lx, y0 + ly, 0, x0 + lx + 0.04, y0 + ly + 0.04, 0.42, "wood")
    if back_side == "+y":
        box(f"{name}_back", x0, y0 + 0.38, 0.46, x0 + 0.42, y0 + 0.42, 0.9, "wood")
    else:
        box(f"{name}_back", x0, y0, 0.46, x0 + 0.42, y0 + 0.04, 0.9, "wood")


def build():
    for room, (x0, y0, x1, y1, color) in ROOMS.items():
        m = material(f"floor_{room}", color, 0.85)
        bpy.ops.mesh.primitive_cube_add(size=1)
        f = bpy.context.active_object
        f.name = f"floor_{room}"
        f.location = ((x0 + x1) / 2, (y0 + y1) / 2, -0.03)
        f.scale = (x1 - x0, y1 - y0, 0.06)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        f.data.materials.append(m)
        a = bpy.data.objects.new(f"anchor_{room}", None)
        a.location = ((x0 + x1) / 2, (y0 + y1) / 2, 1.3)
        link(a)

    # Outer walls. Far walls are full height; near walls are a low curb.
    wall_x("wall_east", 10.0, 0.0, 7.0, TALL, gaps=[(5.0, 6.0)])
    box("door_lintel", 10 - WALL_T / 2, 5.0, 2.1, 10 + WALL_T / 2, 6.0, TALL, "wall")
    box("front_door", 9.97, 5.02, 0.0, 10.02, 5.98, 2.08, "door")
    cyl("front_door_knob", 9.95, 5.85, 1.0, 0.035, 0.05, "steel", verts=12)
    wall_y("wall_north", 7.0, 0.0, 10.0, TALL, gaps=[(3.1, 4.2)])
    box("window_sill", 3.1, 7 - WALL_T / 2, 0.0, 4.2, 7 + WALL_T / 2, 0.95, "wall")
    box("window_glass", 3.1, 6.99, 0.95, 4.2, 7.01, 2.0, "paleblue")
    box("window_head", 3.1, 7 - WALL_T / 2, 2.0, 4.2, 7 + WALL_T / 2, TALL, "wall")
    wall_x("wall_west", 0.0, 0.0, 7.0, CURB)
    wall_y("wall_south", 0.0, 0.0, 10.0, CURB)

    # Interior walls, cut low.
    wall_y("wall_mid", 4.0, 0.0, 10.0, LOW, gaps=[(3.0, 3.9), (5.0, 5.8), (7.6, 9.2)])
    wall_x("wall_kitchen", 6.0, 0.0, 4.0, LOW, gaps=[(1.2, 4.0)])
    wall_x("wall_bed_bath", 4.5, 4.0, 7.0, LOW)
    wall_x("wall_bath_entry", 7.0, 4.0, 7.0, LOW)

    # Living room.
    box("rug", 1.2, 0.8, 0.0, 4.4, 3.0, 0.012, "rug")
    box("sofa_base", 1.5, 2.9, 0.0, 4.1, 3.8, 0.42, "sofa")
    box("sofa_back", 1.5, 3.58, 0.42, 4.1, 3.84, 0.86, "sofa")
    box("sofa_arm_l", 1.5, 2.9, 0.42, 1.7, 3.58, 0.62, "sofa")
    box("sofa_arm_r", 3.9, 2.9, 0.42, 4.1, 3.58, 0.62, "sofa")
    table("coffee_table", 2.2, 1.6, 3.4, 2.3, 0.42)
    box("tv_stand", 2.0, 0.18, 0.0, 3.6, 0.58, 0.5, "dark")
    box("tv", 2.1, 0.34, 0.5, 3.5, 0.4, 1.25, "ink")
    cyl("lamp_base", 0.6, 3.4, 0.0, 0.16, 0.03, "ink")
    cyl("lamp_pole", 0.6, 3.4, 0.03, 0.02, 1.4, "ink", verts=8)
    cyl("lamp_shade", 0.6, 3.4, 1.4, 0.22, 0.32, "white")
    cyl("plant_pot", 0.55, 0.6, 0.0, 0.22, 0.42, "pot")
    ball("plant", 0.55, 0.6, 0.82, 0.42, "green")

    # Kitchen.
    box("fridge", 9.2, 0.15, 0.0, 9.94, 0.85, 1.85, "white")
    box("fridge_handle", 9.16, 0.7, 0.9, 9.2, 0.75, 1.5, "steel")
    box("counter_base", 9.35, 1.0, 0.0, 9.94, 3.85, 0.88, "white")
    box("counter_top", 9.3, 0.96, 0.88, 9.94, 3.88, 0.93, "counter")
    box("sink", 9.45, 1.45, 0.86, 9.85, 1.95, 0.945, "steel")
    cyl("faucet", 9.88, 1.7, 0.93, 0.025, 0.28, "steel", verts=10)
    box("stove", 9.36, 2.6, 0.93, 9.92, 3.3, 0.945, "dark")
    for i, (bx, by) in enumerate([(9.52, 2.78), (9.76, 2.78), (9.52, 3.12), (9.76, 3.12)]):
        cyl(f"burner{i}", bx, by, 0.945, 0.08, 0.012, "steel", verts=16)
    box("upper_cabinets", 9.62, 1.0, 1.5, 9.94, 3.85, 2.2, "white")
    table("dining_table", 7.0, 1.5, 8.2, 2.5, 0.75)
    chair("dining_chair_a", 7.38, 0.95, "-y")
    chair("dining_chair_b", 7.38, 2.63, "+y")

    # Bedroom.
    box("bed_frame", 0.9, 4.9, 0.0, 2.9, 6.9, 0.3, "wood")
    box("mattress", 0.95, 4.95, 0.3, 2.85, 6.85, 0.5, "white")
    box("duvet", 0.93, 4.93, 0.5, 2.87, 6.1, 0.57, "duvet")
    box("pillow_l", 1.05, 6.3, 0.5, 1.8, 6.75, 0.63, "white")
    box("pillow_r", 1.95, 6.3, 0.5, 2.75, 6.75, 0.63, "white")
    box("headboard", 0.9, 6.86, 0.0, 2.9, 6.94, 1.05, "wood")
    box("nightstand", 3.0, 6.4, 0.0, 3.45, 6.88, 0.5, "wood")
    cyl("bedside_lamp", 3.22, 6.64, 0.5, 0.09, 0.28, "white", verts=14)
    table("desk", 0.15, 4.35, 0.8, 5.6, 0.75)
    chair("desk_chair", 0.85, 4.75, "+y")
    box("dresser", 3.25, 6.42, 0.0, 4.25, 6.9, 0.8, "white")

    # Bathroom.
    box("tub", 4.65, 6.1, 0.0, 6.85, 6.88, 0.56, "white")
    box("tub_water", 4.8, 6.22, 0.3, 6.7, 6.76, 0.565, "paleblue")
    cyl("toilet_bowl", 6.6, 5.6, 0.0, 0.2, 0.42, "white")
    box("toilet_tank", 6.75, 5.35, 0.4, 6.92, 5.85, 0.82, "white")
    box("vanity", 6.4, 4.3, 0.0, 6.88, 5.0, 0.85, "white")
    box("vanity_basin", 6.48, 4.45, 0.84, 6.8, 4.85, 0.9, "steel")
    box("bath_mat", 5.0, 5.2, 0.0, 5.9, 5.8, 0.01, "rug")

    # Entry.
    box("doormat", 9.2, 5.0, 0.0, 9.92, 6.0, 0.012, "mat")
    box("console", 7.08, 5.5, 0.72, 7.48, 6.8, 0.78, "wood")
    box("console_leg_a", 7.1, 5.52, 0.0, 7.15, 5.57, 0.72, "wood")
    box("console_leg_b", 7.1, 6.73, 0.0, 7.15, 6.78, 0.72, "wood")
    box("shoe_bench", 8.9, 6.45, 0.0, 9.85, 6.88, 0.45, "wood")
    box("shoes", 9.05, 6.1, 0.0, 9.35, 6.35, 0.1, "ink")


def stage():
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x, scene.render.resolution_y = 1600, 1100
    scene.render.film_transparent = True
    scene.render.use_freestyle = True
    scene.render.line_thickness = 1.4
    world = bpy.data.worlds.new("world")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.9, 0.92, 0.96, 1)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.9
    scene.world = world
    sun = bpy.data.lights.new("sun", "SUN")
    sun.energy = 3.0
    sun_obj = link(bpy.data.objects.new("sun", sun))
    sun_obj.rotation_euler = (math.radians(50), math.radians(10), math.radians(-30))
    cam = bpy.data.cameras.new("iso")
    cam.type = "ORTHO"
    cam.ortho_scale = 12.5
    cam_obj = link(bpy.data.objects.new("iso", cam))
    cam_obj.rotation_euler = (math.radians(60), 0, math.radians(-45))
    center = Vector((5.0, 3.5, 0.6))
    forward = cam_obj.rotation_euler.to_matrix() @ Vector((0, 0, -1))
    cam_obj.location = center - forward * 30
    scene.camera = cam_obj


reset()
MATS = {k: material(k, c, r) for k, (c, r) in PALETTE.items()}
build()
bpy.ops.wm.save_as_mainfile(filepath=str(OUT / "apartment.blend"))
bpy.ops.export_scene.gltf(
    filepath=str(OUT / "apartment.glb"),
    export_format="GLB",
    export_apply=True,
    export_yup=True,
    export_cameras=False,
    export_lights=False,
)
stage()
bpy.context.scene.render.filepath = str(OUT / "preview.png")
bpy.ops.render.render(write_still=True)
print("APARTMENT_OK", OUT)
