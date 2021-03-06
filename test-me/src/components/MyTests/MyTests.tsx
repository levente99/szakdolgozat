import React, { Component } from 'react';
import { Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Gameboy } from './Gameboy/Gameboy';
import configData from '../../config.json';
import './MyTests.css';
import Navigation from '../common/Navigation';

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
                    userId: "",
                    user: {
                        firstName: "",
                        lastName: ""
                    },
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
        fetch(`${configData.SERVER_URL}/users/fetch-from-session`, {
            method: 'GET', credentials: "include",
            mode: 'cors'
        }).then(function (body) {
            return body.text();
        }).then((response) => {
            this.setState({ userId: response });
            fetch(`${configData.SERVER_URL}/users-tests/${response}`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({ usersTests: response });
                })
        });
    }

    getDate = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        return yyyy + '-' + mm + '-' + dd;
    }

    render() {
        var userTestCopy = [...this.state.usersTests];
        const orderedTests = () => {
            switch (this.state.order) {
                case 0:
                    userTestCopy.sort((a, b) => a.test.created < b.test.created ? 1 : -1);
                    break;
                case 1:
                    userTestCopy.sort((a, b) => a.test.created > b.test.created ? 1 : -1);
                    break;
                case 2:
                    userTestCopy.sort((a, b) => a.finished != null ? 1 : -1);
                    break;
                default:
                    break;
            }
            return userTestCopy.map((userTest, i) =>
                <Gameboy
                    key={i}
                    id={userTest.test.id}
                    testName={userTest.test.title}
                    firstName={userTest.test.user.firstName}
                    lastName={userTest.test.user.lastName}
                    createdTime={userTest.test.created.split('T')[0]}
                    deadline={userTest.test.deadline.split('T')[0]}
                    currentDate={this.getDate()}
                    earnedXp={userTest.earnedXp}
                    finished={userTest.finished}
                    testTime={this.convertSecToMin(userTest.test.questions.reduce(function (a, b) {
                        return +a + +b.timeLimit;
                    }, 0))}
                    questionNumber={userTest?.test?.questions?.length}
                    xp={userTest.test.questions.reduce(function (a, b) {
                        return +a + +b.xp;
                    }, 0)}
                    thisIsMyTest={userTest.test.userId == this.state.userId}
                />
            );
        }

        return (
            <>
                <Navigation renderNav={true} />
                {this.state.userId == "" ? <div className="alert alert-danger" role="alert">Jelentkezz be ha meg szeretnéd nézni a tesztjeidet!</div> :
                    this.state.usersTests.length == 0 ? <div className="alert alert-success" role="alert">Nincsennek tesztek</div> :
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
                        </div>}
            </>
        )
    }

    convertSecToMin(value: number): string {
        return Math.floor(value / 60) + ":" + (value % 60 ? value % 60 : '00')
    }

}