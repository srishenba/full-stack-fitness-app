const AnalysisCard = ({ data }) => {
  return (
    <div className="p-4 bg-white/10 rounded-xl text-white">
      <h2>{data.title}</h2>
      <p>{data.description}</p>
      <p>{data.result}</p>
    </div>
  );
};

export default AnalysisCard;