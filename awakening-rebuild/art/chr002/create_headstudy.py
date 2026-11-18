"""Original album figure morphology only. Not an approved Arcturian NPC."""
import bpy,math,json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'art'/'chr002'/'out'
OUT.mkdir(exist_ok=True,parents=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
S=bpy.context.scene;S.unit_settings.system='METRIC'
engines=[x.identifier for x in S.render.bl_rna.properties['engine'].enum_items]
S.render.engine=next(x for x in ('BLENDER_EEVEE','BLENDER_EEVEE_NEXT','BLENDER_WORKBENCH') if x in engines)
S.render.resolution_x=640;S.render.resolution_y=640;S.render.resolution_percentage=100
S.render.image_settings.file_format='PNG'
S.view_settings.view_transform='AgX'
world=bpy.data.worlds.new('Neutral_cobalt_study')
world.use_nodes=True
world.node_tree.nodes.get('Background').inputs['Color'].default_value=(.052,.069,.090,1)
world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.8
S.world=world
def srgb(code):
    a=[int(code[i:i+2],16)/255 for i in (1,3,5)]
    return tuple(x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in a)
def mat(name,color,rough=.7,bump_scale=0):
    m=bpy.data.materials.new(name);m.use_nodes=True
    c=srgb(color);m.diffuse_color=(*c,1)
    n=m.node_tree.nodes;p=n.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*c,1)
    p.inputs['Roughness'].default_value=rough
    if bump_scale:
        noise=n.new('ShaderNodeTexNoise')
        noise.inputs['Scale'].default_value=bump_scale
        noise.inputs['Detail'].default_value=3
        b=n.new('ShaderNodeBump')
        b.inputs['Strength'].default_value=.075
        b.inputs['Distance'].default_value=.002
        m.node_tree.links.new(noise.outputs['Fac'],b.inputs['Height'])
        m.node_tree.links.new(b.outputs['Normal'],p.inputs['Normal'])
    return m
skin=mat('Source_cobalt_skin_183E80','#183E80',.62,110)
shade=mat('Deep_cobalt_shadows_05124B','#05124B',.68)
cloak=mat('Heavy_plain_burgundy_461F46','#461F46',.90,90)
hood=mat('Hood_fold_341632','#341632',.91,80)
eye=mat('Dark_nonluminous_eye_060810','#060810',.24)
lid=mat('Dark_cobalt_lid_0C2C66','#0C2C66',.70)
def mesh(name,v,f,m,sub=0):
    data=bpy.data.meshes.new(name+'_mesh');data.from_pydata(v,[],f);data.update()
    o=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(o)
    data.materials.append(m)
    for p in data.polygons:p.use_smooth=True
    if sub:
        mod=o.modifiers.new('sculpt_smoothing','SUBSURF')
        mod.levels=sub;mod.render_levels=sub
    return o
# Rearward skull with a narrow lower jaw, one profile as the sole anatomical source.
rings=[(1.505,.015,.020,.01),(1.55,.068,.076,.02),(1.62,.112,.142,.028),
 (1.74,.15,.17,.037),(1.88,.165,.215,.044),(2.00,.179,.246,.061),
 (2.12,.195,.258,.069),(2.21,.199,.263,.07),(2.28,.158,.211,.068),
 (2.34,.074,.109,.057),(2.355,.007,.01,.046)]
v=[];f=[];N=80
for z,rx,ry,cy in rings:
 for i in range(N):
    t=math.tau*i/N
    v.append((rx*math.cos(t),cy+ry*math.sin(t),z))
for j in range(len(rings)-1):
 for i in range(N):
    a=j*N+i;b=j*N+(i+1)%N;c=(j+1)*N+i;d=(j+1)*N+(i+1)%N
    f.extend(((a,b,c),(b,d,c)))
mesh('CHR002_original_skull_contour',v,f,skin,2)
def ellipsoid(name,xyz,dimensions,material):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=40,ring_count=20,location=xyz)
    o=bpy.context.object;o.name=name;o.scale=dimensions
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    o.data.materials.append(material)
    for p in o.data.polygons:p.use_smooth=True
    return o
ellipsoid('CHR002_neck',(0,.055,1.43),(.092,.092,.17),skin)
ellipsoid('CHR002_nose_bridge',(0,-.18,1.785),(.036,.05,.084),skin)
ellipsoid('CHR002_nose_tip',(0,-.22,1.73),(.034,.04,.03),skin)
ellipsoid('CHR002_upper_lip',(0,-.168,1.662),(.058,.022,.011),skin)
ellipsoid('CHR002_lower_lip',(0,-.162,1.637),(.053,.018,.012),skin)
for sign in (-1,1):
    suffix='L' if sign<0 else 'R'
    ellipsoid('CHR002_recessed_eye_'+suffix,(sign*.133,-.112,1.883),(.027,.039,.022),eye)
    ellipsoid('CHR002_upper_lid_'+suffix,(sign*.130,-.112,1.906),(.036,.045,.011),lid)
    ellipsoid('CHR002_lower_lid_'+suffix,(sign*.130,-.112,1.859),(.031,.041,.009),lid)
