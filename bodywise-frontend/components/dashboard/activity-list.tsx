interface ActivityItem {
  title: string;
  time: string;
  status?: string;
  description?: string;
}

interface ActivityListProps {
  heading: string;
  items: ReadonlyArray<ActivityItem>;
}

export function ActivityList({ heading, items }: ActivityListProps) {
  return (
    <div className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
      <h3 className="text-sm font-semibold text-[#3a2218]">{heading}</h3>
      <ul className="mt-5 space-y-5">
        {items.map((item, index) => (
          <li key={index} className="flex gap-4">
            <span className="relative mt-1 flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d6b28f]/60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#6a4a3a]" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#4b3125]">{item.title}</p>
              <p className="text-xs text-[#80685b]">{item.time}</p>
              {item.description ? (
                <p className="text-xs text-[#a1897c]">{item.description}</p>
              ) : null}
              {item.status ? (
                <span className="inline-flex rounded-full bg-[#f0d5b8]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6a4a3a]">
                  {item.status}
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


