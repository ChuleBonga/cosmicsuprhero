# Pre-save conversion contract (development, not production-approved)

Two paths only **within the game**:
- **Earned journey:** Meditate through Finale, all sixteen musical chapters, sixteen
  stars and final turnaround. Unlock link without requesting personal information.
  Chapter I campfire does not qualify. This path is not implemented until the
  complete album experience is shipped.
- **Direct access:** Name and email through a well-labeled direct-access form.
  Email updates are separately, explicitly optional; never equate a request
  for the link with consent to promotional email. Server-side registration
  must succeed before giving a link. Never save personal information in local
  storage, source control, or analytics.

Source: Artist-supplied smartlink https://share.amuse.io/album/cosmicsuprhero-arcturian-awakening
("known user-shared", not independently confirmed to resolve at this moment).

Vercel Function: /api/presave-access. MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID,
MAILCHIMP_SERVER_PREFIX are required; absent configuration yields a 503.
Do not claim email capture or reveal a pre-save link on a failed request.
Provider permission and privacy/retention documentation require review.
Distributed abuse protections, service credentials, consent testing, and
working opt-out process are production blockers.

The main landing page currently includes multiple standalone pre-save anchors.
They must be migrated to the direct gateway in the same reviewed release, not
silently broken in an isolated chapter preview.

Narrative conflict: Awaken Now is album track 14; Gloriously is 15, Finale 16.
The final link reveal belongs in Finale, following the 16-star turnaround.
Never use Chapter I's end screen as the album finale.

No physical-device approval, secure endpoint validation, or provider setup
has been completed yet. Keep all changes isolated from production.
