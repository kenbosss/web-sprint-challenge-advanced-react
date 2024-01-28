import React, {useState}from 'react'
import axios from 'axios';
// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  const [message,useMessage] = useState(initialMessage);
  const [email,setEmail] = useState(initialEmail);
  const [steps,useSteps] = useState(initialSteps);
  const [index,useIndex] = useState(initialIndex);
  
  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return [x,y];
  }
  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
   const [x,y] = getXY()
    return `Coordinates (${x}, ${y})`
  }
  function reset() {
    // Use this helper to reset all states to their initial values.
    useMessage(initialMessage)
    setEmail(initialEmail)
    useSteps(initialSteps)
    useIndex(initialIndex)
  }
  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
   // this helper should return the current index unchanged.
  //  (1, 1)=0 (2, 1)=1 (3, 1)=2
  //   (1, 2)=3 (2, 2)=4 (3, 2)=5
  //   (1, 3)=6 (2, 3)=7 (3, 3)=8
  switch (direction) {
    case "left":
      return index % 3 !== 0 ? index - 1 : index;
      case 'right':
        return (index + 1) % 3 !== 0 ? index + 1 : index;
        case 'up':
          return index >= 3 ? index - 3 : index;
          case 'down':
            return index < 6 ? index + 3 : index;
    default:
      return index;
  }
  }
  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id
    const newIndex = getNextIndex(direction)
    if(newIndex === index){
      useMessage(`You can't go ${direction}`)
    }
    else{
     useIndex(newIndex)
     useSteps(steps + 1)
     useMessage(initialMessage)
    }
  }
  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value)
  }
  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
evt.preventDefault()
    const [x,y] =getXY()
axios.post('http://localhost:9000/api/result',{email,steps,x,y
})
.then(res =>{
  useMessage(res.data.message)
  setEmail(initialEmail)
}).catch(err =>{
  if(err.response && err.response.data){
    useMessage(err.response.data.message)
  }
  else{
    useMessage('an unexpected error occurred.')
  }
})
  }
  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates"> {getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button  id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange} ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
