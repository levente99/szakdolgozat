import React from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import './QuestionType.css';

interface QuestionTypeProps {
    problem: string;
    isQuestionQuiz: boolean;
}


export default class extends React.Component<QuestionTypeProps>{
    componentDidMount() {
        Array.from(document.getElementsByClassName('navbar') as HTMLCollectionOf<HTMLElement>)![0].style.display = "none";
    }

    componentWillUnmount() {
        Array.from(document.getElementsByClassName('navbar') as HTMLCollectionOf<HTMLElement>)![0].style.display = "flex";
    }
    render() {
        return (
            <div className="question-type-container" >
                <div className="row">
                    <div className="question-type-img">
                        {this.props.isQuestionQuiz ? <img src="/img/quiz_icon.png" /> : <img src="/img/true_false_icon.png" />}
                    </div>
                    <div className="question-type-text">
                        {this.props.problem}
                    </div>
                    <div className="question-type-timer">
                        <CountdownCircleTimer
                            isPlaying
                            duration={3}
                            colors={[
                                ['#004777', 0.33],
                                ['#F7B801', 0.33],
                                ['#A30000', 0.33],
                            ]}>
                            {({ remainingTime }) => remainingTime}
                        </CountdownCircleTimer>
                    </div>
                </div>
            </div>
        )
    }
}
