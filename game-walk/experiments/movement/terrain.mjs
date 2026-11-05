/** Architectural movement lab: hand-authored test terrain, independent from rendering.
 * This is not the album's approved level geometry. Positions are logical world units.
 * The same samples drive the physics ground contact and visible ridge.
 */
export const points = Object.freeze([
  {x:0,y:408},{x:260,y:408},{x:500,y:369},{x:760,y:369},
  {x:980,y:405},{x:1170,y:405},{x:1370,y:374},{x:1570,y:374},
  {x:1710,y:420},{x:1920,y:420},{x:2190,y:370},{x:2560,y:370}
]);
export const gap = Object.freeze({start:1765,end:1820});
export const WORLD_END = points.at(-1).x;
export function floorAt(x) {
  if (!Number.isFinite(x) || x<0 || x>WORLD_END || (x>gap.start && x<gap.end)) return null;
  for (let i=0;i<points.length-1;i++) {
    const a=points[i], b=points[i+1];
    if (x>=a.x && x<=b.x) {
      const slope=(b.y-a.y)/(b.x-a.x), length=Math.hypot(slope,1);
      return {y:a.y+(x-a.x)*slope,normal:{x:slope/length,y:-1/length}};
    }
  }
  return {y:points.at(-1).y,normal:{x:0,y:-1}};
}