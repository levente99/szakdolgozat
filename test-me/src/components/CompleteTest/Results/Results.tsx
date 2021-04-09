import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import configData from '../../../config.json';
import confetti from 'canvas-confetti';
import './Results.css';

interface ResultsProps {
    testId: string
}

interface userTest {
    earnedXp: number;
    user: {
        userName: string;
    }
}

interface ResultsState {
    userTests: userTest[];
}

export default class Results extends Component<ResultsProps, ResultsState> {

    constructor(props: ResultsProps) {
        super(props);
        this.state = {
            userTests: [
                {
                    earnedXp: 0,
                    user: {
                        userName: ""
                    }
                },
            ]
        }
    }

    componentDidMount() {
        Array.from(document.getElementsByClassName('navbar') as HTMLCollectionOf<HTMLElement>)![0].style.display = "none";
        fetch(`${configData.SERVER_URL}/users-tests/test/${this.props.testId}`)
            .then(response => response.json())
            .then(data => {
                this.setState({ userTests: data });
                this.tossConfetti();
            });
    }

    componentWillUnmount() {
        Array.from(document.getElementsByClassName('navbar') as HTMLCollectionOf<HTMLElement>)![0].style.display = "flex";
    }

    render() {
        return (
            <>
                <div className="results-background">
                    <div className="podium-charts-full-width">
                        <Link to="/" className="go-home-button">Kilépés</Link>
                        <div className="podium-charts-container-center">
                            <div className="podium-charts-container">
                                <div data-functional-selector="place-1" className="first-podium-container">
                                    <div data-functional-selector="winner" className="first-podium-name-wrap">
                                        <div font-size="5.8" data-functional-selector="player-name" className="first-podium-name">{this.state.userTests[0].user.userName}</div>
                                    </div>
                                    <div data-functional-selector="ranking-medal-gold" className="first-podium-img">🥇</div>
                                    <div data-functional-selector="total-score" className="first-podium-xp">{this.state.userTests[0].earnedXp}</div>
                                </div>
                                <div data-functional-selector="place-2" className="second-podium-container">
                                    <div data-functional-selector="winner" className="second-podium-name-wrap">
                                        <div font-size="5.8" data-functional-selector="player-name" className="second-podium-name">{this.state?.userTests[1]?.user?.userName}</div>
                                    </div>
                                    <div data-functional-selector="ranking-medal-silver" className="second-podium-img">🥈</div>
                                    <div data-functional-selector="total-score" className="second-podium-xp">{this.state.userTests[1]?.earnedXp}</div>
                                </div>
                                <div data-functional-selector="place-3" className="third-podium-container">
                                    <div data-functional-selector="winner" className="third-podium-name-wrap">
                                        <div font-size="5.8" data-functional-selector="player-name" className="third-podium-name">{this.state.userTests[2]?.user?.userName}</div>
                                    </div>
                                    <div data-functional-selector="ranking-medal-gold" className="third-podium-img">🥉</div>
                                    <div data-functional-selector="total-score" className="third-podium-xp">{this.state.userTests[2]?.earnedXp}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="table-container">
                        <ul className="responsive-table">
                            <li className="table-header">
                                <div className="col col-1">#</div>
                                <div className="col col-2">Felhasználónév</div>
                                <div className="col col-3">XP</div>
                            </li>
                            {this.state.userTests.slice(3,).map((userTest, index) => {
                                return <li className="table-row">
                                    <div className="col col-1">{index + 3}</div>
                                    <div className="col col-2">{userTest.user.userName}</div>
                                    <div className="col col-3">{userTest.earnedXp}</div>
                                </li>
                            })}
                        </ul>
                    </div>
                </div>
            </>
        )
    }

    tossConfetti = () => {
        confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#FFD700'],
            decay: 0.94,
            scalar: 1.2
        });
        confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#FFD700'],
            decay: 0.94,
            scalar: 1.2
        });
    }
}

