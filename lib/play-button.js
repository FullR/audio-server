import React from "react";
import {Howl} from "howler";

class PlayButton extends React.Component {
  constructor(props) {
    super(props);
    this.play = this.play.bind(this);
  }

  play(event) {
    event.preventDefault();
    const {sound} = this;
    if(sound) {
      sound.play();
    } else {
      this.sound = new Howl({
        urls: [this.props.path],
        autoplay: true
      });
    }
  }

  render() {
    return (
      <a href="#" onClick={this.play}>{this.props.children}</a>
    );
  }
}

export default PlayButton;
