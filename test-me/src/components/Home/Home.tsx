import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import configData from '../../config.json';
import Navigation from '../common/Navigation';
import './Home.css';

interface HomeProps {
}

interface HomeState {
    userTestsStatus: {
        completed: number
        notCompleted: number,
        allXp: number,
        error: string
    },
    user: {
        firstName: string,
        lastName: string
    }
}

export default class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
        this.state = {
            userTestsStatus: {
                completed: 0,
                notCompleted: 0,
                allXp: 0,
                error: ""
            },
            user: {
                firstName: "",
                lastName: ""
            }
        }
    }

    componentDidMount() {
        fetch(`${configData.SERVER_URL}/users/fetch-from-session`, { method: 'GET', credentials: 'include' })
            .then(function (body) {
                return body.text();
            }).then((response) => {
                fetch(`${configData.SERVER_URL}/users-tests/status/${response}`, { method: 'GET' })
                    .then(response => response.json())
                    .then(data => {
                        this.setState({ userTestsStatus: data });
                    });
                fetch(`${configData.SERVER_URL}/users/${response}`, { method: 'GET' })
                    .then(response => response.json())
                    .then(data => {
                        this.setState({ user: data });
                    });
            });
    }

    render() {
        const progressBarData = () => {
            var xp = this.state.userTestsStatus.allXp;
            if (xp < 5000) {
                return { min: 0, max: 5000, minLevel: 1, maxLevel: 2 }
            } else if (xp > 5000 && xp < 10000) {
                return { min: 5000, max: 10000, minLevel: 2, maxLevel: 3 }
            } else if (xp > 10000 && xp < 15000) {
                return { min: 10000, max: 15000, minLevel: 3, maxLevel: 4 }
            } else if (xp > 15000 && xp < 20000) {
                return { min: 15000, max: 20000, minLevel: 4, maxLevel: 5 }
            } else if (xp > 20000 && xp < 25000) {
                return { min: 20000, max: 25000, minLevel: 5, maxLevel: 6 }
            } else if (xp > 25000 && xp < 30000) {
                return { min: 25000, max: 30000, minLevel: 6, maxLevel: 7 }
            } else if (xp > 30000 && xp < 35000) {
                return { min: 30000, max: 35000, minLevel: 7, maxLevel: 8 }
            } else if (xp > 35000 && xp < 40000) {
                return { min: 35000, max: 40000, minLevel: 8, maxLevel: 9 }
            } else {
                return { min: 40000, max: 50000, minLevel: 9, maxLevel: 10 }
            }
        }
        return (
            <>
                <Navigation renderNav={true} />
                {this.state.user.firstName == "" ? <div className="alert alert-danger" role="alert">Jelentkezz be ha meg szeretnéd nézni a tesztjeidet!</div> :
                    <div className="home-container">
                        <div className="home-data">
                            <div className="home-name">{this.state.user.firstName + " " + this.state.user.lastName}</div>
                            <div className="home-xp-label">Összegyűjtött pontjaid:</div>
                            <div className="home-all-earned-xp">
                                <div className="current-level">{progressBarData().minLevel}</div>
                                <div className="next-level">{progressBarData().maxLevel}</div>
                                <ProgressBar className="home-progress" animated now={this.state.userTestsStatus.allXp} min={progressBarData().min} max={progressBarData().max} />
                            </div>
                            <div className="completed-test-count-container">
                                <div className="complete-img">✔️</div>
                                <div className="complete-text">{this.state.userTestsStatus.completed} db kitöltött teszted van</div>
                            </div>
                            <div className="not-completed-test-count-container">
                                <div className="not-complete-img">❌</div>
                                <div className="not-complete-text">{this.state.userTestsStatus.notCompleted} db kitöltetlen teszted van</div>
                            </div>
                        </div>
                    </div>}
            </>
        )
    }
}
