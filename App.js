asdasd
import { View,Text} from 'react-native';
import Style from './Style.js';
import InputButton from './InputButton';

// Array containing the inputbuttons that will be displayed in the calculator 
const inputButtons = [
	[1,2,3, '/'],
	[4,5,6, '*'],
	[7,8,9, '-'],
	[0,'.','=','+'],
	['C','CE']
];
export default class ReactCalculator extends Component {

	constructor(props){
		super(props);

		this.state = {
			previousInputValue: 0,
			inputValue: 0,
			selectedSymbol: null,
			selectedDecimalPoint: null,
			fractionPrecision: 0,
			resultFound: null
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
			case 'string':
				return this._handleStringInput(input)
		}
	}

	_handleStringInput(str){
		switch(str){
			case 'C' :
				this.setState({
					inputValue: 0
				});
				break;
			case 'CE':
				this.setState({
					previousInputValue: 0,
					inputValue: 0,
					selectedSymbol: null,
					selectedDecimalPoint: null,
					fractionPrecision: 0,
					resultFound:null
				});
				break;
			case '.' :
				let isfraction = this.state.selectedDecimalPoint;
				//TO protect against pressing the decimal point twice 
				if(!isfraction)
				{
					let fractionPrecision = this.state.fractionPrecision;
					this.setState({
						selectedDecimalPoint: true,
						fractionPrecision: fractionPrecision+1
					});
				}
				break;
			case '/' :
			case '*' :
			case '+' :
			case '-' :
				this.setState({
					selectedSymbol:str,
					previousInputValue:this.state.inputValue,
					inputValue:0,
					selectedDecimalPoint:null,
					fractionPrecision:0
				});
				break;
			case '=':
				let symbol = this.state.selectedSymbol,
				inputValue = this.state.inputValue,
				previousInputValue = this.state.previousInputValue;

				if(!symbol){
					return;
				}

				this.setState({
					previousInputValue: 0,
					inputValue: [eval(previousInputValue + symbol + inputValue) == Infinity ? "Math Error" 
								:eval(previousInputValue + symbol + inputValue)],
					selectedSymbol: null,
					selectedDecimalPoint:null,
					fractionPrecision:0,
					resultFound:true
				});
				break;
		}
	}

	_handleNumberInput(num){
		let isfraction = this.state.selectedDecimalPoint,
		fractionPrecision = this.state.fractionPrecision,
		resultFound = this.state.resultFound;

		if(isfraction)
		{
			if(resultFound==true)
			{
				inputValue = 0 + (num/(Math.pow(10,1)));
			}
			else
			{
				inputValue = this.state.inputValue + (num/(Math.pow(10,fractionPrecision)));
			}
			//Inline if statement messes with input variable ( end up with 0.2.002 as input etc)
			//inputValue = [resultFound == true ? 0 + (num/(Math.pow(10,1))) : (this.state.inputValue) + (num/(Math.pow(10,fractionPrecision)))];
			
			this.setState({
				fractionPrecision:fractionPrecision+1
				
			})
		}
		else
		{
			if(resultFound==true)
			{
				inputValue = num;
			}
			else
			{
				inputValue = (this.state.inputValue * 10) + num;
			}
			//Inline if statement messes with input variable ( end up with 0.2.002 as input etc)
			//inputValue = [resultFound == true ? num : (this.state.inputValue * 10) + num];
		}

		this.setState({
			inputValue:inputValue,
			resultFound:null
		})
	}

}

/*
const Styles = StyleSheet.create({
	rootContainer: {
		flex : 1
	},
	displayContainer: {
		flex: 2 ,
		backgroundColor: '#193441',
	},
	inputContainer: {
		flex: 8 ,
		backgroundColor: '#3E606F'
	},
});
*/

//AppRegistry.registerComponent('ReactCalculator', () => ReactCalculator);
