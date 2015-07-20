import React from "react";
import _ from "lodash";

/*
  Recursive component for displaying file/directory trees
*/
class File extends React.Component {
  constructor(props) {
    super(props);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.state = {
      open: true
    };
  }

  toggleOpen(event) {
    event.preventDefault();
    this.setState({open: !this.state.open});
  }

  render() {
    const {file} = this.props;
    const {open} = this.state;
    const animTime = 0.25;
    const childStyles = {
      position: "relative", 
      marginLeft: 30, 
      overflow: "hidden",
      maxHeight: open ? 9999 : 0,
      opacity: open ? 1 : 0.25,
      transition: `max-height ${animTime}s ease-in-out, opacity ${animTime}s ease-in-out`
    };

    if(file.isDir) {
      return (
        <div {...this.props}>
          <div style={{fontWeight: "bold"}}>{file.name}<a style={{marginLeft: 10}} href="#" onClick={this.toggleOpen}>{open ? "close" : "open"}</a></div>
          <div style={childStyles}>
            {_.map(file.children, (childFile) =>
              <File key={childFile.path} {...this.props} file={childFile} depth={this.props.depth + 1}/>
            )}
          </div>
        </div>
      );
    } else {
      return this.props.renderFile(file);
    }
  }
}

File.defaultProps = {
  depth: 0,
  renderFile(file) {
    return <div>{file.name}</div>;
  }
};

export default File;
