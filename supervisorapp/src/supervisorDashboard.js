import React, { Component } from 'react';
import './supervisorDashboard.css';
import Card, { CardContent } from 'material-ui/Card';
import fire from './fire';
import Command from './command';

class SupervisorDashboard extends Component {
  render() {
    return (
        <Card>
            <CardContent>
                <h3> Suivi des commandes </h3>

                <div className="content">

                    <h4> En attente </h4>

                    { this.state && this.state.commands ?
                        this.state.commands['waiting'].map( command => {
                            return <Command key={command.id} command={command}/>
                        })
                        : 'the commands are loading...'
                    }

                    <h4> En cours de traitement </h4>

                    { this.state && this.state.commands ?
                        this.state.commands['in_progress'].map( command => {
                            return <Command key={command.id} command={command}/>
                        })
                        : 'the commands are loading...'
                    }

                    <h4> Finies </h4>

                    { this.state && this.state.commands ?
                        this.state.commands['finished'].map( command => {
                            return <Command key={command.id} command={command}/>
                        })
                        : 'the commands are loading...'
                    }
                    
                    
                </div>
            </CardContent>
        </Card>
    );
  }

  componentWillMount() {
    // we take the commands from firebase
    fire.firestore().collection('commands').onSnapshot(querySnapshot => {
        var commands = {
            'waiting': [],
            'in_progress': [],
            'finished': []
        };
        querySnapshot.forEach( doc => {
            var commandWithId = {...doc.data(), id: doc.id}
            commands[commandWithId.state].push(commandWithId)
        })
        this.setState({
            commands: commands
        })
    })
 }


  constructor(props) {
      super(props)
  }
}

export default SupervisorDashboard;