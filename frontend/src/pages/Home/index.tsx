import '/app/src/css/index.css';
import image from '/app/src/image_intro.png';

function App() {
  return (
	<>
	<img src={image} alt="intro" style={{width: '30%', alignSelf: 'center', flex: 1}}/>
    <div>classic hardcore pong game</div>
	</>
  )
}

export default App;
