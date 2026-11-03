/**
 * Artist-supplied 16-track order from v3 source brief. Treat as production
 * metadata pending final album confirmation; NOT permission to stream masters.
 * The newer engineering directive controls narrative placement.
 */
export const ALBUM_TRACKS = [
  { id: 'meditate', title: 'Meditate' },
  { id: 'first_contact', title: 'First Contact' },
  { id: 'precipice', title: 'Precipice' },
  { id: 'credos_words', title: "Credo's Words" },
  { id: 'dawning', title: 'Dawning' },
  { id: 'rustic_fire', title: 'Rustic Fire' },
  { id: 'xaba', title: 'Xaba' },
  { id: 'mama_calls_me_chule', title: 'Mama Calls Me Chule' },
  { id: 'chords_for_pondering', title: 'Chords for Pondering' },
  { id: 'peace_for_the_soul', title: 'Peace for the Soul' },
  { id: 'songs_sent_to_god', title: 'Songs Sent to God' },
  { id: 'emancipated', title: 'Emancipated' },
  { id: 'the_world_is_ours', title: 'The World Is Ours' },
  { id: 'awaken_now', title: 'Awaken Now' },
  { id: 'gloriously', title: 'Gloriously' },
  { id: 'finale', title: 'Finale' }
] as const;

export type TrackId = typeof ALBUM_TRACKS[number]['id'];
export type PreviewStatus = 'preview-cleared' | 'pending';
export const PREVIEW_STATUS: Readonly<Record<TrackId, PreviewStatus>> = {
  meditate: 'pending',
  first_contact: 'preview-cleared',
  precipice: 'pending',
  credos_words: 'pending',
  dawning: 'pending',
  rustic_fire: 'pending',
  xaba: 'pending',
  mama_calls_me_chule: 'pending',
  chords_for_pondering: 'pending',
  peace_for_the_soul: 'pending',
  songs_sent_to_god: 'pending',
  emancipated: 'pending',
  the_world_is_ours: 'pending',
  awaken_now: 'pending',
  gloriously: 'pending',
  finale: 'pending'
};
// preview-cleared denotes inclusion in the artist-provided v3 preview package
// ONLY; final cut-point and public release approvals still remain pending.
export const FIRST_PREVIEW_AUDIO = '/audio/pickup_first_contact.m4a';
