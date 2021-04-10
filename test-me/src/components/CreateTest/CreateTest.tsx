import React, { Component } from 'react'
import { Button, Form, OverlayTrigger, Popover, Image, Modal, ListGroup, Row, Col, Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import configData from '../../config.json';
import './CreateTest.css';

interface CreateTestProps {
}

interface CreateTestState {
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
    ],
    editedQuestion: number;
    saveModalIsOpen: boolean;
    userToFill: string;
    fillingUsers: string[];
    savingTest: boolean;
    createdTest: boolean;
}

export default class CreateTest extends Component<CreateTestProps, CreateTestState> {

    constructor(props: CreateTestProps) {
        super(props);

        this.state = {
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
            ],
            editedQuestion: 0,
            saveModalIsOpen: false,
            userToFill: '',
            fillingUsers: [],
            savingTest: false,
            createdTest: false
        }

        this.createTrueFalseQuestion = this.createTrueFalseQuestion.bind(this);
        this.handleQuestionInputs = this.handleQuestionInputs.bind(this);
        this.chooseQuestionToEdit = this.chooseQuestionToEdit.bind(this);
        this.createQuizQuestion = this.createQuizQuestion.bind(this);
        this.addUsersToTheTest = this.addUsersToTheTest.bind(this);
        this.handleSaveInputs = this.handleSaveInputs.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    componentDidMount() {
        fetch(`${configData.SERVER_URL}/users/fetch-from-session`, { method: 'GET', credentials: "include", mode: 'cors' }).then(function (body) {
            return body.text();
        }).then((response) => {
            this.setState({ userId: response });
        });
    }

