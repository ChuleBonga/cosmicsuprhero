type AssetCreditNoteProps = {
  credit?: string;
  license?: string;
  sourceUrl?: string;
};

export function AssetCreditNote({ credit, license, sourceUrl }: AssetCreditNoteProps) {
  if (!credit && !license && !sourceUrl) return null;

  return (
    <p className="font-body text-[0.62rem] uppercase leading-relaxed tracking-[0.2em] text-archive-amber/45">
      {credit ? <span>{credit}</span> : null}
      {credit && license ? <span aria-hidden="true"> / </span> : null}
      {license ? <span>{license}</span> : null}
      {(credit || license) && sourceUrl ? <span aria-hidden="true"> / </span> : null}
      {sourceUrl ? (
        <a className="underline decoration-archive-amber/20 underline-offset-4 transition hover:text-archive-amber" href={sourceUrl} target="_blank" rel="noreferrer">
          Source
        </a>
      ) : null}
    </p>
  );
}

