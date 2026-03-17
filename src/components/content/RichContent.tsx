import type { ContentBlock } from '@/types/wordpress';

interface Props {
  blocks: ContentBlock[];
}

export default function RichContent({ blocks }: Props) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <h2 key={`${block.type}-${index}`} className="font-display text-3xl text-venture-white leading-tight">
              {block.content}
            </h2>
          );
        }

        if (block.type === 'quote') {
          return (
            <blockquote
              key={`${block.type}-${index}`}
              className="border-l border-accent pl-6 text-xl text-venture-white/90 leading-relaxed"
            >
              {block.content}
            </blockquote>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={`${block.type}-${index}`} className="space-y-3 pl-5 text-venture-gray list-disc marker:text-accent">
              {block.items.map((item) => (
                <li key={item} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'image') {
          return (
            <figure key={`${block.type}-${index}`} className="overflow-hidden rounded-sm border border-white/10 bg-venture-charcoal/30">
              <img src={block.src} alt={block.alt} className="w-full object-cover" />
            </figure>
          );
        }

        return (
          <p key={`${block.type}-${index}`} className="text-lg leading-relaxed text-venture-gray">
            {block.content}
          </p>
        );
      })}
    </div>
  );
}