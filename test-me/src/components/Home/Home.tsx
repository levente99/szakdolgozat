import React, { Component } from 'react';

interface HomeProps {
    testName: string;
    firstName: string;
    lastName: string;
    createdTime: string;
    deadline: string;
    testTime: number;
    questionNumber: number;
    xp: number;
}

export default class Home extends React.Component<HomeProps> {
    constructor(props: HomeProps) {
        super(props);
        this.state = {
        }
    }


    componentDidMount() {
        fetch(`https://localhost:44369/api/users/fetch-from-session`, { method: 'GET', credentials: "include", mode: 'cors' })
    }

    render() {

        return (
            <>
                <h1>Home</h1>
            </>
        )
    }
}
