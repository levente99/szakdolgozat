import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./Gameboy.css";

interface GameboyProps {
    id: string;
    testName: string;
    firstName: string;
    lastName: string;
    createdTime: string;
    deadline: string;
    currentDate: string;
    testTime: string;
    questionNumber: number;
    xp: number;
    finished: string;
    earnedXp: number;
    thisIsMyTest: boolean;
}

export const Gameboy: React.FC<GameboyProps> = ({ id, testName, firstName, lastName, createdTime, deadline, testTime, questionNumber, xp, finished, earnedXp, thisIsMyTest, currentDate }: GameboyProps) => {
    
    return (
        <div className={thisIsMyTest ? "gameboy finished-gameboy-color" : 
            finished === null ? 
                deadline < currentDate ? "gameboy finished-gameboy-color" : "gameboy" 
            : "gameboy finished-gameboy-color"}>
            <div className="screen-cont">
                <div className="screen">
                    <div className="header"></div>
                    <div className="test-name">{testName}</div>
                    <div className="test-name">{firstName + " " + lastName}</div>
                    {thisIsMyTest ? 
                        null : 
                        finished === null ? 
                            deadline < currentDate ?  
                                <div className="gameboy-deadline">Lejárt a határidő</div> :
                                null
                            : <div className="gameboy-earned-xp-number">{earnedXp}</div>}
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
                {
                    thisIsMyTest || (deadline < currentDate) ? (
                        <>
                            <Link to={`/results/${id}`} className="btn-start-finished" />
                            <div className="btn-start-label">Eredmények</div>
                        </>
                    ) : (
                        finished == null ? (
                            <>
                                <Link to={`/play/${id}`} className="btn-start" />
                                <div className="btn-start-label">Kezdés</div>
                            </>
                        ) : (
                            <>
                                <Link to={`/results/${id}`} className="btn-start-finished" />
                                <div className="btn-start-label">Eredmények</div>
                            </>
                        )
                    )
                }
            </div>
            <div className="speakers"></div>
            <div className="on-off">off-on</div>
            <div className="phones">phones</div>
        </div>
    );
}
