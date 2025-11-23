interface ScheduleItem {
  date: string;
  time: string;
  duration?: string;
  patient?: string;
  type?: string;
  title?: string;
  specialist?: string;
  status?: string;
  meeting_link?: string;
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
            className="rounded-2xl bg-[#f9f0e6] px-4 py-3 transition-all hover:bg-[#f0e5d8]"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a1897c]">
                  {item.date}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <p className="text-sm font-semibold text-[#3a2218]">
                    {item.time}
                  </p>
                  {item.duration && (
                    <p className="text-xs text-[#80685b]">
                      • {item.duration}
                    </p>
                  )}
                </div>
                {item.title && (
                  <p className="mt-1 text-sm text-[#6a4a3a]">{item.title}</p>
                )}
                {item.patient && (
                  <p className="text-sm text-[#6a4a3a]">With {item.patient}</p>
                )}
                {item.specialist && (
                  <p className="text-xs text-[#80685b]">{item.specialist}</p>
                )}
                {item.type && (
                  <p className="text-xs text-[#80685b]">{item.type}</p>
                )}
              </div>
              {item.status && (
                <span className="ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize"
                  style={{
                    backgroundColor: item.status === 'scheduled' ? '#d1fae5' : '#fef3c7',
                    color: item.status === 'scheduled' ? '#065f46' : '#92400e'
                  }}
                >
                  {item.status}
                </span>
              )}
            </div>
            {item.meeting_link && (
              <a
                href={item.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center text-xs font-medium text-[#6a4a3a] hover:text-[#523329]"
              >
                Join Meeting →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


