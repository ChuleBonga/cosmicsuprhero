/**
 * Artist-provided album cover, not the rejected golden-city AI concept boards.
 * Source: 3000 px album art in Arcturian Awakening — Cosmicsuprhero.pdf.
 * Values are sRGB artistic targets, NOT promises of photorealism or literal
 * already-matched framebuffer colors.
 */
export const COVER_PALETTE=Object.freeze({
 skyCobalt:0x384e81,
 skyIndigo:0x30436f,
 sunOrange:0xf65321,
 sunHot:0xf86b1f,
 mountainShadow:0x1a2146,
 mountainMid:0x40527f,
 stoneOchre:0x95673c,
 faceBlueGreen:0x435f82,
 cloakBurgundy:0x7c3f5c
});
// Only a deliberate named art-review camera can enable this alternate grade.
// Visitors at /play/ always receive the unchanged currently published grade.
export function artworkReviewEnabled(search,reviewPose){
 if(!reviewPose)return false;
 const params=new URLSearchParams(search);
 return params.get('look')==='cover';
}
