import "./App.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import domtoimage from "dom-to-image";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Container, Image, Row, Col } from "react-bootstrap";

function App() {
  const [allMemes, setAllMemes] = useState();
  const [currentPicture, setCurrentPicture] = useState();
  const [userInput, setUserInput] = useState({
    top: "",
    bottom: "",
  });
  const [file, setFile] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const url = "https://api.imgflip.com/get_memes";
    axios.get(url).then((result) => {
      const memesFromTheFetch = result.data.data.memes;
      setAllMemes(memesFromTheFetch);
      setCurrentPicture(memesFromTheFetch[0]);
    });
  }, []);

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
    <Container fluid className="App mx-auto my-auto">
      <h2>Meme Factory!</h2>
      <div>
        <Row>
          <Col className="mx-auto" sm={5}>
            <Form.Group className="mb-0 mx-auto my-auto" onChange={(e) => handleUserInput(e)}>
              <Form.Control size="sm" placeholder="Type top text (optional)" className="mx-auto mb-2" name="top" id="top" type="text" />
              <Form.Control size="sm" placeholder="Type bottom text (optional)" className="mx-auto mb-2" name="bottom" id="bottom" type="text" />
            </Form.Group>
            <Form.Group className="mx-auto mb-0">
              <label>Choose a meme pic:</label>
              <br />
              <Button variant="secondary" size="sm" className="m-1" onClick={prev}>
                Prev Picture
              </Button>
              <Button variant="secondary" size="sm" className="m-1" onClick={next}>
                Next Picture
              </Button>
            </Form.Group>
            <br />
            <Form.Group controlId="formFileSm" className="m-1 mt-0 mx-auto file">
              <label htmlFor="file-input">Or use your own:</label>
              <Form.Control type="file" id="file-input" size="sm" onChange={(e) => handleFileInput(e)} />
            </Form.Group>
          </Col>
        </Row>
      </div>
      <div className="pic-div" ref={elementRef}>
        <Image fluid className="pic" src={file ? currentPicture : currentPicture.url} alt="Meme Picture" />
        {userInput && (
          <>
            <h1 className="top-text">{userInput.top}</h1>
            <h1 className="bottom-text">{userInput.bottom}</h1>
          </>
        )}
      </div>
      <Button variant="success" size="sm" className="m-1 mx-auto download" onClick={handleGenerate}>
        Download Meme
      </Button>
    </Container>
  );
}

export default App;
