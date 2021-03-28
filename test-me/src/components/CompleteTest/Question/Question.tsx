import React, { Component, useEffect } from 'react'
import { Alert, Form } from 'react-bootstrap';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import confetti from 'canvas-confetti';
import './Question.css';

interface QuestionProps {
    id: number;
    questionNumber: number;
    problem: string;
    answerOne: string;
    answerTwo: string;
    answerThree?: string;
    answerFour?: string;
    timeLimit: number;
    xp: number;
    correctAnswer: number;
    passAnswerData: (answer: number, questionId: number, responseTime: number, earnedXp: number) => void;
}

interface QuestionState {
    secondsLeft: number;
    responseTime: number;
    earnedXp: number;
    disableClick: boolean;
    questionBgColors: string[];
}

export default class Question extends React.Component<QuestionProps, QuestionState> {
    constructor(prop: QuestionProps) {
        super(prop);

        this.state = {
            //                 answer 1   answer 2   answer 3   answer 4   background
            questionBgColors: ["#66a3ff", "#FF6868", "#FFAB2C", "#68C95C", "#e0efff"],
            secondsLeft: -1,
            responseTime: -1,
            earnedXp: 0,
            disableClick: false
        }
    }

    componentWillReceiveProps(nextProps: { problem: string; }) {
        this.setState({ secondsLeft: this.props.timeLimit });
    }

    componentWillUnmount() {
        Array.from(document.getElementsByClassName('navbar') as HTMLCollectionOf<HTMLElement>)![0].style.display = "flex";
    }

    componentDidMount() {
        Array.from(document.getElementsByClassName('navbar') as HTMLCollectionOf<HTMLElement>)![0].style.display = "none";
        this.setState({ secondsLeft: this.props.timeLimit });

        let intervalId = setInterval(() => {
            const { secondsLeft } = this.state

            if (secondsLeft > 0) {
                this.setState({ secondsLeft: secondsLeft - 1 });
            } else if (secondsLeft == 0) {
                this.timeOut();
                clearInterval(intervalId);
            }
        }, 1000)
    }

    render() {
        const { problem, answerOne, answerTwo, answerThree, answerFour, timeLimit, xp, correctAnswer } = this.props;


        return (
            <div style={{ backgroundColor: this.state.questionBgColors[4] }} className="create question-container">
                <Form.Group className="question-text">
                    <Form.Label>
                        {problem}
                    </Form.Label>
                    <Form.Group className="asnwer-result popout">
                        {this.state.earnedXp > 0 ? <><Alert className="good-result" variant="success">
                            <p>Helyes válasz!</p>
                            <p>{this.state.earnedXp} XP</p>
                        </Alert> </> : null}

                        {this.state.earnedXp == -1 ? <Alert className="bad-result-text" variant="danger">
                            Rossz válasz 😞
                    </Alert> : null}
                    </Form.Group>
                </Form.Group >


                <div className="question-details">
                    <Form.Group className="time-limit" controlId="formBasicRange">
                        <Form.Label className="time-label">
                            {this.state.disableClick == false ? <CountdownCircleTimer
                                isPlaying
                                duration={this.props.timeLimit}
                                colors={[
                                    ['#004777', 0.33],
                                    ['#F7B801', 0.33],
                                    ['#A30000', 0.33],
                                ]}>
                                {({ remainingTime }) => remainingTime}
                            </CountdownCircleTimer> : null}

                        </Form.Label>
                    </Form.Group>
                </div>

                {
                    answerFour != null ?
                        <Form.Group className="answers">
                            <Form.Group style={{ backgroundColor: this.state.questionBgColors[0] }} className="play-answers-one" id="0" onClick={this.handleAnswerInput}>
                                <Form.Label className="answer-text">{answerOne}</Form.Label>
                            </Form.Group>

                            <Form.Group style={{ backgroundColor: this.state.questionBgColors[1] }} className="play-answers-two" id="1" onClick={this.handleAnswerInput}>
                                <Form.Label className="answer-text">{answerTwo}</Form.Label>
                            </Form.Group>

                            <Form.Group style={{ backgroundColor: this.state.questionBgColors[2] }} className="play-answers-three" id="2" onClick={this.handleAnswerInput}>
                                <Form.Label className="answer-text">{answerThree}</Form.Label>
                            </Form.Group>

                            <Form.Group style={{ backgroundColor: this.state.questionBgColors[3] }} className="play-answers-four" id="3" onClick={this.handleAnswerInput}>
                                <Form.Label className="answer-text">{answerFour}</Form.Label>
                            </Form.Group>
                        </Form.Group> :
                        <Form.Group className="answers">
                            <Form.Group style={{ backgroundColor: this.state.questionBgColors[0] }} className="play-answers-one" id="0" onClick={this.handleAnswerInput}>
                                <Form.Label className="answers-true-label">Igaz</Form.Label>
                            </Form.Group>
                            <Form.Group style={{ backgroundColor: this.state.questionBgColors[1] }} className="play-answers-two" id="1" onClick={this.handleAnswerInput}>
                                <Form.Label className="answers-false-label">Hamis</Form.Label>
                            </Form.Group>
                        </Form.Group>
                }
            </div >
        )
    }

