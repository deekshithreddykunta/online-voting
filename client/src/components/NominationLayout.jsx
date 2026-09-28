import "./NominationLayout.css";

export default function NominationLayout({
    title,
    subtitle,
    step,
    totalSteps,
    children,
    onPrevious,
    onNext,
    previousText = "← Previous",
    nextText = "Next →",
    hidePrevious = false
}) {

    const progress = (step / totalSteps) * 100;

    const steps = [
        "Position",
        "Personal",
        "Election",
        "Qualification",
        "Manifesto",
        "Documents",
        "Declaration"
    ];

    return (

        <div className="nomination-layout">

            <div className="nomination-header">

                <h1>Candidate Nomination Form</h1>

                <p>
                    {subtitle}
                </p>

            </div>

            <div className="progress">

                <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                />

            </div>

            

            <div className="wizard-card">


                {children}

                <div className="wizard-buttons">

                    {!hidePrevious && (

                        <button
                            className="back-btn"
                            onClick={onPrevious}
                        >
                            {previousText}
                        </button>

                    )}

                    <button
                        className="next-btn"
                        onClick={onNext}
                    >
                        {nextText}
                    </button>

                </div>

            </div>

        </div>

    );

}