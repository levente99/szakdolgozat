import React, { Component } from 'react'
import { Gameboy } from './Gameboy/Gameboy'

export default class MyTests extends Component {
    state = {
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
        fetch('https://localhost:44369/api/users-tests/01c18f63-08b8-4407-bd2d-023844efec23', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(response => {
                this.setState({ usersTests: response });
            })
            .catch(error => this.setState({
                usersTests: error
            }));
    }

    render() {
        return (
            this.state.usersTests[0].test.id == "" ? <div className="alert alert-success" role="alert">Nincsennek tesztek</div> :
                this.state.usersTests.map((userTest) =>
                    <Gameboy
                        key={userTest.id}
                        testName={userTest.test.title}
                        firstName={userTest.user.firstName}
                        lastName={userTest.user.lastName}
                        createdTime={userTest.test.created.split('T')[0]}
                        deadline={userTest.test.deadline.split('T')[0]}
                        testTime={userTest.test.questions.reduce(function (a, b) {
                            return +a + +b.timeLimit;
                        }, 0)}
                        questionNumber={userTest?.test?.questions?.length}
                        xp={userTest.test.questions.reduce(function (a, b) {
                            return +a + +b.xp;
                        }, 0)}
                    />
                )
        )
    }


}