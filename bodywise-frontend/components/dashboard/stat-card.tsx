interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendLabel?: string;
}

export function StatCard({ label, value, trend, trendLabel }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-[#e6d8ce] bg-white px-5 py-6 shadow-[0_25px_70px_-60px_rgba(58,34,24,0.45)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a1897c]">
        {label}
      </p>
      <p className="text-2xl font-semibold text-[#3a2218]">{value}</p>
      {trend ? (
        <p className="text-xs font-semibold text-[#6a4a3a]">
          {trend}
          {trendLabel ? <span className="ml-1 text-[#a1897c]">{trendLabel}</span> : null}
        </p>
      ) : null}
    </div>
  );
}


