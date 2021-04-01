import React, { Component } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import './Authentication.css';

interface LoginProps {
}

interface LoginState {
    loginValue: {
        userName: string;
        password: string;
        loginError: string;
        loggedIn: boolean;
    },
    registerValue: {
        userRole: string;
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        registerMessage: string;
    }
    loginSignupSwap: boolean;
    loading: boolean;
}

export default class Login extends Component<LoginProps, LoginState> {

    constructor(props: LoginProps) {
        super(props);

        this.state = {
            loginValue: {
                userName: '',
                password: '',
                loggedIn: false,
                loginError: ''
            },
            registerValue: {
                userRole: 'Diák',
                userName: '',
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                registerMessage: ''
            },
            loginSignupSwap: false,
            loading: false
        }

        this.saveInputChange = this.saveInputChange.bind(this);
    }

    componentDidMount() {
        Array.from(document.getElementsByClassName('navbar') as HTMLCollectionOf<HTMLElement>)![0].style.display = "none";
    }

    componentWillUnmount() {
        Array.from(document.getElementsByClassName('navbar') as HTMLCollectionOf<HTMLElement>)![0].style.display = "flex";
    }

    saveInputChange(e: { currentTarget: { value: any; }; preventDefault: () => void; target: { name: any; value: any; }; }) {
        const { name, value } = e.target;

        e.preventDefault();
        if ((e.target as HTMLInputElement).id == 'teacher' || (e.target as HTMLInputElement).id == 'student' || (e.target as HTMLInputElement).id == 'firstName' || (e.target as HTMLInputElement).id == 'lastName' || (e.target as HTMLInputElement).id == 'SignUpInputEmail' || (e.target as HTMLInputElement).id == 'SignUpInputUsername' || (e.target as HTMLInputElement).id == 'SignUpInputPassword' || (e.target as HTMLInputElement).id == 'userRole') {
            this.setState((prevState) => ({ registerValue: { ...prevState.registerValue, [name]: value } }));
        }
        else if ((e.target as HTMLInputElement).id == 'SignInInputUsername' || (e.target as HTMLInputElement).id == 'SignInInputPassword') {
            this.setState((prevState) => ({ loginValue: { ...prevState.loginValue, [name]: value } }));
        }
    }

    getUserId = async () => {
        let userId = await fetch(`https://localhost:44369/api/users/get-user-id?username=${this.state.loginValue.userName}&password=${this.state.loginValue.password}`).then(function (body) {
            return body.text();
        }).then(function (response) {
            return response;
        });
        return userId;
    }

