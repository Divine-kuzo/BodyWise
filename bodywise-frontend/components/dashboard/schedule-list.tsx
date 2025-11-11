interface ScheduleItem {
  date: string;
  time: string;
  patient?: string;
  type?: string;
}

interface ScheduleListProps {
  heading: string;
  items: ReadonlyArray<ScheduleItem>;
}

export function ScheduleList({ heading, items }: ScheduleListProps) {
  return (
    <div className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
      <h3 className="text-sm font-semibold text-[#3a2218]">{heading}</h3>
      <div className="mt-6 space-y-4">
        {items.map((item, index) => (
          <div
            key={`${item.date}-${item.time}-${index}`}
            className="rounded-2xl bg-[#f9f0e6] px-4 py-3"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a1897c]">
              {item.date}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#3a2218]">
              {item.time}
            </p>
            {item.patient ? (
              <p className="text-sm text-[#6a4a3a]">With {item.patient}</p>
            ) : null}
            {item.type ? (
              <p className="text-xs text-[#80685b]">{item.type}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}


