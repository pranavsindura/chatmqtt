import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import uuid from 'uuid';

const mqtt = require('mqtt');
let client = null;
const options = {
	protocol: 'mqtts',
	clientId: uuid()
};
const initState = {
	connectionStatus: false,
	messageQueue: [],
	topic: '',
	editTopic: '',
	message: '',
	name: 'Anon' + String(Math.floor(Math.random() * 1000))
};

class App extends React.Component {
	state = {
		...initState
	};

	handleTopicChange = (e) => {
		e.preventDefault();
		let editTopic = e.target.value;
		this.setState({
			editTopic
		});
	};

	handleMessageChange = (e) => {
		e.preventDefault();
		let message = e.target.value;
		this.setState({
			message
		});
	};

	subscribeTopic = (e) => {
		e.preventDefault();
		if (this.state.editTopic.length === 0) return;
		if (this.state.topic.length > 0) client.unsubscribe(this.state.topic);
		if (!this.state.connectionStatus) return;
		this.setState(
			{
				messageQueue: [],
				topic: 'pranav/' + this.state.editTopic,
				editTopic: '',
				message: ''
			},
			() => {
				client.subscribe(this.state.topic);
			}
		);
	};

	publishMessage = (e) => {
		e.preventDefault();
		if (this.state.message.length === 0) return;
		if (!this.state.connectionStatus) return;
		client.publish(this.state.topic, this.state.name + ': ' + this.state.message);
		this.setState({
			message: ''
		});
	};

	addMessage = (message) => {
		let messageQueue = [...this.state.messageQueue];
		messageQueue.push(message);
		this.setState({ messageQueue });
	};

	toggleConnection = () => {
		if (this.state.connectionStatus === true) {
			client.end();
			this.setState({ ...initState });
		} else {
			client = mqtt.connect('mqtt://test.mosquitto.org:8081', options);
			client.on('connect', () => {
				this.setState({ connectionStatus: true });
			});
			client.on('error', (err) => {
				console.log(err);
			});
			client.on('message', (topic, message) => {
				this.addMessage(message.toString());
			});
		}
	};

	componentDidUpdate = () => {};

	componentDidMount = () => {};

	render = () => {
		const state = this.state;
		return (
			<Container fluid>
				<Row>
					<Col md={{ offset: 5 }}>
						<h1>Chat MQTT</h1>
					</Col>
				</Row>
				<Row>
					<Col md={{ span: 4, offset: 2 }}>
						<Card>
							<Card.Body>
								<Card.Title>Connection Status</Card.Title>
								{state.connectionStatus ? (
									<Button variant="success" onClick={(e) => this.toggleConnection()}>
										ACTIVE
									</Button>
								) : (
									<Button variant="danger" onClick={(e) => this.toggleConnection()}>
										INACTIVE
									</Button>
								)}
							</Card.Body>
						</Card>
						<Card>
							<Card.Body>
								<Card.Title>Pick a Topic</Card.Title>
								<InputGroup>
									<FormControl
										type="text"
										value={state.editTopic}
										placeholder="Enter Topic"
										onChange={(e) => this.handleTopicChange(e)}
									/>
									<InputGroup.Append>
										<Button variant="dark" onClick={(e) => this.subscribeTopic(e)}>
											Join
										</Button>
									</InputGroup.Append>
								</InputGroup>
							</Card.Body>
						</Card>
						<Card>
							<Card.Body>
								<Card.Title>Your Assigned Name</Card.Title>
								<Card.Text>{state.name}</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col md={{ span: 4 }}>
						<Card style={{ height: '100%' }}>
							<Card.Body>
								<Card.Title>Current Topic - {state.topic}</Card.Title>
								<Container style={{ height: '200px', overflowY: 'scroll' }}>
									{state.messageQueue.map((m) => {
										return (
											<div key={uuid()}>
												<i>{m}</i>
											</div>
										);
									})}
								</Container>
							</Card.Body>
							<Card.Footer>
								<InputGroup>
									<FormControl
										type="text"
										value={state.message}
										placeholder="Enter a Message"
										onChange={(e) => this.handleMessageChange(e)}
										onSubmit={(e) => this.publishMessage(e)}
										disabled={state.topic.length === 0 || !state.connectionStatus}
									/>
									<InputGroup.Append>
										<Button
											variant="dark"
											onClick={(e) => this.publishMessage(e)}
											disabled={state.topic.length === 0 || !state.connectionStatus}
										>
											Send
										</Button>
									</InputGroup.Append>
								</InputGroup>
							</Card.Footer>
						</Card>
					</Col>
				</Row>
			</Container>
		);
	};
}

export default App;
