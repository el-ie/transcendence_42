import { Link } from "react-router-dom";

function Menu(): JSX.Element {
 // return (
	//<>
	//<div className="menu">
	//  <Link to="/">Home</Link>
	//  <Link to="/login">Login</Link>
	//  <Link to="/home">Home</Link> // /home n existe plus
	//  <Link to="/social">Social</Link>
	//  <Link to="/game">Game</Link>
	//  <Link to="/game/:direct">Game</Link>
	//  <Link to="/profile/:userId">Profile</Link>
	//</div>
	//</>
 // );

	// Je crois que ce menu n est appelle nulle part

  return (
	<>
	<div className="menu">
	  <Link to="/">Home</Link>
	  <Link to="/login">Login</Link>
	  <Link to="/social">Social</Link>
	  <Link to="/game">Game</Link>
	  <Link to="/game/:direct">Game</Link>
	  <Link to="/profile/:userId">Profile</Link>
	</div>
	</>
  );
}

export default Menu;
