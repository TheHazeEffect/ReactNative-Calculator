
import React, {Component} from 'react';
import { View,Text} from 'react-native';
import Style from './Style.js';
import InputButton from './InputButton';

// Array containing the inputbuttons that will be displayed in the calculator 
const inputButtons = [
	[1,2,3, '/'],
	[4,5,6, '*'],
	[7,8,9, '-'],
	[0,'.','=','+'],
	['C','CE','(',')']
];

var controlStateHistory = []
export default class ReactCalculator extends Component {

	constructor(props){
		super(props);

		this.state = {
			controlState:1,
			previousControlState:1,
			inputValue: 0,
			openParenthesisCount:0,
			closeParenthesisCount:0,
			MixedNumber: null,
			resultFound: null,
			negativeNumber:null
		}
	}

    render() {
        return (
			<View style = {Style.rootContainer}>
				<View style={Style.displayContainer}>
					<Text style ={Style.displayText}>{this.state.inputValue}</Text>
				</View>
				<View style={Style.inputContainer}>
					{this._renderInputButtons()}
				</View>
			</View>
        )
    } 
	/**
	*For Each row in 'inputButtons', create a row VIew and add create
	*an input button for each input in the row
	*/

	_renderInputButtons(){
		let views = [];
		
		for(var r = 0; r < inputButtons.length;r++){
			let row = inputButtons[r];
			
			let inputRow = [];
			for(var i=0;i<row.length;i++){
				let input = row[i];
				inputRow.push(
					<InputButton
						value={input}
						highlight={this.state.selectedSymbol===input}
						onPress={this._onInputButtonPressed.bind(this,input)} 
						key={r + "-" + i} 
					/>
				);
			}
			
			views.push(<View style={Style.inputRow} key={"row-" + r}>{inputRow}</View>)
		}
		
		return views;
	}
	
	
	_onInputButtonPressed(input){
		switch(typeof input){
			case 'number' :
				return this._handleNumberInput(input)
			case 'string' :
				return this._handleStringInput(input)
		}
	}

	_handleStringInput(str){
		let inputValue = this.state.inputValue,
		openParenthesisCount = this.state.openParenthesisCount,
		closeParenthesisCount = this.state.closeParenthesisCount,
		controlState = this.state.controlState,
		MixedNumber = this.state.MixedNumber,
		resultFound = this.state.resultFound,
		negativeNumber = this.state.negativeNumber;

		switch(str){
			case 'C' :
				if(controlState != 1)
				{
					var previousControlState = controlStateHistory.pop()
					if(controlState==7)
					{
						this.setState({
							negativeNumber:null
						})
					}
					if(controlState==6)
					{
						this.setState({
							MixedNumber:null
						})
					}
					inputValue = inputValue.slice(0,-1)
					this.setState({
						inputValue: inputValue,
						controlState: previousControlState
					});
				}
				break;
			case 'CE':
			
				this.setState({
					controlState:1,
					inputValue: 0,
					openParenthesisCount:0,
					closeParenthesisCount:0,
					MixedNumber: null,
					resultFound: null,
					negativeNumber:null
				});
				controlStateHistory.length = 0
				break;
			case '.' :
				if( (controlState==3 || controlState==4 || controlState==1 || controlState == 7) && MixedNumber == null)
				{	
					controlStateHistory.push(controlState)
					this.setState({
						inputValue: inputValue + ".",
						controlState: 6,
						MixedNumber: true,
						negativeNumber:null
					})	
				}
				break;
			case '(' :
				if( (controlState == 1 || controlState == 7 || controlState == 2 || controlState == 4) && resultFound != true )
				{
					controlStateHistory.push(controlState)
					if(inputValue==0)
					{
						this.setState({
							//inputValue: [inputValue == 0 ? "(" : inputValue + "("], // Commented out because buggs out the delete button
							inputValue: "(",
						})
					}
					else
					{
						this.setState({
							//inputValue: [inputValue == 0 ? "(" : inputValue + "("], // see above comment
							inputValue: inputValue + "(",
						})
					}
					this.setState({
						openParenthesisCount : openParenthesisCount + 1,
						controlState:2,
						negativeNumber:null
					})
				}
				break;
			case ')' :
				if( (controlState == 3 || controlState == 5) && openParenthesisCount>closeParenthesisCount)
				{
					controlStateHistory.push(controlState)
					this.setState({
						inputValue: inputValue + ")",
						closeParenthesisCount: closeParenthesisCount + 1,
						controlState:5,
						MixedNumber: null,
						negativeNumber:null
					})
				}
				break;
			case '/' :
				if( (controlState == 3 || controlState == 5) || resultFound == true )
				{
					controlStateHistory.push(controlState)
					this.setState({
						inputValue: inputValue + "/",
						controlState:4,
						MixedNumber: null,
						resultFound:null,
						negativeNumber:null
					})
				}
				break;
			case '*' :
				if( (controlState == 3 || controlState == 5) || resultFound == true )
				{
					controlStateHistory.push(controlState)
					this.setState({
						inputValue: inputValue + "*",
						controlState:4,
						MixedNumber: null,
						resultFound:null,
						negativeNumber:null
					})
				}
				break;
			case '+' :
				if( (controlState == 3 || controlState == 5) || resultFound == true )
				{
					controlStateHistory.push(controlState)
					this.setState({
						inputValue: inputValue + "+",
						controlState:4,
						MixedNumber: null,
						resultFound:null,
						negativeNumber:true
					})
				}
				break;
			case '-' :
				if( (controlState == 2 || controlState == 3 || controlState == 5 ||
					 controlState == 1 || controlState == 4 || resultFound == true ) && negativeNumber != true )
				{
					controlStateHistory.push(controlState)
					if(inputValue==0)
					{
						this.setState({
							inputValue:  "-"
						})
					}
					else
					{
						this.setState({
							//inputValue: [inputValue == 0 ? "-" : inputValue + "-"], // Commented out because buggs out the delete button
							inputValue: inputValue + "-"
						})
					}
					this.setState({
						controlState:7,
						MixedNumber: null,
						resultFound:null,
						negativeNumber:true
					})
				}
				break;
			case '=' :
				if(openParenthesisCount==closeParenthesisCount && controlState == 3 || controlState == 5 )
				{
					this.setState({
						controlState : 1,
						//inputValue: [eval(previousInputValue + symbol + inputValue) == Infinity ? "Math Error" 
									//:eval(previousInputValue + symbol + inputValue)],
						inputValue: [eval(inputValue) == Infinity ? "Math Error" 
									:eval(inputValue)],
						resultFound:true
					});
					controlStateHistory.length = 0
				}
				break;
		}
	}

	_handleNumberInput(num){
		let controlState = this.state.controlState,
		inputValue = this.state.inputValue,
		resultFound = this.state.resultFound;

		if(controlState!=5)
		{
			if(resultFound == true)
			{
				this.setState({
					inputValue: num.toString(),
				})
			}
			else
			{
				this.setState({
					inputValue:inputValue == "0" ? num.toString() : inputValue + num.toString(),
				})
			}
			controlStateHistory.push(controlState)
			this.setState({
				resultFound:null,
				controlState:3,
				negativeNumber:null
			})			
		}
	}

}