    render() {
        if (this.state.createdTest) {
            return <Redirect to='/' />;
        }
        const selectQuestionType = (
            <Popover id="popover" >
                <Popover.Title as="h3">Milyen típusú kérdés legyen?</Popover.Title>
                <Popover.Content>
                    <Form.Group>
                        <Button className="new-question-button w-75" onClick={this.createQuizQuestion} variant="outline-primary">
                            <Image src="/img/quiz_icon.png" />
                            <p className="font-weight-bold">Kvíz</p>
                            <p>Adj a játékosoknak több válaszlehetőséget, amelyek közül választhatnak</p>
                        </Button>
                    </Form.Group>
                    <Form.Group>
                        <Button className="new-question-button w-75" onClick={this.createTrueFalseQuestion} variant="outline-primary">
                            <Image src="/img/true_false_icon.png" />
                            <p className="font-weight-bold">Igaz-hamis</p>
                            <p>Engedd hogy a játékos döntse el, hogy az állítás igaz vagy hamis</p>
                        </Button>
                    </Form.Group>

                </Popover.Content>
            </Popover>
        );

        const questionList = (
            this.state.questions[0].problem.length > 0 || this.state.questions.length > 1 ?
                this.state.questions.map((item, index) => (
                    <div data-key={item.id} onClick={() => this.chooseQuestionToEdit(item.id)} style={{
                        backgroundColor: this.state.editedQuestion == item.id ? '#2b92ff' : 'white',
                    }} className="question-list-item" >
                        <img src="/img/trash.png" width="25" style={{ cursor: 'pointer' }} onClick={() => this.deleteQuestion(index)} />
                        <div data-key={item.id} className="question-item-content" style={{
                            backgroundColor: this.state.editedQuestion == item.id ? 'white' : '#e0efff',
                        }}>
                            <p data-key={item.id} className="sidebar-question-number">{index + 1}</p>
                            <p data-key={item.id} className="question-type">{item.hasOwnProperty("answerThree") ? "Kvíz" : "Igaz-hamis"}</p>
                            <p data-key={item.id} className="font-weight-bold item-question-text">{item.problem}</p>

                        </div>
                    </div>
                ))
                : <div data-key="0" onClick={this.chooseQuestionToEdit} style={{ backgroundColor: '#2b92ff' }} className="question-list-item">
                    <img src="/img/trash.png" width="25" style={{ cursor: 'pointer' }} onClick={() => this.deleteQuestion(0)} />
                    <div data-key="0" className="question-item-content" style={{ backgroundColor: 'white' }}>
                        <p data-key="0" className="sidebar-question-number">1</p>
                        <p data-key="0" className="question-type">Kvíz</p>
                        <p data-key="0" className="font-weight-bold mt-2">{this.state.questions[0].problem}</p>

                    </div>
                </div>
        )

        return (
            this.state.userId == "" ? <div className="alert alert-danger" role="alert">Jelentkezz be hogy tesztet készíthess!</div> :
                <div className="edit-container full-height">
                    <div className="sidebar-container">
                        <div className="sidebar">
                            {questionList}
                            <Form.Group>
                                <OverlayTrigger
                                    rootClose={true} trigger="click" placement="right" overlay={selectQuestionType}>
                                    <Button className="new-question-button w-75" variant="primary">Új kérdés</Button>
                                </OverlayTrigger>
                            </Form.Group>
                        </div>

                        <Form.Group className="save-exit-button w-100">
                            <Button className="cancel-test-button" variant="danger" onClick={() => this.setState({ createdTest: true })}>Kilépés</Button>
                            <Button variant="success" onClick={this.openModal}> Mentés</Button>{' '}
                        </Form.Group>
                    </div>

                    <div className="create">
                        <Form.Group className="question-text">
                            <Form.Control type="text" onChange={(e) => { this.handleQuestionInputs(e) }} name="problem" id="question-text-input" placeholder="Írd ide a kérdésed..." value={this.state.questions.find(q => q.id == this.state.editedQuestion)?.problem}>
                            </Form.Control>
                        </Form.Group>

                        <div className="question-details">
                            <Form.Group className="time-limit" controlId="formBasicRange">
                                <Form.Label className="time-label">Idő: </Form.Label>
                                <Form.Label className="time-number-label">{this.state.questions.find(q => q.id == this.state.editedQuestion)?.timeLimit}</Form.Label>
                                <Form.Control min="5" max="200" size="lg" step={5} name="timeLimit" value={this.state.questions.find(q => q.id == this.state.editedQuestion)?.timeLimit} onChange={(e) => this.handleQuestionInputs(e)} type="range" />
                            </Form.Group>
                            <Form.Group className="question-xp" controlId="formBasicRange">
                                <Form.Label className="xp-label">Xp: </Form.Label>
                                <Form.Label className="xp-slider-number-label">{this.state.questions.find(q => q.id == this.state.editedQuestion)?.xp}</Form.Label>
                                <Form.Control min="0" max="1000" size="sm" step={100} name="xp" value={this.state.questions.find(q => q.id == this.state.editedQuestion)?.xp} onChange={(e) => this.handleQuestionInputs(e)} type="range" />
                            </Form.Group>
                        </div>

                        {this.state.questions.find(q => q.id == this.state.editedQuestion)?.hasOwnProperty("answerThree") ?
                            <Form.Group className="answers">
                                <Form.Group className="answers-one">
                                    <Form.Control onChange={(e) => { this.handleQuestionInputs(e) }} value={this.state.questions.find(q => q.id == this.state.editedQuestion)?.answerOne} name="answerOne" placeholder="Első válasz" />
                                    <Form.Check
                                        type="radio"
                                        checked={this.state.questions.find(q => q.id == this.state.editedQuestion)?.correctAnswer == 0 ? true : false}
                                        name="answers-radio"
                                        id="0"
                                        onChange={(e) => { this.handleQuestionInputs(e) }}
                                    />
                                </Form.Group>
                                <Form.Group className="answers-two">
                                    <Form.Control onChange={(e) => { this.handleQuestionInputs(e) }} value={this.state.questions.find(q => q.id == this.state.editedQuestion)?.answerTwo} name="answerTwo" placeholder="Második válasz" />
                                    <Form.Check
                                        type="radio"
                                        checked={this.state.questions.find(q => q.id == this.state.editedQuestion)?.correctAnswer == 1 ? true : false}
                                        name="answers-radio"
                                        id="1"
                                        onChange={(e) => { this.handleQuestionInputs(e) }}
                                    />
                                </Form.Group>
                                <Form.Group className="answers-three">
                                    <Form.Control onChange={(e) => { this.handleQuestionInputs(e) }} name="answerThree" value={this.state.questions.find(q => q.id == this.state.editedQuestion)?.answerThree} placeholder="Harmadik válasz" />
                                    <Form.Check
                                        type="radio"
                                        checked={this.state.questions.find(q => q.id == this.state.editedQuestion)?.correctAnswer == 2 ? true : false}
                                        name="answers-radio"
                                        id="2"
                                        onChange={(e) => { this.handleQuestionInputs(e) }}
                                    />
                                </Form.Group>
                                <Form.Group className="answers-four">
                                    <Form.Control onChange={(e) => { this.handleQuestionInputs(e) }} name="answerFour" value={this.state.questions.find(q => q.id == this.state.editedQuestion)?.answerFour} placeholder="Negyedik válasz" />
                                    <Form.Check
                                        type="radio"
                                        checked={this.state.questions.find(q => q.id == this.state.editedQuestion)?.correctAnswer == 3 ? true : false}
                                        name="answers-radio"
                                        id="3"
                                        onChange={(e) => { this.handleQuestionInputs(e) }}
                                    />
                                </Form.Group>
                            </Form.Group> :
                            <Form.Group className="answers">
                                <Form.Group className="answers-one">
                                    <Form.Label className="answers-true-label">Igaz</Form.Label>
                                    <Form.Check
                                        type="radio"
                                        checked={this.state.questions.find(q => q.id == this.state.editedQuestion)?.correctAnswer == 0 ? true : false}
                                        name="answers-radio"
                                        id="0"
                                        onChange={(e) => { this.handleQuestionInputs(e) }}
                                    />
                                </Form.Group>
                                <Form.Group className="answers-two">
                                    <Form.Label className="answers-false-label">Hamis</Form.Label>
                                    <Form.Check
                                        type="radio"
                                        checked={this.state.questions.find(q => q.id == this.state.editedQuestion)?.correctAnswer == 1 ? true : false}
                                        name="answers-radio"
                                        id="1"
                                        onChange={(e) => { this.handleQuestionInputs(e) }}
                                    />
                                </Form.Group>
                            </Form.Group>
                        }
                    </div>

                    <Modal
                        show={this.state.saveModalIsOpen}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        onHide={this.closeModal}
                    >
                        <Modal.Header closeButton >
                            <Modal.Title id="contained-modal-title-vcenter">
                                Teszt mentése
                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Teszt címe:</Form.Label>
                                        <Form.Control type="text" name="title" placeholder="Cím" onChange={(e) => { this.handleSaveInputs(e) }} />
                                    </Form.Group>
                                    <Form.Group className="user-email-input">
                                        <Form.Label>Kitöltők hozzáadása:</Form.Label>
                                        <Form.Control type="text" name="userToFill" value={this.state.userToFill} placeholder="E-mail cím" onChange={(e) => { this.handleSaveInputs(e) }} />
                                        <Button variant="success" className="add-user-button" onClick={this.addUsersToTheTest}> Hozzáadás</Button>{' '}
                                    </Form.Group>
                                    <Form.Group className="test-date-input">
                                        <Form.Label>Kitöltési határidő:</Form.Label>
                                        <Form.Control type="date" name='deadline' onChange={(e) => { this.handleSaveInputs(e) }} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Leírás</Form.Label>
                                        <Form.Control as="textarea" rows={3} name='description' onChange={(e) => { this.handleSaveInputs(e) }} />
                                    </Form.Group>
                                </Col>
                                <Col className="added-users">
                                    <ListGroup>
                                        <ListGroup.Item variant="primary">Hozzáadott felhasználók:</ListGroup.Item>
                                        {this.state.fillingUsers.map((item, index) => (
                                            <ListGroup.Item>{item} <img
                                                src="/img/trash.png"
                                                width="25"
                                                // data-key={index}
                                                style={{ float: 'right', cursor: 'pointer' }}
                                                onClick={() => this.deleteUser(index)}
                                            /></ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            {this.state.savingTest ? <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner> :
                                <>
                                    <Button onClick={this.closeModal}>Bezárás</Button>
                                    <Button variant="success" onClick={() => this.saveTest()}>Mentés</Button>
                                </>
                            }
                        </Modal.Footer>
                    </Modal>
                </div >
        )
    }

    openModal = () => this.setState({ saveModalIsOpen: true });
    closeModal = () => this.setState({ saveModalIsOpen: false });

    createQuizQuestion() {
        this.state.questions.push({
            id: Math.max.apply(Math, this.state.questions.map(function (o) { return o.id; })) + 1,
            problem: '',
            answerOne: '',
            answerTwo: '',
            answerThree: '',
            answerFour: '',
            timeLimit: 0,
            xp: 0,
            correctAnswer: 0
        })

        document.body.click()
        this.forceUpdate();
    }

    createTrueFalseQuestion() {
        this.state.questions.push({
            id: Math.max.apply(Math, this.state.questions.map(function (o) { return o.id; })) + 1,
            problem: '',
            answerOne: '',
            answerTwo: '',
            timeLimit: 0,
            xp: 0,
            correctAnswer: 0
        })

        document.body.click()
        this.forceUpdate();
    }

    chooseQuestionToEdit(id: any) {
        try {
            this.setState({ editedQuestion: id });
        } catch (error) {
            this.setState({ editedQuestion: this.state.questions[0].id });
        }
        this.forceUpdate();

    }

    deleteQuestion(arg: any) {
        var questions: any = [...this.state.questions]; // make a separate copy of the array
        questions.splice(arg, 1);
        this.setState({ questions: questions });
        this.forceUpdate();
    }

    deleteUser(arg: any) {
        var array = [...this.state.fillingUsers]; // make a separate copy of the array
        array.splice(arg, 1);
        this.setState({ fillingUsers: array });

    }

    slidebarQuestions() {
        if (this.state.questions[0].problem != "") {
            return (
                this.state.questions.map(q =>
                    <div className="question-list-item">
                        {q.problem}
                    </div>
                )
            )
        }
    }

    addUsersToTheTest() {
        this.setState(previousState => ({
            fillingUsers: [...previousState.fillingUsers, this.state.userToFill],
            userToFill: ""
        }));
    }

    handleSaveInputs(e: { target: { name: any; value: any; }; }) {
        const { name, value } = e.target;

        const newState = { [name]: value } as Pick<CreateTestState, keyof CreateTestState>;
        this.setState(newState);
    }

    handleQuestionInputs(e: { currentTarget: { value: any; }; preventDefault: () => void; target: { name: string | number; value: string | number; id: string | number } }) {
        const { name, value, id } = e.target;

        if (value == "on") {
            var questions: any = [...this.state.questions];
            questions.find((q: { id: number; }) => q.id == this.state.editedQuestion).correctAnswer = id;
        } else {
            var questions: any = [...this.state.questions];
            questions.find((q: { id: number; }) => q.id == this.state.editedQuestion)[name] = value;
        }
        this.setState({ questions });
    }

    async saveTest() {
        this.setState({ ...this.state, savingTest: true });
        let questions = this.state.questions.map(({ id, ...keepAttrs }) => keepAttrs)

        await fetch(`${configData.SERVER_URL}/tests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                UserId: this.state.userId,
                Title: this.state.title,
                Description: this.state.description,
                Questions: questions,
                Deadline: this.state.deadline
            })
        }).then(response => {
            if (response.ok) return response.json();
        }).then(async json => {
            await this.state.fillingUsers.forEach(async (email) => {
                await fetch(`${configData.SERVER_URL}/users-tests`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        User: {
                            Email: email
                        },
                        TestId: json.id
                    })

                });
            });
            this.setState({ ...this.state, savingTest: false, createdTest: true });
        })
    }
}
