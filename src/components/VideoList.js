import React, { Component } from "react";
import "./videoList.css";
import { VideoService } from "../services/VideoService";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
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
  ModalFooter,
  Spinner
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
  constructor() {
    super();

    this.state = {
      data: [],

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

    //instantiate service
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

    //search for videos available in database
    this.fetchVideos();
  }

  //fetch list of videos -service
  fetchVideos() {
    this.setState({ loading: true });
    this.videoService
      .getVideoList()
      .then(data => {
        this.setState({ data: data, loading: false });
      })
      .catch(error => {
        console.log(error);
        this.setState({ data: videoArray, loading: false }); //Mock data
      });
  }

  //redirect to add new video page
  onAddVideoClick(event) {
    this.props.history.push({
      pathname: `/addVideo`
    });
  }

  //clicking on edit icon will open a modal with video details
  onEditVideoClick(event, index) {
    var dataList = this.state.data;
    this.setState({ videoSelected: dataList[index] });
    console.log("Video selected", this.state.videoSelected);

    this.setState({ showEdit: true });
  }

  //clicking on delete icon will open a modal window asking for confirmation
  onDeleteVideoClick(event, index) {
    var dataList = this.state.data;
    this.setState({ videoSelected: dataList[index] });

    this.setState({ showConfirm: true });
  }

  //when user confirms in modal page - it calls delete service
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

    //close modal
    this.setState({ showConfirm: false });
  }

  //close edit modal
  onHandleClose() {
    this.setState({ showEdit: false });
  }

  //show edit modal
  handleShow() {
    this.setState({ showEdit: true });
  }

  //manage open/close status edit modal
  toggle() {
    this.setState(prevState => ({
      showEdit: !prevState.showEdit
    }));
  }

  //manage open/close status delete confirm modal
  toggleConfirm() {
    this.setState(prevState => ({
      showConfirm: !prevState.showConfirm
    }));
  }

  //manage input status when user enters video details
  handleInput = field => e => {
    let value = e.target.value;

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

  //Update video details
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

    //close modal
    this.setState({ showEdit: false });
  }

  //open modal to display and reproduce video when user selects url link
  showVideo(e, url) {
    e.stopPropagation();
    e.preventDefault();

    this.setState({ showModalVideo: true, showUrl: url });
  }

  //manage open/close status for video modal
  toggleShowVideo() {
    this.setState(prevState => ({
      showModalVideo: !prevState.showModalVideo
    }));
  }

  //close success/failure messages
  onDismiss() {
    this.setState({ visibleMessage: false });
  }

  render() {
    const spinner = (
      <div>
        <Spinner color="dark" />
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
              <Col md={{ size: 12, offset: 0 }}>
                <div className="float-right">
                  <button
                    id="addVideo"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onAddVideoClick}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span> </span>Add Video
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
