import React, {Component} from 'react';
import { browserHistory } from 'react-router';

class Navbar extends Component {
    constructor() {
        super();
        this.state = {
            message: '',
            messageColor: 'text-danger',
            formType: '',
            spinnerOrSignUp: '',
            spinnerOrSignIn: 'fa fa-sign-in',
            spinnerOrSend: 'fa fa-paper-plane',
            spinnerOrPower: "fa fa-power-off"
        }
    }
    showSignUpForm() {
        this.setState({
            formType: "signUp",
            message: ''
        })
    }
    showSignInForm() {
        this.setState({
            formType: "signIn",
            message: ''
        })
    }
    showResetForm() {
        this.setState({
            formType: "reset",
            message: ''
        })
    }
    handleSignIn(event) {
        event.preventDefault();
        
        // Display Loading Spinner
            this.setState({
            spinnerOrSignIn: 'fa fa-circle-o-notch fa-spin'
            })
    
        // Find the text field via the React refs
        const user_info = this.refs.user_info.value.trim();
        const password = this.refs.signInPassword.value.trim();
    
        // Login user
        Meteor.loginWithPassword(user_info, password, (err) => {
        
            if (err) { // Show error message and Hide Loading Spinner
                this.setState({message: err.reason, messageColor: 'text-danger', spinnerOrSignIn: 'fa fa-sign-in'});
                
            } else {
                // Hide Loading Spinner
                this.setState({
                    spinnerOrSignIn: 'fa fa-sign-in'
                });
                // redirect to dashboard page
                browserHistory.push("/dashboard");
            }
        });
    }
    handleSignUp(event) {
        event.preventDefault();
        // Find the text field via the React refs
        const username = this.refs.signUpUsername.value.trim();
        const email = this.refs.signUpEmail.value.trim();
        const password = this.refs.signUpPassword.value.trim();
        
        if (password !== "" && email !== "" && username !== "") {
        
            // Display Loading Spinner
            this.setState({
                spinnerOrSignUp: 'fa fa-circle-o-notch fa-spin'
            });
        
            var accountInfo = {
                email,
                password,
                username,
                profile: {
                    city: '',
                    occupation: '',
                    avatar: 'http://placehold.it/150x150',
                }
            }
                
            Accounts.createUser(accountInfo, (err) => {
                // if there was an error creating an account, hide spinner, display error message
                if (err) {
                    this.setState({message: err.reason, messageColor: 'text-danger', spinnerOrSignUp: 'fa fa-user-plus'});                 
                    return;
                } else {
                    // clear fields
                    this.refs.signUpUsername.value = '';
                    this.refs.signUpEmail.value = '';
                    this.refs.signUpPassword.value = '';
                    // redirect to dashboard page
                    browserHistory.push("/dashboard");
                }
            });

        } else {
            this.setState({message: 'Passwords do not match or a field is empty', messageColor: 'text-danger',});
            return;
        }
    }
    resetPassword(event) {
        event.preventDefault();
        
        const emailForUsersPassword = this.refs.recoveryEmail.value.trim();
        
        if (emailForUsersPassword !== "") {
            // display spinner
            this.setState({spinnerOrSend: 'fa fa-circle-o-notch fa-spin'});
            // send recovery email
            Accounts.forgotPassword({email: emailForUsersPassword}, (er) => {
                if (er) { // show error message and hide spinner
                    this.setState({
                        messageColor: 'text-danger',
                        message: (er.reason),
                        spinnerOrSend: 'fa fa-paper-plane'
                    })
                } else {
                    this.setState({ // show success message and hide spinner
                        messageColor: 'text-success',
                        message: "We sent you an email with instructions on how to reset your password",
                        spinnerOrSend: 'fa fa-paper-plane'
                    })
                    this.refs.recoveryEmail.value = '';
                }
            })
        } else {
            this.setState({
                messageColor: 'text-danger',
                message: "Please enter a valid email"
            })
        }
    }
    logUserOut() {
        this.setState({
            spinnerOrPower: "fa fa-circle-o-notch fa-spin",
        })
        Meteor.logout( (er) => {
            if (er) {
                this.setState({
                    spinnerOrPower: "fa fa-power-off",
                    message: (er.reason),
                    messageColor: 'text-danger'
                });
            } else {
                this.setState({
                    spinnerOrPower: "fa fa-power-off",
                });
                browserHistory.push("/");
            }
        });
    }
    getLoggedOutNav() {
        let formType;
        if (!this.state.formType) {
            formType = (
                <ul className="nav navbar-nav navbar-right accountButtons">
                    <li><button onClick={this.showSignUpForm.bind(this)} className="btn btn-success"><i className="fa fa-user-plus"></i> Sign Up</button></li>
                    <li><button onClick={this.showSignInForm.bind(this)} className="btn btn-primary"><i className="fa fa-sign-in"></i> Sign In</button></li>
                </ul>
            )
        } else if (this.state.formType === "signIn") {
            formType = (
                <div className="formWrapper">
                    <form className="form-inline signInForm" onSubmit={this.handleSignIn.bind(this)}>
                        <span className={this.state.messageColor}>{this.state.message}</span>
                        <input className="form-control" type="text" ref="user_info" placeholder="Email or Username"/>
                        <input className="form-control" type="password" ref="signInPassword" placeholder="Password"/>
                        <button className="btn btn-primary signUpBtn"><i className={this.state.spinnerOrSignIn}></i> Sign In</button>
                    </form>
                    <button onClick={this.showResetForm.bind(this)} className="btn btn-link">Forgot Password</button>
                    <span>or <button onClick={this.showSignUpForm.bind(this)} className="btn btn-link">Sign Up</button></span>
                </div>
            )
        } else if (this.state.formType === "signUp") {
            formType = (
                <div className="formWrapper">
                    <form className="form-inline signUpForm" onSubmit={this.handleSignUp.bind(this)}>
                        <span className={this.state.messageColor}>{this.state.message}</span>
                        <input className="form-control" type="email" ref="signUpEmail" placeholder="Email"/>
                        <input className="form-control" type="text" ref="signUpUsername" placeholder="Username"/>
                        <input className="form-control" type="password" ref="signUpPassword" placeholder="Password"/>
                        <button className="btn btn-success signUpBtn"><i className={this.state.spinnerOrSignUp}></i> Sign Up</button>
                    </form>
                    <span>or <button onClick={this.showSignInForm.bind(this)} className="btn btn-link">Sign In</button></span>
                </div>
            )
        } else if (this.state.formType === "reset") {
            formType = (
                <div className="formWrapper">
                    <form className="form-inline resetForm" onSubmit={this.resetPassword.bind(this)}>
                        <span className={this.state.messageColor}>{this.state.message}</span>
                        <input className="form-control" type="email" ref="recoveryEmail" placeholder="Email"/>
                        <button className="btn btn-primary signUpBtn"><i className={this.state.spinnerOrSend}></i> Send Password</button>
                    </form>
                    <button onClick={this.showSignInForm.bind(this)} className="btn btn-link">Sign In</button>
                    <span>or <button onClick={this.showSignUpForm.bind(this)} className="btn btn-link">Sign Up</button></span>
                </div>
            )
        }
        return formType;
    }
    getLoggedInNav() {
        return (
            <div className="loggedInNav">
                <button onClick={this.logUserOut.bind(this)} className="btn btn-danger"><i className={this.state.spinnerOrPower}></i> Sign Out</button>
            </div>
        )
    }
    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">Battleship</a>
                    </div>
                    <div className="nav navbar-nav navbar-right">
                        {Meteor.userId() ? this.getLoggedInNav() : this.getLoggedOutNav()}
                    </div>
                </div>
            </nav>
        )
    }
}

export default Navbar;