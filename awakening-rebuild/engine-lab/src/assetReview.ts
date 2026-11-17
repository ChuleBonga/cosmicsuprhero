/** Deterministic technical intake criteria. None of these prove visual fidelity. */
export type AssetRole = 'character' | 'prop' | 'environment';
export type AssetMetrics = Readonly<{
  meshes: number;
  skeletons: number;
  animationNames: readonly string[];
  textureCount: number;
  materialCount: number;
  triangles: number;
  fileBytes: number;
  heightMetres: number;
}>;
export type GateResult = Readonly<{ verdict: 'reject' | 'visual-review'; reasons: readonly string[] }>;
export function inspectAsset(metrics: AssetMetrics, role: AssetRole): GateResult {
  const reasons: string[] = [];
  if(metrics.meshes < 1) reasons.push('No renderable mesh');
  if(metrics.materialCount < 1) reasons.push('No assigned material');
  if(metrics.triangles <= 0) reasons.push('No triangles');
  if(metrics.textureCount < 1) reasons.push('No texture maps: physically credible detail is unverified');
  if(metrics.fileBytes > 30 * 1024 * 1024) reasons.push('Asset larger than 30 MiB: optimize before browser review');
  if(!Number.isFinite(metrics.heightMetres) || metrics.heightMetres <= 0) reasons.push('Invalid dimensions');
  if(role === 'character') {
    if(metrics.skeletons < 1) reasons.push('No humanoid skeleton: not a production NPC');
    const names=metrics.animationNames.map(s=>s.toLowerCase());
    for(const [label,keywords] of [
      ['idle', ['idle','breath','stand']],
      ['locomotion', ['walk','run','stride']],
      ['interaction', ['talk','speak','gesture','interact','reach']]
    ] as const) {
      if(!names.some(n=>keywords.some(k=>n.includes(k)))) reasons.push('Missing '+label+' animation clip');
    }
    if(metrics.heightMetres < 1.2 || metrics.heightMetres > 2.7) reasons.push('Character scale outside provisional human-scale range');
  }
  return {verdict: reasons.length ? 'reject' : 'visual-review', reasons};
}
