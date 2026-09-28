import "./StatsCard.css";

export default function StatsCard({
    title,
    value,
    icon,
    color
}) {
    return (
        <div className="stats-card">

            <div
                className="stats-icon"
                style={{ background: color }}
            >
                {icon}
            </div>

            <div className="stats-info">
                <h4>{title}</h4>
                <h2>{value}</h2>
            </div>

        </div>
    );
}