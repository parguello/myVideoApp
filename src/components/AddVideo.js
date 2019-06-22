import React, { Component } from "react";
import "./videoList.css";
import { Alert, Form, FormGroup, Input, Label, Button } from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import { VideoService } from "../services/VideoService";

//var videoService = new VideoService();
export class AddVideo extends Component {
  constructor() {
    super();
    this.state = {
      videoSelected: { id: "", name: "", url: "" },
      showEdit: false,
      visibleMessage: false,
      colorMessage: "info",
      loading: false,
      dataTableValue: [],
      dataTableSelection: null,
      id: null
    };

    this.videoService = new VideoService();
    this.onBack = this.onBack.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onAddVideoClick = this.onAddVideoClick.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    //this.setState({ loading: true });
  }

  onBack() {
    this.props.history.push({
      pathname: `/`
    });
  }

  handleInput = field => e => {
    let value = e.target.value;
    //let name = e.target.name;
    this.setState(
      prevState => {
        return {
          videoSelected: {
            ...prevState.videoSelected,
            [field]: value
          }
        };
      },
      () => {
        console.log("dataEdit", this.state.dataEdit);
      }
    );
  };

  onAddVideoClick() {
    //call update service
    //fetch list

    //new VideoService()
    this.videoService
      .createVideo(this.state.videoSelected)
      .then(res => {
        this.setState({
          visibleMessage: true,
          colorMessage: "success",
          message: "Video created successfully"
        });
      })
      .catch(error => {
        this.setState({
          visibleMessage: true,
          colorMessage: "danger",
          message: "Video creation failed"
        });
      });
  }
  onDismiss() {
    this.setState({ visibleMessage: false });
  }
  render() {
    return (
      <div>
        <Alert
          color={this.state.colorMessage}
          isOpen={this.state.visibleMessage}
          toggle={this.onDismiss}
        >
          {this.state.message}
        </Alert>
        <Container>
          <Row>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <div className="square">
                <Form>
                  <h4>Add a new video</h4>
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="name"
                      value={this.state.videoSelected.name}
                      onChange={this.handleInput("name")}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="url">URL</Label>
                    <Input
                      type="text"
                      name="url"
                      id="url"
                      placeholder="url"
                      value={this.state.videoSelected.url}
                      onChange={this.handleInput("url")}
                    />
                  </FormGroup>
                </Form>
                <Button color="success" onClick={this.onAddVideoClick}>
                  Save
                </Button>{" "}
                <Button color="secondary" onClick={this.onBack}>
                  Back
                </Button>
              </div>
              {this.state.videoSelected.url ? (
                <div id="media">
                  <iframe
                    title="video"
                    width="400"
                    height="250"
                    src={this.state.videoSelected.url}
                  />
                </div>
              ) : (
                ""
              )}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
export default AddVideo;
