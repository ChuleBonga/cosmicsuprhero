import { ALBUM_TRACKS } from './AlbumJourney';
import type { TrackId } from './AlbumJourney';

/** Completion of Chapter I is never completion of the full album pilgrimage. */
export interface FullJourneyCompletion {
  finaleResolved: boolean;
  awakenedStars: number;
  experiencedTracks: readonly TrackId[];
}
export function earnedPresaveAccess(completion:FullJourneyCompletion):boolean {
  const expected=ALBUM_TRACKS.map(t=>t.id);
  return completion.finaleResolved===true &&
    completion.awakenedStars===16 &&
    completion.experiencedTracks.length===expected.length &&
    expected.every((id,i)=>completion.experiencedTracks[i]===id);
}
export const INCOMPLETE_JOURNEY:FullJourneyCompletion={
  finaleResolved:false,awakenedStars:0,experiencedTracks:[]
};
