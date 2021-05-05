import './CompleteTest.css';
import React, { Component } from 'react'
import { Spinner } from 'react-bootstrap';
import QuestionType from './QuestionType/QuestionType';
import Question from './Question/Question';
import configData from '../../config.json';
import Results from './Results/Results';

interface CompleteTestProps {
}

interface answer {
    responseTime: number;
    userAnswer: number;
}

interface CompleteTestState {
    userTest: {
        id: string;
        test: {
            id: string;
            description: string;
            userId: string;
            title: string;
            created: string;
            deadline: string;
            questions: [
                {
                    id: number
                    problem: string;
                    answerOne: string;
                    answerTwo: string;
                    answerThree?: string;
                    answerFour?: string;
                    timeLimit: number;
                    xp: number;
                    correctAnswer: number;
                }
            ]
        }
    },
    answers: answer[],
    showTitle: boolean,
    showQuestions: boolean,
    showResults: boolean,
    showedQuestion: number,
    showQuestionType: boolean,
    allEarnedXp: number,
}

export default class CompleteTest extends React.Component<CompleteTestProps, CompleteTestState> {

    constructor(props: CompleteTestProps) {
        super(props);
        this.state = {
            userTest: {
                id: '',
                test: {
                    id: '',
                    description: '',
                    userId: '',
                    title: '',
                    created: '',
                    deadline: '',
                    questions: [
                        {
                            id: 0,
                            problem: '',
                            answerOne: '',
                            answerTwo: '',
                            answerThree: '',
                            answerFour: '',
                            timeLimit: 0,
                            xp: 0,
                            correctAnswer: 0
                        },
                    ]
                }
            },
            answers: [],
            showTitle: false,
            showQuestions: false,
            showQuestionType: false,
            showResults: false,
            showedQuestion: 0,
            allEarnedXp: 0
        }

        this.getNextQuestion = this.getNextQuestion.bind(this);
    }

    async componentDidMount() {
        await fetch(`${configData.SERVER_URL}/users/fetch-from-session`, {
            method: 'GET', credentials: "include",
            mode: 'cors'
        }).then(function (body) {
            return body.text();
        }).then((response) => {
            fetch(`${configData.SERVER_URL}/users-tests/${response}/${window.location.href.substring(window.location.href.lastIndexOf('/') + 1)}`, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({ userTest: response[0] });
                })
        });

        this.setState({ showQuestionType: true });
        await this.showQuestionTypeTimeout();
        this.setState({ showQuestionType: false });
    }

    render() {
        return (
            this.state.showResults ? <Results testId={this.state.userTest.test.id} /> :
                this.state.showedQuestion < this.state.userTest.test.questions.length ?
                    this.state.showQuestionType ?
                        <QuestionType
                            problem={this.state.userTest.test.questions[this.state.showedQuestion].problem}
                            isQuestionQuiz={this.state.userTest.test.questions[this.state.showedQuestion].answerFour != null}
                        /> :
                        this.state.userTest.test.title != '' ? <Question
                            id={this.state.userTest.test.questions[this.state.showedQuestion].id}
                            questionNumber={this.state.showedQuestion}
                            problem={this.state.userTest.test.questions[this.state.showedQuestion].problem}
                            answerOne={this.state.userTest.test.questions[this.state.showedQuestion].answerOne}
                            answerTwo={this.state.userTest.test.questions[this.state.showedQuestion].answerTwo}
                            answerThree={this.state.userTest.test.questions[this.state.showedQuestion].answerThree}
                            answerFour={this.state.userTest.test.questions[this.state.showedQuestion].answerFour}
                            timeLimit={this.state.userTest.test.questions[this.state.showedQuestion].timeLimit}
                            xp={this.state.userTest.test.questions[this.state.showedQuestion].xp}
                            correctAnswer={this.state.userTest.test.questions[this.state.showedQuestion].correctAnswer}
                            passAnswerData={this.getNextQuestion}
                        /> : null
                    : <Spinner animation="border" variant="primary" className="centered-big-spinner" />
        )
    }

    async getNextQuestion(answer: number, questionNumber: number, responseTime: number, earnedXp: number) {
        this.setState({ showQuestionType: true });
        this.setState({ answers: this.state.answers.concat({ responseTime: responseTime, userAnswer: answer }), allEarnedXp: this.state.allEarnedXp + earnedXp, showedQuestion: this.state.showedQuestion + 1 })

        await this.showQuestionTypeTimeout();
        if (this.state.showedQuestion == this.state.userTest.test.questions.length) {
            await this.sendResults();
            this.setState({ showResults: true });
        }
        this.setState({ showQuestionType: false });
    }

    sendResults = async () => {
        await fetch(`${configData.SERVER_URL}/users-tests/${this.state.userTest.id}/update-xp/${this.state.allEarnedXp}`, {
            method: 'PUT'
        }).then(() => {
            this.state.answers.forEach(async (answer, index) => {
                await fetch(`${configData.SERVER_URL}/answers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        QuestionId: this.state.userTest.test.questions[index].id,
                        UsersTestId: this.state.userTest.id,
                        ResponseTime: answer.responseTime,
                        UserAnswer: answer.userAnswer
                    })
                })
            })
        })
    }

    showQuestionTypeTimeout = () => {
        return new Promise(res => setTimeout(res, 3000));
    }
}
