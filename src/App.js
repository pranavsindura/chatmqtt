import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import options from './options';

const mqtt = require('mqtt');

class App extends React.Component {
	state = {
    client: null,
  };

	componentDidMount = () => {
    const client = mqtt.connect(options); 
    client.on('connect', ()=>{
      console.log('MQTT is Ready')
    });
    client.on('error', (err)=>{
      console.log(err)
    });
  };

	render = () => {
		return (
			<Container fluid>
				<Row>
					<Col md={{ offset: 5 }}>
						<h1>Chat MQTT</h1>
					</Col>
				</Row>
				<Row>
					<Col>Enter a Topic to Join chat</Col>
					<Col>Enter chat</Col>
				</Row>
			</Container>
		);
	};
}

export default App;
