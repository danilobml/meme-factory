import "./App.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import domtoimage from "dom-to-image";

function App() {
  const [allMemes, setAllMemes] = useState();
  const [currentPicture, setCurrentPicture] = useState(); // undefined or {}
  const [userInput, setUserInput] = useState({
    top: "",
    bottom: "",
  });
  const [file, setFile] = useState(false);
  const elementRef = useRef();

  //Axios fetch. sets state for all means AND current picture

  useEffect(() => {
    const url = "https://api.imgflip.com/get_memes";
    axios.get(url).then((result) => {
      const memesFromTheFetch = result.data.data.memes;
      setAllMemes(memesFromTheFetch);
      setCurrentPicture(memesFromTheFetch[0]);
    });
  }, []);

  //Syntax below used to handle event for 2 inputs

  const handleUserInput = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value.toUpperCase() });
  };

  const prev = () => {
    setFile(false);
    setCurrentPicture(allMemes[0]);
    const currentPicIndex = allMemes.findIndex((item) => currentPicture.id === item.id);
    if (currentPicIndex >= 1) {
      setCurrentPicture(allMemes[currentPicIndex - 1]);
    }
  };

  const next = () => {
    setFile(false);
    setCurrentPicture(allMemes[1]);
    const currentPicIndex = allMemes.findIndex((item) => currentPicture.id === item.id);
    if (currentPicIndex >= 0 && currentPicIndex < allMemes.length - 1) {
      setCurrentPicture(allMemes[currentPicIndex + 1]);
    }
  };

  const handleFileInput = (e) => {
    setFile(true);
    const fileURL = URL.createObjectURL(e.target.files[0]);
    setCurrentPicture(fileURL);
  };

  const handleGenerate = () => {
    domtoimage.toJpeg(elementRef.current, { quality: 1.0 }).then(function (dataUrl) {
      var link = document.createElement("a");
      link.download = "meme.jpeg";
      link.href = dataUrl;
      link.click();
    });
  };

  if (!currentPicture) return null;

  return (
    <div className="App">
      <div>
        <form onChange={(e) => handleUserInput(e)}>
          <label>Type top and bottom texts:</label>
          <input name="top" type="text" />
          <input name="bottom" type="text" />
        </form>
        <br />
        <label>Choose a meme:</label>
        <button onClick={prev}>Previous Picture</button>
        <button onClick={next}>Next Picture</button>
        <br />
        <label htmlFor="file-pic">Or use your own pic:</label>
        <input type="file" name="file-pic" id="file-pic" onChange={(e) => handleFileInput(e)} />
      </div>
      <div className="pic-div" ref={elementRef}>
        <img className="pic" src={file ? currentPicture : currentPicture.url} alt="Meme Picture" />
        {userInput && (
          <>
            <h1 className="top-text">{userInput.top}</h1>
            <h1 className="bottom-text">{userInput.bottom}</h1>
          </>
        )}
      </div>
      <button className="download" onClick={handleGenerate}>
        Download Meme
      </button>
    </div>
  );
}

export default App;
