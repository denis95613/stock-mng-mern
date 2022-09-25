import React, { Fragment, useRef, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Input,
  Button,
  Form,
} from "reactstrap";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import ReactAudioPlayer from "react-audio-player";
import add from "../../../assets/utils/images/add.png";
import record from "../../../assets/utils/images/record.png";
import playImg from "../../../assets/utils/images/play.png";
import stopImg from "../../../assets/utils/images/stop.png";
import camera from "../../../assets/utils/images/camera.png";
import { useSnackbar } from "react-simple-snackbar";
import snackBarOptions from "../../../assets/snackbarOptions";
import { useDispatch } from "react-redux";
import { uploadWord } from "../../../store/actions/manageWords";

const AddNewWord = () => {
  const [wordInfo, setWordInfo] = useState({
    word: "",
    audio: "",
    graphic: "",
  });
  const hiddenAudioInput = useRef("audioField");
  const hiddenGraphicInput = useRef("graphicField");
  const [recordstate, setrecordstate] = useState("NONE");
  const [blobURL, setblobURL] = useState("");
  const [showRecord, setShowRecord] = useState(false);
  const [openSnackbar, closeSnackbar] = useSnackbar(snackBarOptions);
  const dispatch = useDispatch();

  const handleWordChange = (e) => {
    setWordInfo({ ...wordInfo, [e.target.name]: e.target.value.toUpperCase() });
  };
  const handleAudioUpload = (e) => {
    setWordInfo({ ...wordInfo, audio: e.target.files[0] });
  };
  const handleGraphicUpload = (e) => {
    setWordInfo({ ...wordInfo, graphic: e.target.files[0] });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (wordInfo.word) {
      if (wordInfo.audio && wordInfo.graphic) {
        const formData = new FormData();
        formData.append("word", wordInfo.word);
        formData.append("files", wordInfo.audio);
        formData.append("files", wordInfo.graphic);

        dispatch(uploadWord(formData, openSnackbar));
        document.getElementById("word").value = "";
        setWordInfo({
          word: "",
          audio: "",
          graphic: "",
        });
      } else {
        openSnackbar("Please attach files");
      }
    } else {
      openSnackbar("Please Type the word");
    }
  };
  const handleShowRecord = () => {
    setShowRecord(!showRecord);
  };
  const start = () => {
    console.log(recordstate);
    setrecordstate(RecordState.START);
  };

  const stop = () => {
    setrecordstate(RecordState.STOP);
  };

  const onStop = (audioData) => {
    console.log("audio data: " + audioData.url);
    setblobURL(audioData.url);
  };

  return (
    <Fragment>
      <Row style={{ height: "10%" }}></Row>
      <Row>
        <Col md="3" lg="3"></Col>
        <Col md="6" lg="6">
          <Card className="main-card text-white card-border">
            <CardTitle className="ms-2 mt-3">Προσθέτω καινούρια λέξη</CardTitle>
            <CardBody>
              <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Input
                  className="mb-2"
                  type="text"
                  name="word"
                  id="word"
                  placeholder="Type the word"
                  style={{ borderColor: "green" }}
                  onChange={handleWordChange}
                />
                <Row className="mr-2">
                  <Col md="7" lg="7">
                    <input
                      className="mb-2"
                      type="file"
                      ref={hiddenAudioInput}
                      onChange={handleAudioUpload}
                      hidden
                      multiple={false}
                    />
                    <Input
                      type="button"
                      id="audioBtn"
                      className="mb-2"
                      color="inherit"
                      style={{
                        borderColor: "green",
                        width: "100%",
                        backgroundImage: `url(${add})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "95% 50%",
                      }}
                      onClick={() => hiddenAudioInput.current.click()}
                      value="Upload the Audio"
                    />
                  </Col>
                  <Col md="2" lg="2" style={{ textAlign: "right" }}>
                    <span
                      style={{
                        color: "black",
                      }}
                    >
                      OR
                    </span>
                  </Col>
                  <Col md="3" lg="3" style={{ textAlign: "right" }}>
                    <Button
                      className="mb-2"
                      color="inherit"
                      style={{
                        borderColor: "green",
                        width: "42px",
                        height: "42px",
                        backgroundImage: `url(${record})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "50% 50%",
                      }}
                      onClick={handleShowRecord}
                    />
                  </Col>
                </Row>
                <Row className="text-center">
                  {wordInfo.audio ? (
                    <span
                      className="mb-1"
                      style={{ color: "blue", fontSize: "14px" }}
                    >
                      Selected {wordInfo.audio.name}
                    </span>
                  ) : (
                    <span
                      className="mb-1"
                      style={{ color: "red", fontSize: "14px" }}
                    >
                      *Only upload audio with wav, mp3, mp4, m4a!
                    </span>
                  )}
                </Row>

                {showRecord && (
                  <Row className="g-0">
                    <Row className="g-0" style={{ textAlign: "center" }}>
                      <AudioReactRecorder
                        state={recordstate}
                        onStop={onStop}
                        canvasWidth="100%"
                        canvasHeight="50px"
                        foregroundColor="green"
                        backgroundColor="white"
                      />
                    </Row>
                    <Row className="g-0">
                      <Col md="8" lg="8">
                        <ReactAudioPlayer
                          src={blobURL}
                          controls
                          style={{ width: "100%", height: "42px" }}
                        />
                      </Col>
                      <Col md="4" lg="4" style={{ textAlign: "right" }}>
                        <Button
                          className="mb-2 ms-2"
                          color="inherit"
                          style={{
                            borderColor: "green",
                            width: "42px",
                            height: "42px",
                            backgroundImage: `url(${playImg})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "50% 50%",
                          }}
                          onClick={start}
                        />
                        <Button
                          className="mb-2 ms-2"
                          color="inherit"
                          style={{
                            borderColor: "green",
                            width: "42px",
                            height: "42px",
                            backgroundImage: `url(${stopImg})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "50% 50%",
                          }}
                          onClick={stop}
                        />
                      </Col>
                    </Row>
                    <Row className="text-center">
                      <span
                        className="mb-1"
                        style={{ color: "red", fontSize: "14px" }}
                      >
                        *After recorded, download and upload renamed audio!
                      </span>
                    </Row>
                  </Row>
                )}

                <Row className="mr-2">
                  <Col md="7" lg="7">
                    <input
                      className="mb-2"
                      type="file"
                      ref={hiddenGraphicInput}
                      onChange={handleGraphicUpload}
                      hidden
                      multiple={false}
                    />
                    <Input
                      type="button"
                      id="graphicBtn"
                      className="mb-2"
                      color="inherit"
                      style={{
                        borderColor: "green",
                        width: "100%",
                        backgroundImage: `url(${add})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "95% 50%",
                      }}
                      onClick={() => hiddenGraphicInput.current.click()}
                      value="Upload the Graphic"
                    />
                  </Col>
                  <Col md="2" lg="2" style={{ textAlign: "right" }}>
                    <span
                      style={{
                        color: "black",
                      }}
                    >
                      OR
                    </span>
                  </Col>
                  <Col md="3" lg="3" style={{ textAlign: "right" }}>
                    <Button
                      className="mb-2"
                      color="inherit"
                      style={{
                        borderColor: "green",
                        width: "42px",
                        height: "42px",
                        backgroundImage: `url(${camera})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "50% 50%",
                      }}
                      //   onClick={() => hiddenFileInput.current.click()}
                    />
                  </Col>
                </Row>
                <Row className="text-center">
                  {wordInfo.graphic ? (
                    <span
                      className="mb-1"
                      style={{ color: "blue", fontSize: "14px" }}
                    >
                      Selected {wordInfo.graphic.name}
                    </span>
                  ) : (
                    <span
                      className="mb-1"
                      style={{ color: "red", fontSize: "14px" }}
                    >
                      *Only upload graphic with jpg, jpeg, png and gif!
                    </span>
                  )}
                </Row>
                <Button
                  type="submit"
                  className="mt-3"
                  color="success"
                  style={{ width: "100%", color: "white", fontWeight: "bold" }}
                >
                  Save
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col md="3" lg="3"></Col>
      </Row>
    </Fragment>
  );
};

export default AddNewWord;
