export type PickupId = 'first_contact' | 'xaba';
export class AudioDirector {
  private ctx: AudioContext | null = null;
  private score: HTMLAudioElement | null = null;
  private filter: BiquadFilterNode | null = null;
  private music: GainNode | null = null;
  private pickup: GainNode | null = null;
  private master: GainNode | null = null;
  private started = false;
  private muted = false;
  private travel = 0;
  private activePickup: AudioBufferSourceNode | null = null;
  private token = 0;
  constructor(private readonly status: (message: string) => void) {}
  get isPlaying(){ return !!this.score && !this.score.paused; }
  get isMuted(){ return this.muted; }
  start(): void {
    if (this.started) { this.resume(); return; }
    try {
      // No Audio element or fetch exists before the first intentional gesture.
      const ctx = new AudioContext({ latencyHint: 'interactive' });
      this.ctx = ctx;
      const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 450; filter.Q.value = 0.65;
      const music = ctx.createGain(); music.gain.value = 0.25;
      const pickup = ctx.createGain(); pickup.gain.value = 0.90;
      const master = ctx.createGain(); master.gain.value = this.muted ? 0 : 1;
      this.filter = filter; this.music = music; this.pickup = pickup; this.master = master;
      const score = new Audio();
      this.score = score;
      score.preload = 'none'; score.loop = true; score.src = '/audio/score_awaken_now_loop.m4a';
      score.crossOrigin = 'anonymous';
      ctx.createMediaElementSource(score).connect(filter).connect(music).connect(master).connect(ctx.destination);
      pickup.connect(master);
      score.addEventListener('error', () => this.status('Awaken Now unavailable. Explore silently.'));
      this.started = true;
      this.setTravel(this.travel);
      void ctx.resume();
      void score.play().then(() => this.status('Awaken Now is playing')).catch(() => this.status('Audio blocked. Touch again to enable sound.'));
    } catch { this.status('Audio unavailable. Walking still works.'); }
  }
  setTravel(value: number): void {
    this.travel = Math.max(this.travel, Math.max(0, Math.min(1, value)));
    if (!this.ctx || !this.filter || !this.music) return;
    const t = this.ctx.currentTime;
    this.filter.frequency.setTargetAtTime(450 * Math.pow(11000/450, this.travel), t, 0.26);
    if (!this.activePickup) this.music.gain.setTargetAtTime(0.25 + 0.28 * this.travel, t, 0.5);
  }
  async playPickup(id: PickupId, done: () => void): Promise<void> {
    if (!this.ctx || !this.music || !this.pickup) { this.status('Memory recovered. Preview audio unavailable.'); done(); return; }
    const ctx = this.ctx, music = this.music, destination = this.pickup;
    const token = ++this.token;
    const now = ctx.currentTime;
    music.gain.cancelScheduledValues(now);
    music.gain.setTargetAtTime((0.25 + .28 * this.travel) * .158, now, .085);
    const finish = () => {
      if (this.token !== token) return;
      this.activePickup = null;
      music.gain.setTargetAtTime(.25 + .28 * this.travel, ctx.currentTime, .38);
      done();
    };
    try {
      // Lazy request: only this discovered excerpt, never download the full album.
      const response = await fetch('/audio/pickup_' + id + '.m4a');
      if (!response.ok) throw new Error('Preview audio missing');
      const buf = await ctx.decodeAudioData(await response.arrayBuffer());
      if (token !== this.token) return;
      const source = ctx.createBufferSource();
      source.buffer = buf; source.connect(destination);
      this.activePickup = source;
      source.addEventListener('ended', finish, { once: true });
      await ctx.resume();
      source.start();
      this.status(id === 'xaba' ? 'Xaba excerpt playing' : 'First Contact excerpt playing');
    } catch {
      this.status('Preview unavailable. Memory recorded silently.');
      finish();
    }
  }
  setMuted(value: boolean): void {
    this.muted = value;
    if (this.ctx && this.master) this.master.gain.setTargetAtTime(value ? 0 : 1, this.ctx.currentTime, .09);
  }
  pause(): void { this.score?.pause(); void this.ctx?.suspend(); }
  resume(): void { if (!this.started) return; void this.ctx?.resume(); void this.score?.play().catch(() => {}); }
  soften(): void { if (this.ctx && this.music) this.music.gain.setTargetAtTime(.18, this.ctx.currentTime, .45); }
  destroy(): void { ++this.token; this.score?.pause(); this.activePickup?.stop(); void this.ctx?.close(); }
}
