from pathlib import Path
import cv2
import numpy as np
from PIL import Image
import hashlib
import json

# Deterministic cutout of the artist-owned original album figure, NOT generated NPC art.
# Source is only a single profile; no front/back shape is invented here.
root = Path(__file__).resolve().parents[2]
source = root / "engine-lab/public/references/aa_cover_figure.webp"
out = root / "production/assets"
out.mkdir(parents=True, exist_ok=True)
bgr = cv2.imread(str(source))
if bgr is None:
    raise SystemExit(f"Reference image missing or invalid: {source}")
h, w = bgr.shape[:2]
if (w, h) != (768, 1152):
    raise SystemExit(f"Unexpected source dimensions: {(w, h)}; reassess manual silhouette!")

head=np.array([
(493,399),(526,398),(556,404),(579,418),(595,440),(605,468),
(601,503),(590,532),(581,561),(567,593),(548,614),
(513,630),(478,646),(449,649),(430,642),(414,625),(402,609),
(389,589),(389,581),(395,566),(394,552),(399,538),(401,524),
(395,516),(401,501),(398,478),(405,454),(417,432),(438,417),(465,404)
],np.int32)
cloak=np.array([
(475,626),(503,615),(538,606),(561,608),(597,620),
(624,637),(651,655),(672,683),(695,718),(708,756),
(720,798),(724,856),(734,932),(742,1012),(753,1151),
(313,1151),(309,1125),(311,1090),(319,1050),(330,1003),
(340,950),(350,892),(360,837),(368,789),(380,746),
(390,709),(414,680),(435,660),(454,649)
],np.int32)
union=np.zeros((h,w),np.uint8)
cv2.fillPoly(union,[head,cloak],255)
mask=np.full((h,w),cv2.GC_BGD,np.uint8)
mask[union>0]=cv2.GC_PR_FGD
distance=cv2.distanceTransform(union,cv2.DIST_L2,3)
mask[distance>8]=cv2.GC_FGD
bgd=np.zeros((1,65),np.float64); fgd=np.zeros((1,65),np.float64)
cv2.grabCut(bgr,mask,None,bgd,fgd,6,cv2.GC_INIT_WITH_MASK)
alpha=np.where((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD),255,0).astype(np.uint8)
alpha=cv2.morphologyEx(alpha,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
rgb=cv2.cvtColor(bgr,cv2.COLOR_BGR2RGB)
red,green,blue=[rgb[:,:,i].astype(np.float32) for i in range(3)]
yy,xx=np.indices(alpha.shape)
mountain=(xx<375)&(yy>1025)&(red>green*1.1)&(green>blue*1.12)&(red>65)
alpha[mountain]=0
alpha=cv2.GaussianBlur(alpha,(3,3),.7)
rgba=cv2.cvtColor(bgr,cv2.COLOR_BGR2RGBA)
rgba[:,:,-1]=alpha
crop=rgba[389:h,300:760].copy()
padded=np.zeros((crop.shape[0]+48,crop.shape[1]+48,4),dtype=np.uint8)
padded[24:24+crop.shape[0],24:24+crop.shape[1]]=crop
cutout=out/"REF-CHAR-000-original-profile-transparent.png"
Image.fromarray(padded).save(cutout,optimize=True)
navy=np.full((padded.shape[0],padded.shape[1],3),[14,23,47],np.uint8)
opacity=padded[:,:,-1:]/255
review=(padded[:,:,:3]*opacity+navy*(1-opacity)).astype(np.uint8)
Image.fromarray(review).save(out/"REF-CHAR-000-profile-review.png",optimize=True)

# Automated gate confirms the skull, eye area, textile silhouette remain present.
occupied=int((padded[:,:,3]>127).sum())
if not 205000 < occupied < 250000:
    raise SystemExit(f"Source-character silhouette changed unexpectedly: {occupied} pixels")
if np.max(padded[44:90,175:270,3])<127:
    raise SystemExit("Cranial silhouette lost; reject output")
metadata={
 "id":"REF-CHAR-000","version":"1.0","status":"PROFILE_ONLY_ARTIST_SOURCE_NOT_RIGGED_NPC",
 "source":"engine-lab/public/references/aa_cover_figure.webp",
 "source_sha256":hashlib.sha256(source.read_bytes()).hexdigest(),
 "source_dimensions":[w,h],"cutout_dimensions":[padded.shape[1],padded.shape[0]],
 "opaque_pixels":occupied,
 "restrictions":["Does not define actor identity","No front/rear view",
   "No inferred anatomy beyond source","Cutout ends at original image boundary",
   "Source art is not a 3D mesh or NPC"]
}
(out/"REF-CHAR-000-metadata.json").write_text(json.dumps(metadata,indent=2)+"\n")
print(json.dumps(metadata))