    handleAnswerInput = async (e: React.MouseEvent<HTMLElement>) => {
        const { correctAnswer } = this.props;
        const { disableClick } = this.state;
        this.setState({ disableClick: true });
        if (!disableClick) {
            if (+((e.target as HTMLTextAreaElement).id) != correctAnswer) {
                this.badAnswer(+((e.target as HTMLTextAreaElement).id))
            } else {
                this.goodAnswer(+((e.target as HTMLTextAreaElement).id));
            }
        }

        return 0;
    }

    async timeOut() {
        const { questionNumber } = this.props;
        this.setState({ disableClick: true, earnedXp: -1 });

        const newquestionBgColors = this.state.questionBgColors.slice()
        for (let i = 0; i < this.state.questionBgColors.length - 1; i++) {
            newquestionBgColors[i] = "#ff1919"
        }
        newquestionBgColors[this.props.correctAnswer] = "#09bd57"
        newquestionBgColors[4] = "#ffb8b8"
        this.setState({ questionBgColors: newquestionBgColors })

        await this.afterQuestionTimeout();
        this.props.passAnswerData(-1, questionNumber, -1, 0);
    }

    async badAnswer(answer: number) {
        const { questionNumber } = this.props;
        this.setState({ responseTime: this.props.timeLimit - this.state.secondsLeft, disableClick: true, earnedXp: -1 });
        this.setState({ secondsLeft: -1 });

        const newquestionBgColors = this.state.questionBgColors.slice()
        for (let i = 0; i < this.state.questionBgColors.length - 1; i++) {
            newquestionBgColors[i] = "#ff1919"
        }
        newquestionBgColors[answer] = "#ff9494";
        newquestionBgColors[this.props.correctAnswer] = "#09bd57"
        newquestionBgColors[4] = "#ffb8b8"
        this.setState({ questionBgColors: newquestionBgColors })

        await this.afterQuestionTimeout();
        this.props.passAnswerData(answer, questionNumber, this.state.responseTime, 0);
    }

    async goodAnswer(answer: number) {
        const { questionNumber, timeLimit, xp } = this.props;
        const { secondsLeft, questionBgColors } = this.state;

        this.setState({ disableClick: true });
        let earnedXp = this.props.timeLimit - this.state.secondsLeft == -1 || this.props.timeLimit - this.state.secondsLeft == 0 ? xp : Math.floor((((timeLimit - secondsLeft) / timeLimit) / 2) * xp);

        this.setState({ earnedXp: earnedXp });
        this.setState({ responseTime: this.props.timeLimit - this.state.secondsLeft });
        this.setState({ secondsLeft: -1 });

        const newquestionBgColors = questionBgColors.slice()
        for (let i = 0; i < questionBgColors.length - 1; i++) {
            newquestionBgColors[i] = "#ff1919"
        }
        newquestionBgColors[answer] = "#09bd57"
        newquestionBgColors[4] = "#e8ffea"
        this.setState({ questionBgColors: newquestionBgColors })

        this.tossConfetti()
        await this.afterQuestionTimeout();
        this.props.passAnswerData(answer, questionNumber, this.state.responseTime, earnedXp)
    }

    afterQuestionTimeout = () => {
        return new Promise(res => setTimeout(res, 3000));
    }


    tossConfetti = () => {
        confetti({
            spread: 50,
            startVelocity: 55,
        });
        confetti({
            spread: 80,
        });
        confetti({
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        confetti({
            spread: 150,
            decay: 0.91,
            scalar: 0.8
        });
    }
}