ellipsoid('CHR002_visible_ear_R',(.167,.095,1.816),(.038,.041,.077),skin)
ellipsoid('CHR002_ear_concha_R',(.194,.08,1.812),(.012,.018,.035),shade)
def drape(name,rings,material,fold):
    n=80;verts=[];faces=[]
    for j,(z,rx,ry,cy) in enumerate(rings):
        for i in range(n):
            t=math.tau*i/n;w=fold*math.sin(8*t+j*.24)+fold*.5*math.cos(13*t)
            verts.append(((rx+w)*math.cos(t),cy+(ry+w)*math.sin(t),z))
    for j in range(len(rings)-1):
        for i in range(n):
            a=j*n+i;b=j*n+(i+1)%n;c=(j+1)*n+i;d=(j+1)*n+(i+1)%n
            faces.extend(((a,b,c),(b,d,c)))
    o=mesh(name,verts,faces,material,1)
    a=o.modifiers.new('thick_woven_cloth','SOLIDIFY');a.thickness=.008
drape('CHR002_plain_burgundy_drape',[
 (.48,.32,.28,.06),(.65,.40,.31,.058),(.86,.45,.33,.055),
 (1.07,.465,.32,.049),(1.22,.43,.31,.05),(1.37,.30,.25,.08),
 (1.46,.18,.20,.11)],cloak,.018)
drape('CHR002_weighted_hood',[
 (1.4,.17,.19,.12),(1.47,.19,.214,.14),
 (1.54,.18,.22,.16),(1.60,.12,.154,.175)],hood,.012)
# Silhouette gate: the first model's head was .85m against a ~1m visible
# cloak, an unsupported caricature. This provisional .575m head preserves
# the source's long posterior dome without treating one profile as anatomy.
for o in list(bpy.context.scene.objects):
    if o.type!='MESH' or not o.name.startswith('CHR002_'):continue
    if o.name in ('CHR002_neck','CHR002_plain_burgundy_drape','CHR002_weighted_hood'):continue
    if o.name=='CHR002_original_skull_contour':
        for v in o.data.vertices:v.co.z=1.505+(v.co.z-1.505)*.68
    else:
        for v in o.data.vertices:v.co.z*=.68
        o.location.z=1.505+(o.location.z-1.505)*.68
bpy.context.view_layer.update()
assert .56<bpy.data.objects['CHR002_original_skull_contour'].dimensions.z<.59

def aim(o,target):
    o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(2.45,-2.85,2.06))
cam=bpy.context.object;cam.name='CAM_3quarter'
cam.data.type='ORTHO';cam.data.ortho_scale=2.25
aim(cam,(0,0,1.48));S.camera=cam
for name,where,energy,color,size in [
 ('LGT_orange_key',(-2,-3,4),375,(1,.58,.36),2.7),
 ('LGT_cobalt_fill',(1.8,-2.5,2.9),280,(.5,.65,1),2.5)]:
    bpy.ops.object.light_add(type='AREA',location=where)
    o=bpy.context.object;o.name=name;o.data.energy=energy
    o.data.color=color;o.data.shape='DISK';o.data.size=size
    aim(o,(0,0,1.6))
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'CHR002-head-study.blend'))
bpy.ops.export_scene.gltf(filepath=str(OUT/'CHR002-head-study.glb'),export_format='GLB')
S.render.filepath=str(OUT/'three-quarter.png');bpy.ops.render.render(write_still=True)
cam.location=(3.2,-.10,2.02);aim(cam,(0,.02,1.5))
S.render.filepath=str(OUT/'profile.png');bpy.ops.render.render(write_still=True)
report={
 "status":"NOT_APPROVED_UNRIGGED_MORPHOLOGY_STUDY",
 "meshes":len([o for o in S.objects if o.type=='MESH']),
 "blender":bpy.app.version_string,
 "source":"Original aa_cover_figure.webp profile only",
 "has_rig":False,"has_animations":False,
 "skull_height_m":round(bpy.data.objects["CHR002_original_skull_contour"].dimensions.z,3),
 "identity_canon":"unverified",
 "limits":["No front/back canon","No original acting","Not photoreal character art",
 "Procedural Blender bump may not transfer to glTF"]
}
(OUT/'status.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
