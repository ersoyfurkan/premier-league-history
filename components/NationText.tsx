import { Fragment } from "react";
import UclImage from "@/components/UclImage";
import { nationMentions } from "@/data/nationVisuals";

export default function NationText({ text, imageClassName = "h-5 w-7", includeAdjectives = false }: { text: string; imageClassName?: string; includeAdjectives?: boolean }) {
  const mentions = nationMentions(text, includeAdjectives);
  if (!mentions.length) return <>{text}</>;
  return (
    <>
      {mentions.map((mention, index) => (
        <Fragment key={`${mention.start}-${mention.name}`}>
          {text.slice(index === 0 ? 0 : mentions[index - 1].end, mention.start)}
          <span className="inline-flex items-center gap-2 align-middle">
            <UclImage src={mention.src} alt={`${mention.name} national team crest`} className={imageClassName} />
            <span>{text.slice(mention.start, mention.end)}</span>
          </span>
        </Fragment>
      ))}
      {text.slice(mentions[mentions.length - 1].end)}
    </>
  );
}
