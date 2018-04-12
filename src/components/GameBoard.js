import React, {Component} from 'react';

class GameBoard extends Component{

  constructor(props){
     super(props);

     this.state ={
       gameOver : true,
       gamePlaying: false,
       redCount: 0,
       blueCount: 0,
       turn: "red",
       phase: "set",
       prompt: "prompt",
       winner: ""
     }
     this.boardSize = 29;
     this.setMax = 40;
     this.maxGameCycle = 500;
     this.loopsPerSecond = 25;
     this.loopTime = 1000/this.loopsPerSecond;
     this.lifeCycle = 0;
     this.start();

     this.dummyRed = 0;
     this.dummyBlue = 0;



   }

   start(){
     this.setState({
       gameOver : false,
       gamePlaying: true,
       redCount: 0,
       blueCount: 0,
       turn: "red",
       phase: "set",
       prompt: "Red's Turn",
       winner: ""
     });
     this.lifeCycle = 0;
     this.gameBoard = [];
     var boardLine = [];
     for(var i = 0; i < this.boardSize; i++){
       boardLine = [];
       for(var j = 0; j < this.boardSize; j++){
         boardLine[j] = "dead";
       }
       this.gameBoard.push(boardLine);
     }

   }

   clickCell(i, j){
    if(this.state.gamePlaying && this.state.phase==="set" && (this.state.redCount<this.setMax
          || this.state.blueCount<this.setMax) && this.gameBoard[i][j] === "dead"){

       this.gameBoard[i][j] = this.state.turn;
       var totalCount = 0;
       totalCount = this.state.blueCount + this.state.redCount + 1;
       if(this.state.turn === "red"){
         this.setState({
           turn : "blue",
           redCount : this.state.redCount + 1,
           prompt: "Blue's Turn"
         })
       }
       else {
         this.setState({
           turn : "red",
           blueCount : this.state.blueCount + 1,
           prompt: "Red's Turn"
         })
       }
     }
     if(totalCount === this.setMax*2){
       this.setState({
         phase: "cycle"
       })
       this.startSimulation();
     }
   }
   startSimulation(){
     this.simulation = setInterval(function(){ this.cycle() }.bind(this), this.loopTime);
   }

   cycle(){
     if(!this.state.gameOver){
       var redCounts = 0;
       var blueCounts = 0;
       var newGameBoard = [];
       var boardLine = [];
       for(var i = 0; i < this.boardSize; i++){
         boardLine = [];
         for(var j = 0; j < this.boardSize; j++){
           boardLine[j] = this.determineCell(i,j);
           if(boardLine[j] ==="red"){
             redCounts++;
           }
           else if(boardLine[j] ==="blue"){
             blueCounts++;
           }
         }
         newGameBoard.push(boardLine);
       }
       this.gameBoard = newGameBoard;
       this.lifeCycle++;
       this.setState({
         redCount:redCounts,
         blueCount: blueCounts,
         gameOver: redCounts+blueCounts === 0
       })

       if(redCounts+blueCounts === 0 || this.lifeCycle >= this.maxGameCycle){

         console.log("ended");
         clearInterval(this.simulation);
         if( redCounts === 0 && blueCounts ===0){
           this.winner = "Extinction";
         }
         else if(redCounts > blueCounts){
           this.winner = "Winner: Red";
         }
         else if(redCounts < blueCounts){
           this.winner = "Winner: Blue";
         }
         else {
           this.winner = "Tie";
         }
         this.setState({
           winner: this.winner
         });
       }
     }
     else {
       clearInterval(this.simulation);
     }
   }

   determineCell(i,j){
     this.dummyRed = 0;
     this.dummyBlue = 0;
     for(var ii = i-1; ii <= i+1; ii++){
       if(ii < 0 || ii >= this.boardSize){
         continue;
       }
       for(var jj = j-1; jj <= j+1; jj++){
         if(jj < 0 || jj >= this.boardSize || (jj===j && ii===i)){
           continue;
         }
         if(this.gameBoard[ii][jj]==="red"){
           this.dummyRed++;
         }
         else if(this.gameBoard[ii][jj]==="blue"){
           this.dummyBlue++;
         }

       }
     }

     if(this.gameBoard[i][j] ==="dead" && (this.dummyRed+this.dummyBlue === 3)){
       if(this.dummyRed > this.dummyBlue){
         return "red";
       }
       else {
         return "blue";
       }
     }
     else {
       if(this.dummyRed+this.dummyBlue < 2){
         return "dead";
       }
       else if(this.dummyRed+this.dummyBlue < 4){
         return this.gameBoard[i][j];
       }
       else {
         return "dead";
       }
     }
   }

   handleLoopchange(e){
      this.loopsPerSecond = e.target.value;
      this.loopTime = 1000/this.loopsPerSecond;
      if(this.state.phase === "cycle"){
        clearInterval(this.simulation);
        this.startSimulation();
      }
      this.setState({

      });
   }
   handleMaxChange(e){
      this.setMax = e.target.value;
      this.setState({

      });
      if(this.state.blueCount+this.state.redCount >= this.setMax*2){
        this.setState({
          phase: "cycle"
        })
        this.startSimulation();
      }
   }


  render(){

    return(
      <div className="container">
        <div className= "row">
          <div id="prompt" className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
            <h1>{this.state.prompt}</h1>
            <div>Red:{this.state.redCount}</div>
            <div>Blue:{this.state.blueCount}</div>
            <div>Cycle:{this.lifeCycle}</div>
            <div>Phase:{this.state.phase}</div>
            <div >{this.state.winner}</div>
            <span className="btn btn-primary" onClick={()=>this.start()}>Start</span>
            <input
             type="range"
             className="seek-bar duration-slider"
             value={this.loopsPerSecond}
             max="50"
             min="1"
             step="1"
             onChange={this.handleLoopchange.bind(this)}
             />
             <div>Rate:{this.loopsPerSecond} </div>

             <input
              type="range"
              className="seek-bar duration-slider"
              value={this.setMax}
              max="50"
              min="10"
              step="1"
              onChange={this.handleMaxChange.bind(this)}
              />
              <div>Set Goal:{this.setMax} </div>
          </div>
          <table className='col-lg-10 col-md-10 col-sm-10 col-xs-10'>
            { this.gameBoard.map((line, index) => {
               return <tr>{
                 this.gameBoard[index].map((cell, index2) => {
                   return <td className={
                     this.gameBoard[index][index2]==="dead"?"white-Cell":
                     this.gameBoard[index][index2]==="red"?"red-Cell":"blue-Cell"
                   }
                    onClick={()=>this.clickCell(index, index2)}><span className="hidden-text">Yo</span></td>
                 })

               }</tr>;
           })}
          </table>
        </div>
      </div>

    );
  }
}
export default GameBoard;
