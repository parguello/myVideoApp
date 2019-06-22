import React, { Component } from "react";
import "./videoList.css";
import { VideoService } from "../services/VideoService";

import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Alert,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { Container, Row, Col } from "reactstrap";

const videoArray = [
  {
    id: 1,
    name: "chameleon bubles",
    url: "https://www.youtube.com/embed/xn54TvpGu7E"
  }
];

export class VideoList extends Component {
  //class VideoList extends Component {
  constructor() {
    super();
    // this.
    this.state = {
      data: [],
      //dataEdit: { id: "", name: "", url: "" },
      videoSelected: { id: "", name: "", url: "" },
      showEdit: false,
      showModalVideo: false,
      showConfirm: false,
      showUrl: "",
      visibleMessage: false,
      colorMessage: "info",
      loading: false,
      dataTableValue: [],
      dataTableSelection: null,
      id: null
    };

    this.videoService = new VideoService();

    this.fetchVideos = this.fetchVideos.bind(this);
    this.onAddVideoClick = this.onAddVideoClick.bind(this);
    this.onEditVideoClick = this.onEditVideoClick.bind(this);
    this.onUpdateVideoClick = this.onUpdateVideoClick.bind(this);
    this.onDeleteVideoClick = this.onDeleteVideoClick.bind(this);
    this.onDeleteVideoConfirmed = this.onDeleteVideoConfirmed.bind(this);
    this.onHandleClose = this.onHandleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleShowVideo = this.toggleShowVideo.bind(this);
    this.toggleConfirm = this.toggleConfirm.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    //this.setState({ loading: true });

    this.fetchVideos();
  }

  //fetch list of videos -service
  fetchVideos() {
    this.videoService
      .getVideoList()
      .then(data => this.setState({ data: data }))
      .catch(error => {
        console.log(error);
        this.setState({ data: videoArray }); //Mock data
      });
  }

  onAddVideoClick(event) {
    this.props.history.push({
      pathname: `/addVideo`
    });
  }

  onEditVideoClick(event, index) {
    var dataList = this.state.data;
    this.setState({ videoSelected: dataList[index] });

    this.setState({ showEdit: true });
  }

  onDeleteVideoClick(event, index) {
    var dataList = this.state.data;
    this.setState({ videoSelected: dataList[index] });

    this.setState({ showConfirm: true });
  }
  onDeleteVideoConfirmed() {
    //call delete api

    this.videoService
      .deleteVideo(this.state.videoSelected)
      .then(res => {
        this.setState({
          visibleMessage: true,
          colorMessage: "success",
          message: "Video deleted successfully"
        });
        this.fetchVideos();
      })
      .catch(error => {
        this.setState({
          visibleMessage: true,
          colorMessage: "danger",
          message: "Video deletion failed"
        });
      });

    this.setState({ showConfirm: false });
  }

  onHandleClose() {
    this.setState({ showEdit: false });
  }

  handleShow() {
    this.setState({ showEdit: true });
  }
  toggle() {
    this.setState(prevState => ({
      showEdit: !prevState.showEdit
    }));
  }

  toggleConfirm() {
    this.setState(prevState => ({
      showConfirm: !prevState.showConfirm
    }));
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

  onUpdateVideoClick() {
    //call update service
    this.videoService
      .updateVideo(this.state.videoSelected)
      .then(res => {
        this.setState({
          visibleMessage: true,
          colorMessage: "success",
          message: "Video updated successfully"
        });
        this.fetchVideos();
      })
      .catch(error => {
        this.setState({
          visibleMessage: true,
          colorMessage: "danger",
          message: "Video update failed"
        });
      });
  }

  showVideo(e, url) {
    e.stopPropagation();
    e.preventDefault();

    this.setState({ showModalVideo: true, showUrl: url });
  }

  toggleShowVideo() {
    this.setState(prevState => ({
      showModalVideo: !prevState.showModalVideo
    }));
  }

  onDismiss() {
    this.setState({ visibleMessage: false });
  }

  render() {
    const spinner = (
      <div className="splash-screen">
        <div className="splash-container">
          <div className="logo" />
          <div className="load-bar">
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
          </div>
        </div>
      </div>
    );

    const contentPage = (
      <div>
        <div className="flex-container">
          <Alert
            color={this.state.colorMessage}
            isOpen={this.state.visibleMessage}
            toggle={this.onDismiss}
          >
            {this.state.message}
          </Alert>
          <Container>
            <Row>
              <Col md="12" md={{ size: 12, offset: 0 }}>
                <div className="float-right">
                  <button
                    id="addVideo"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onAddVideoClick}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Add Video
                  </button>
                </div>

                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">URL</th>
                      <th scope="col" />
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.data.map((listValue, index) => {
                      return (
                        <tr key={index}>
                          <td>{listValue.id}</td>
                          <td>{listValue.name}</td>
                          <td>
                            <a
                              href={listValue.url}
                              onClick={e => this.showVideo(e, listValue.url)}
                            >
                              {listValue.url}
                            </a>
                          </td>
                          <td>
                            <FontAwesomeIcon
                              icon={faEdit}
                              size="lg"
                              onClick={e => {
                                this.onEditVideoClick(e, index);
                              }}
                            />
                          </td>
                          <td>
                            <FontAwesomeIcon
                              icon={faTrash}
                              size="lg"
                              onClick={e => {
                                this.onDeleteVideoClick(e, index);
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <Modal isOpen={this.state.showEdit} toggle={this.toggle}>
                  <ModalHeader toggle={this.toggle}>Edit New Video</ModalHeader>
                  <ModalBody>
                    <Form>
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
                          disabled
                        />
                      </FormGroup>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.onUpdateVideoClick}>
                      Save
                    </Button>{" "}
                    <Button color="secondary" onClick={this.toggle}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>

                <Modal
                  isOpen={this.state.showModalVideo}
                  toggle={this.toggleShowVideo}
                >
                  <ModalHeader toggle={this.toggleShowVideo}>
                    View Video
                  </ModalHeader>
                  <ModalBody>
                    <div id="media">
                      <iframe
                        title="video"
                        width="400"
                        height="250"
                        src={this.state.showUrl}
                      />
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={this.toggleShowVideo}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>

                <Modal
                  isOpen={this.state.showConfirm}
                  toggle={this.toggleConfirm}
                >
                  <ModalHeader toggle={this.toggleConfirm}>
                    View Video
                  </ModalHeader>
                  <ModalBody>
                    <p>Are you sure you want to delete this video?</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      onClick={this.onDeleteVideoConfirmed}
                    >
                      Delete
                    </Button>
                    <Button color="secondary" onClick={this.toggleConfirm}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );

    return (
      <div>
        <div>{this.state.loading ? spinner : contentPage}</div>
      </div>
    );
  }
}
export default VideoList;
