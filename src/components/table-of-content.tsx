import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";

interface TableOfContentsProps {
  items: Array<{ id: string; title: string; level: number }>;
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  className,
}) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const offsets = items.map((item) => {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          return { id: item.id, top: rect.top };
        }
        return null;
      });

      const closest = offsets
        .filter((offset) => offset && offset.top >= 0)
        .sort((a, b) => a!.top - b!.top)[0];

      if (closest && closest.id !== activeId) {
        setActiveId(closest.id);
      }
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items, activeId]);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            `text-base leading-6 transition-colors ${
              activeId === item.id
                ? "text-[#0B3D91] font-medium"
                : "text-[#4F4F4F] hover:text-[#0B3D91]"
            }`,
            className
          )}
          style={{
            paddingLeft: `${(item.level - 2) * 10}px`,
          }}
          onClick={(e) => {
            e.preventDefault();
            const targetElement = document.getElementById(item.id);
            if (targetElement) {
              const yOffset = -90;
              const yPosition =
                targetElement.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset;
              window.scrollTo({
                top: yPosition,
                behavior: "smooth",
              });
            }
          }}
        >
          {item.title}
        </a>
      ))}
    </div>
  );
};

export default TableOfContents;
