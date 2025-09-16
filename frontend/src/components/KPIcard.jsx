export default function KPIcard({ title, value }) {
  return (
    <div className="card">
      <div className="text-sm">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