    submitLogin = async () => {
        this.setState({ ...this.state, loading: true });
        await fetch(`https://localhost:44369/api/login`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                mode: 'cors',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName: this.state.loginValue.userName,
                password: this.state.loginValue.password
            })
        }).then(async data => {
            switch (data.status) {
                case 403:
                    this.setState(prevState => ({
                        loginValue: {
                            ...prevState.loginValue,
                            loginError: "Kérlek igazold vissza az email címed."
                        }
                    }));
                    break;
                case 500:
                    this.setState(prevState => ({
                        loginValue: {
                            ...prevState.loginValue,
                            loginError: "Rossz felhasználónév vagy jelszó!"
                        }
                    }));
                    break;
                case 200:
                    await this.getUserId().then(async function (userId) {
                        fetch(`https://localhost:44369/api/users/save-to-session?userId=${userId}`, {
                            method: 'GET',
                            // mode: 'cors',
                            credentials: 'include'
                        });
                    })

                    this.setState(prevState => ({
                        loginValue: {
                            ...prevState.loginValue,
                            loggedIn: true
                        }
                    }));
                    break;
            }
        })

        await this.setState(prevState => ({
            loading: false
        }));
    }



    submitSignin = async () => {
        this.setState({ ...this.state, loading: true });
        await fetch('https://localhost:44369/api/register', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({
                RoleId: this.state.registerValue.userRole == "Diák" ? 1 : 0,
                FirstName: this.state.registerValue.firstName,
                LastName: this.state.registerValue.lastName,
                UserName: this.state.registerValue.userName,
                Email: this.state.registerValue.email,
                Password: this.state.registerValue.password
            })
        }).then(function (body) {
            return body.json();
        }).then((response) => {
            if (!response.succeeded) {
                this.setState(prevState => ({
                    registerValue: {
                        ...prevState.registerValue,
                        registerMessage: response.errors.Password == undefined ? response.errors[0].description : response.errors.Password[0]
                    }
                }));
            } else {
                this.setState(prevState => ({
                    registerValue: {
                        ...prevState.registerValue,
                        registerMessage: "Sikers regisztráció, igazold vissza az e-mail címed és jelentkezz be!"
                    }
                }));
                this.changeContainer();
            }
        });
        await this.setState(prevState => ({
            loading: false
        }));
    }

    render() {
        if (this.state.loginValue.loggedIn) {
            return <Redirect to='/' />;
        }
        return (
            <>
                <div className="login-background">
                    <div className={this.state.loginSignupSwap ? "right-panel-active container" : "container"} id="container">
                        <div className="form-container sign-up-container">
                            <form className="login-form">
                                <h2 className="login-title mb-2">Regisztrálj! 📝</h2>

                                <div className="btn-group btn-group-toggle text-left m-2" style={{ fontSize: '30px' }}>
                                    <label className={this.state.registerValue.userRole == 'Tanár' ? 'btn btn-primary active' : 'btn btn-primary'}>
                                        <div style={{ fontSize: '30px' }}>👩‍🏫</div>
                                        <input type="radio" name="userRole" id="teacher" value="Tanár" onChange={this.saveInputChange} />Tanár
                                </label>
                                    <label className={this.state.registerValue.userRole == 'Diák' ? 'btn btn-primary active' : 'btn btn-primary'}>
                                        <div style={{ fontSize: '30px' }}>👨‍🎓</div>
                                        <input type="radio" name="userRole" id="student" value="Diák" onChange={this.saveInputChange} />Diák
                                </label>
                                </div>
                                <label htmlFor="firstName">Vezetéknév és Keresztnév</label>
                                <div className="input-group">
                                    <input className="form-control input-sm" id="firstName" placeholder="Vezetéknév" name="firstName" onChange={this.saveInputChange} />
                                    <span className="input-group-btn" style={{ width: '0px' }}></span>
                                    <input className="form-control input-sm" id="lastName" placeholder="Keresztnév" name="lastName" onChange={this.saveInputChange} />
                                </div>
                                <div className="form-group text-left mt-3">
                                    <label htmlFor="SignUpInputUsername">Felhasználónév</label>
                                    <input className="form-control" id="SignUpInputUsername" name="userName" onChange={this.saveInputChange} placeholder="Felhasználónév" />
                                </div>
                                <div className="form-group text-left">
                                    <label htmlFor="SignUpInputEmail">E-mail</label>
                                    <input type="email" className="form-control" id="SignUpInputEmail" aria-describedby="emailHelp" name="email" onChange={this.saveInputChange} placeholder="E-mail" />
                                </div>
                                <div className="form-group text-left">
                                    <label htmlFor="SignUpInputPassword">Jelszó</label>
                                    <input type="password" className="form-control" id="SignUpInputPassword" name="password" onChange={this.saveInputChange} placeholder="Jelszó" />
                                </div>
                                {this.state.loading ? <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner> :
                                    <button type="button" onClick={this.submitSignin} className="btn btn-success">Regisztráció</button>
                                }
                            </form>
                        </div>
                        <div className="form-container sign-in-container">
                            <form className="login-form">
                                <h2 className="login-title mb-5">Jelentkezz be! 🔓</h2>

                                <div className="form-group text-left">
                                    <label htmlFor="SignInInputUsername">Felhasználónév</label>
                                    <input className="form-control" id="SignInInputUsername" name="userName" onChange={this.saveInputChange} placeholder="Felhasználónév" />
                                </div>
                                <div className="form-group text-left">
                                    <label htmlFor="SignInInputPassword">Jelszó</label>
                                    <input type="password" className="form-control" id="SignInInputPassword" name="password" onChange={this.saveInputChange} placeholder="Jelszó" />
                                </div>
                                {this.state.loading ? <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner> :
                                    <button type="button" onClick={this.submitLogin} className="btn btn-success">Bejelentkezés</button>
                                }
                            </form>
                        </div>
                        <div className="overlay-container">
                            <div className="overlay">
                                <div className="overlay-panel overlay-left">
                                    {this.state.registerValue.registerMessage != "" ? <Alert color="danger" style={{ backgroundColor: '#75000a' }}>
                                        {this.state.registerValue.registerMessage}
                                    </Alert> : null}
                                    <h1 className="login-title">Üdv újra itt!</h1>
                                    <p>Ahhoz hogy hozzáférj a tesztjeidhez kérlek jelentkezz be!</p>
                                    <button className="login-button.ghost login-button" onClick={() => this.changeContainer()} id="signIn">Bejelentkezés</button>
                                </div>
                                <div className="overlay-panel overlay-right">
                                    {this.state.loginValue.loginError != "" ? <Alert color="danger" style={{ backgroundColor: '#75000a' }}>
                                        {this.state.loginValue.loginError}
                                    </Alert> : null}
                                    {this.state.registerValue.registerMessage == "Sikers regisztráció, igazold vissza az e-mail címed és jelentkezz be!" ? <Alert color="danger" style={{ backgroundColor: '#218838' }}>
                                        {this.state.registerValue.registerMessage}
                                    </Alert> : null}
                                    <h1 className="login-title">Üdv itt!</h1>
                                    <p>Add meg az adataidat és már kezdheted is a teszt készítést!</p>
                                    <button className="login-button.ghost login-button" onClick={() => this.changeContainer()} id="signUp">Regisztráció</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }

    changeContainer() {
        this.setState({ loginSignupSwap: !this.state.loginSignupSwap })
    }
}
