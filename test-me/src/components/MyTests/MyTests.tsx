import React, { Component } from 'react';
import { Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Gameboy } from './Gameboy/Gameboy';
import './MyTests.css';

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
                    ]
                },
                finished: "",
                earnedXp: 0
            }
        ],
        order: 0
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
        var userTestCopy = [...this.state.usersTests];
        // this.state.usersTests.map((ut) => ut.finished == null ? ut.finished == "1111-11-11" : null)
        const orderedTests = () => {
            switch (this.state.order) {
                case 0:
                    userTestCopy.sort((a, b) => a.test.created < b.test.created ? 1 : -1);
                    break;
                case 1:
                    userTestCopy.sort((a, b) => a.test.created > b.test.created ? 1 : -1);
                    break;
                case 2:
                    userTestCopy.sort((a, b) => a.finished > b.finished ? 1 : -1);
                    break;
                default:
                    break;
            }
            console.log(userTestCopy.map(ut => console.log(ut)))
            return userTestCopy.map((userTest, i) =>
                <Gameboy
                    key={i}
                    id={userTest.test.id}
                    testName={userTest.test.title}
                    firstName={userTest.user.firstName}
                    lastName={userTest.user.lastName}
                    createdTime={userTest.test.created.split('T')[0]}
                    deadline={userTest.test.deadline.split('T')[0]}
                    earnedXp={userTest.earnedXp}
                    finished={userTest.finished}
                    testTime={this.convertSecToMin(userTest.test.questions.reduce(function (a, b) {
                        return +a + +b.timeLimit;
                    }, 0))}
                    questionNumber={userTest?.test?.questions?.length}
                    xp={userTest.test.questions.reduce(function (a, b) {
                        return +a + +b.xp;
                    }, 0)}
                />
            );
        }


        return (
            this.state.userId == "" ? <div className="alert alert-danger" role="alert">Jelentkezz be ha meg szeretnéd nézni a tesztjeidet!</div> :
                this.state.usersTests[0].test.id == "" ? <div className="alert alert-success" role="alert">Nincsennek tesztek</div> :
                    <div className="mytests-container">
                        <DropdownButton id="mytests-dropdown-button" title="Rendezés">
                            <Dropdown.Item onClick={() => this.setState({ order: 0 })}>Legújabb</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.setState({ order: 1 })}>Legrégebbi</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.setState({ order: 2 })}>Kitöltetlenek</Dropdown.Item>
                        </DropdownButton>
                        <div className="gameboys-container">
                            <Scrollbars>
                                {orderedTests()}
                            </Scrollbars>
                        </div>
                    </div>
        )
    }

    convertSecToMin(value: number): string {
        return Math.floor(value / 60) + ":" + (value % 60 ? value % 60 : '00')
    }

}