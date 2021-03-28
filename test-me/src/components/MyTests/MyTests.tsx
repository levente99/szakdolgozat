import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { Gameboy } from './Gameboy/Gameboy'

export default class MyTests extends Component {
    state = {
        userId: "",
        usersTests: [
            {
                id: 0,
                user: {
                    firstName: "",
                    lastName: "",
                },
                test: {
                    id: "",
                    description: "",
                    title: "",
                    created: "",
                    deadline: "",
                    questions: [
                        {
                            "timeLimit": 0,
                            "xp": 0
                        }
                    ],
                    finished: ""
                }
            }
        ]
    }

    componentDidMount() {
        fetch(`https://localhost:44369/api/users/fetch-from-session`, {
            method: 'GET', credentials: "include",
            mode: 'cors'
        }).then(function (body) {
            return body.text();
        }).then((response) => {
            this.setState({ userId: response });
            fetch(`https://localhost:44369/api/users-tests/${response}`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({ usersTests: response });
                })
        });
    }

    render() {
        return (
            this.state.userId == "" ? <div className="alert alert-danger" role="alert">Jelentkezz be ha meg szeretnéd nézni a tesztjeidet!</div> :
                this.state.usersTests[0].test.id == "" ? <div className="alert alert-success" role="alert">Nincsennek tesztek</div> :
                    this.state.usersTests.map((userTest) =>
                        <Gameboy
                            id={userTest.test.id}
                            key={userTest.id}
                            testName={userTest.test.title}
                            firstName={userTest.user.firstName}
                            lastName={userTest.user.lastName}
                            createdTime={userTest.test.created.split('T')[0]}
                            deadline={userTest.test.deadline.split('T')[0]}
                            testTime={this.convertSecToMin(userTest.test.questions.reduce(function (a, b) {
                                return +a + +b.timeLimit;
                            }, 0))}
                            questionNumber={userTest?.test?.questions?.length}
                            xp={userTest.test.questions.reduce(function (a, b) {
                                return +a + +b.xp;
                            }, 0)}
                        />
                    )
        )
    }

    convertSecToMin(value: number): string {
        return Math.floor(value / 60) + ":" + (value % 60 ? value % 60 : '00')
    }

}