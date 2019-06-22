import axios from "axios";
const API_URL = "http://localhost:3004";

export class VideoService {
  getVideoList() {
    const url = `${API_URL}/video/`;
    return axios.get(url).then(response => response.data);
  }

  getVideo(id) {
    const url = `${API_URL}/video/${id}`;
    return axios.get(url).then(response => response.data);
  }

  createVideo(video) {
    const url = `${API_URL}/video/`;
    return axios.post(url, video);
  }

  updateVideo(video) {
    const url = `${API_URL}/video/${video.id}`;
    return axios.put(url, video);
  }

  deleteVideo(video) {
    const url = `${API_URL}/video/${video.id}`;
    return axios.delete(url);
  }
}
