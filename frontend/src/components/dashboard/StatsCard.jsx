const StatsCard = ({ title, value }) => {
  return (
    <div className="p-4 bg-white/10 rounded-xl text-white">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
};

export default StatsCard;