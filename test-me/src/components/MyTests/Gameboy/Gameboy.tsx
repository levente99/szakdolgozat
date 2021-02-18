import { ReactNode } from "react";
import "./Gameboy.css";

interface GameboyProps {
    testName: string;
    firstName: string;
    lastName: string;
    createdTime: string;
    deadline: string;
    testTime: number;
    questionNumber: number;
    xp: number;
}

export const Gameboy: React.FC<GameboyProps> = ({ testName, firstName, lastName, createdTime, deadline, testTime, questionNumber, xp }: GameboyProps) => {
    return (
        <div className="gameboy">
            <div className="screen-cont">
                <div className="screen">
                    <div className="header"></div>
                    <div className="test-name">{testName}</div>
                    <div className="test-name">{firstName + " " + lastName}</div>
                    <div className="test-create-dates">Kiírva: {createdTime}</div>
                    <div className="test-deadline">Kitöltési határidő: {deadline}</div>
                </div>
            </div>
            <div className="controls-cont">
                <div className="btn-direction">
                    <div className="vertical"></div>
                    <div className="horizontal"></div>
                    <div className="stopwatch-icon">⏱️</div>
                    <div className="test-time">{testTime}</div>
                </div>
                <div className="btn-AB">
                    <div className="question-number">{questionNumber}</div>
                    <div className="question-number-label">Kérdések</div>
                    <div className="xp-number">{xp}</div>
                    <div className="xp-number-label">XP</div>
                </div>
                <div className="btn-select"></div>
                <div className="btn-start"></div>
                <div className="btn-start-label">Kezdés</div>
            </div>
            <div className="speakers"></div>
            <div className="on-off">off-on</div>
            <div className="phones">phones</div>
        </div>
    );
}
