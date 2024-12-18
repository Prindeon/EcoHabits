import "./InfoBox.css"
import React from 'react';

interface InfoBoxProps {
    title: string;
    description: string;
    italicDescription?: boolean;
}

// reusable InfoBox to display information
const InfoBox: React.FC<InfoBoxProps> = ({ title, description, italicDescription }) => {
    return (
        <article className="info-box">
            <h3>{title}</h3>
            <p style={{ fontStyle: italicDescription ? 'italic' : 'normal' }}>{description}</p>
        </article>
    )
}
export default InfoBox;