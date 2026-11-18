"""Arcturian Awakening / ENV-003: metric 3D civic hall study.
NOT approved world art. No NPCs, licensed source model, or navigation mesh.
The dimensions and social functions derive from the M0 World Bible.
"""
import json
from pathlib import Path
import numpy as np
import trimesh

HERE=Path(__file__).resolve().parent
OUT=HERE.parent/"public"/"models"
OUT.mkdir(parents=True,exist_ok=True)
scene=trimesh.Scene()
parts=[]
COLORS={
 "mineral":(37,58,89,255),"edge":(94,68,45,255),
 "base":(56,65,76,255),"bronze":(104,72,53,255),
 "cloth":(79,34,71,255),"shadow":(16,27,48,255),
 "floor":(63,74,89,255),"ledge":(111,88,60,255),
 "inlay":(131,88,52,255)
}
def add(mesh,name,material,meaning,room="civic hall"):
    mesh.visual.vertex_colors=np.tile(COLORS[material],(len(mesh.vertices),1))
    scene.add_geometry(mesh,geom_name=name,node_name=name)
    parts.append({"id":name,"material":material,"function":meaning,"room":room,"triangles":len(mesh.faces)})
def box(name,material,center,size,meaning,room="civic hall"):
    mesh=trimesh.creation.box(extents=size)
    mesh.apply_translation(center)
    add(mesh,name,material,meaning,room)
def wedge(name,material,verts,meaning):
    v=np.array(verts,dtype=float)
    faces=np.array([[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,4,5],[0,5,1],
                    [1,5,6],[1,6,2],[2,6,7],[2,7,3],[3,7,4],[3,4,0]])
    mesh=trimesh.Trimesh(vertices=v,faces=faces,process=True)
    if mesh.volume<0:mesh.invert()
    add(mesh,name,material,meaning,"public entrance")
W=11.2;D=8.4
box("STR_floor_structural_slab","base",(0,.08,D/2),(W,.16,D),"Continuous level floor")
box("FIN_floor_wear_surface","floor",(0,.17,D/2),(10.8,.035,8.0),"Repairable walkable surface")
box("FIN_central_circulation_inlay","inlay",(0,.198,3.9),(2.25,.012,7.6),"Legible social circulation aisle")
for side in [-1,1]:
    tag="L" if side<0 else "R"
    box("STR_front_pier_"+tag,"mineral",(side*3.45,1.78,.13),(4.3,3.48,.26),"Roof-supporting wall with entrance gap")
box("STR_portal_header","mineral",(0,3.35,.13),(2.6,.34,.28),"Load transfer above 2.6m public opening")
box("FIN_door_jamb_left","bronze",(-1.34,1.55,-.015),(.075,3.1,.10),"Durable public door edge")
box("FIN_door_jamb_right","bronze",(1.34,1.55,-.015),(.075,3.1,.10),"Durable public door edge")
for side in [-1,1]:
    tag="L" if side<0 else "R"
    box("STR_side_wall_lower_"+tag,"mineral",(side*5.48,1.66,4.2),(.24,3.0,8.4),"Shelter wall with true upper ventilation void")
    box("STR_side_wall_top_cap_"+tag,"mineral",(side*5.48,3.54,4.2),(.24,.11,8.4),"Cap over clerestory")
    for i,z in enumerate(np.arange(0.0,8.41,1.05)):
        box(f"STR_clerestory_divider_{tag}_{i:02d}","bronze",(side*5.48,3.325,float(z)),(.24,.34,.11),"Divider between physically open ventilators")
box("STR_back_wall","mineral",(0,1.85,8.28),(10.98,3.48,.24),"Acoustic rear enclosure")
box("STR_roof_span","mineral",(0,3.82,3.73),(12,.20,10.6),"Shelter with 1.5m street canopy overhang")
box("FIN_roof_drip_front","bronze",(0,3.66,-1.56),(12.05,.075,.10),"Guides roof runoff beyond entrance")
for side in [-1,1]:
    box("STR_end_beam_"+("L" if side<0 else "R"),"base",(side*5.47,3.55,4.2),(.35,.35,8.1),"Transfers canopy loading")
for i,x in enumerate(np.arange(-4.9,5,1.4)):
    box(f"SHADE_louver_{i:02d}","bronze",(float(x),3.49,-.65),(.09,.42,1.5),"Shields entrance from low-angle sun")
