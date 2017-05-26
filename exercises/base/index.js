import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {TodoData} from './model/todomodel';
import { Editable } from './components/editable';
import {TodoProgressBar} from './components/bar';


// init our datastore
const appstate = new TodoData();

class Task extends Component {

    constructor(props) {
        super(props);
        this.task = props.task;
        this.toggle = this.toggle.bind(this);
        this.remove = this.remove.bind(this);
        this.save = this.save.bind(this);
    }

    toggle() {
        appstate.toggleTask(this.task.id);
    }

    remove() {
        appstate.removeTask(this.task.id);
    }

    save(newValue) {
        appstate.updateTask(this.task.id, newValue);
    }

    render() {
        const taskClass = this.task.done ? 'done' : 'undone'
        const ready = <i className={`${taskClass} fa fa-check-circle-o`}></i>
        return (
            <li className={`task ${taskClass}`}>
                <div className="task-main">
                    <Editable value={this.task.value} onSave={this.save} />
                </div>
                <div className="task-actions">
                    <button className="task-btn remove-btn"
                        onClick={this.remove}>
                        <i className="fa fa-times-circle-o"></i>
                    </button>
                    <button className="task-btn" onClick={this.toggle}>{ready}</button>
                </div>
            </li>
        );
    }
}

const TaskList = (props) => {
    let tasks = props.tasks.map(task => {
        return <Task key={task.id} task={task}/>;
    });
    return (
        <ul className={props.type}>
            {tasks}
        </ul>);
};

class AddTaskInput extends Component {

    constructor(props) {
        super(props);
        this.clear();
        this.change = this.change.bind(this);
        this.add = this.add.bind(this);
    }

    change(e) {
        this.setState({task: e.target.value});
    }

    add(e) {
        if (e.key === 'Enter') {
            appstate.addTask(this.state.task);
            this.clear();
        }
    }

    clear() {
        this.state = {task: ''};
    }

    render() {
        return (
            <div className='add-task-container'>
                <input
                    type='text'
                    value={this.state.task}
                    onChange={this.change}
                    onKeyPress={this.add}
                    placeholder='Add task...' />
            </div>
        );
    }
}

class TodoApp extends Component {
    /*
     We use the constructor and the React Component's built in componentDidMount method
     to link our data store abstraction to our React application, se React knows
     to re-render every time our data changes.
     */

    constructor(props) {
        super(props);
        // Set component's state
        this.state = {tasks: appstate.getTasks()};
    }

    componentDidMount() {
        /*
         This is a React Component LifeCycle method.
         tl:dr; it gets run if this component is mounted to the DOM.

         The idea is that our subscriber callback calls setState whenever
         appstate notifies that our data has changed.

         Component.setState triggers render() so React knows to re-render
         when data has changed.
         */
        appstate.subscribe(state => {
            this.setState({tasks: state});
        });
    }

    render() {
        // Filter tasks
        let readyTasks = [];
        let unreadyTasks = [];
        let allTasks = this.state.tasks;

        for (let task of allTasks) {
            if (task.done) {
                readyTasks.push(task);
            } else {
                unreadyTasks.push(task);
            }
        }

        return (<div className='todo-app'>
            <AddTaskInput />
            <TodoProgressBar value={readyTasks.length} max={allTasks.length} />
            <TaskList type='not-ready-tasks' tasks={unreadyTasks}></TaskList>
            <TaskList type='ready-tasks' tasks={readyTasks}></TaskList>
        </div>);
    }
}

ReactDOM.render(
    <TodoApp></TodoApp>,
    document.getElementById('app-container')
);