box("ACCESS_sill","ledge",(0,.085,-.17),(2.55,.10,.45),"Near-flush public entry")
wedge("ACCESS_ramp","base",[
 [-1.35,.005,-3.2],[1.35,.005,-3.2],[1.35,.16,-.42],[-1.35,.16,-.42],
 [-1.35,-.08,-3.2],[1.35,-.08,-3.2],[1.35,.00,-.42],[-1.35,.00,-.42]],
 "Gradual entrance transition; needs real-world accessibility check")
for side in [-1,1]:
    for i,z in enumerate((2.7,4.45,6.2)):
        tag="L" if side<0 else "R"
        box(f"FURN_group_{tag}_{i}_seat","ledge",(side*3.32,.46,z),(2.0,.12,.50),"Bench for social listening")
        for j,dx in enumerate((-.85,.85)):
            box(f"FURN_seat_leg_{tag}_{i}_{j}","base",(side*3.32+dx,.30,z),(.13,.35,.37),"Load-bearing seat support")
box("SERVICE_access_housing","base",(4.26,1.18,-.10),(1.32,1.55,.13),"Receiver service enclosure")
box("SERVICE_inspection_panel","bronze",(4.26,1.15,-.18),(1.13,1.15,.03),"Replaceable maintenance hatch")
for i,x in enumerate((-.42,.42)):
    for j,y in enumerate((.79,1.49)):
        box(f"SERVICE_fastener_{i}_{j}","shadow",(4.26+x,y,-.205),(.047,.047,.025),"Accessible physical fastener")
box("SERVICE_handle_grip","cloth",(4.26,1.09,-.247),(.34,.06,.065),"Hand-contact wrap")
for i,z in enumerate((3.3,4.2,5.1)):
    box(f"STORAGE_shared_record_ledge_{i}","ledge",(-4.95,1.05,z),(.55,.09,.53),"Shared record storage")
box("FURN_conversation_bench","ledge",(0,.46,7.48),(2.7,.12,.58),"Non-ceremonial discussion seat")
for x in (-1.1,1.1):
    box(f"FURN_conversation_leg_{x}","base",(x,.3,7.48),(.16,.35,.38),"Load-bearing seat support")
for side in [-1,1]:
    for i,z in enumerate((2.9,5.3)):
        x=side*4.8;tag="L" if side<0 else "R"
        box(f"ACOUSTIC_frame_{tag}_{i}","bronze",(x,2.0,z),(.12,1.6,1.35),"Replaceable textile frame")
        box(f"ACOUSTIC_burgundy_fabric_{tag}_{i}","cloth",(x-side*.09,2.0,z),(.08,1.48,1.20),"Social sound dampening")
box("FURN_public_handoff_shelf","ledge",(-3.5,1.02,-.18),(1.5,.10,.65),"Public records exchange")

lower,upper=scene.bounds
bounds=(upper-lower).tolist()
assert len(parts)==85,(len(parts),"parts expected")
assert 12.0<bounds[0]<12.2
assert 3.8<bounds[1]<4.2
assert 12.0<bounds[2]<12.4
assert all(m.is_watertight and m.volume>0 for m in scene.geometry.values())
file=OUT/"ENV-003-working-listening-hall-blockout-v01.glb"
file.write_bytes(trimesh.exchange.gltf.export_glb(scene))
report={
 "asset_id":"ENV-003/ENV-004","status":"NOT APPROVED - construction study only",
 "file":file.name,"bytes":file.stat().st_size,"parts":len(parts),
 "triangles":sum(p["triangles"] for p in parts),
 "bounds_m":[round(float(z),3) for z in bounds],
 "entry_width_m":2.6,"entry_height_m":3.0,"seat_height_m":.46,
 "has_rigged_residents":False,"has_original_pbr_textures":False,
 "rights":"Original construction blockout only",
 "limitations":["No finalized cultural grammar","No sculpted materials or character models",
                 "No navmesh or physical gameplay","No artist approval","Accessibility requires verification"],
 "part_inventory":parts}
(OUT/"ENV-003-hall-blockout-report.json").write_text(json.dumps(report,indent=2)+"\n")
print(json.dumps({key:report[key] for key in ["file","bytes","parts","triangles","bounds_m","status"]},indent=2))
