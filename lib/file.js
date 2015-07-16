import React from "react";
import _ from "lodash";

class File extends React.Component {
  constructor(props) {
    super(props);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.state = {
      open: true//this.props.isOpen(this)
    };
  }

  toggleOpen(event) {
    event.preventDefault();
    this.setState({open: !this.state.open});
  }

  render() {
    const {file} = this.props;
    const {open} = this.state;

    if(file.isDir) {
      return (
        <div {...this.props}>
          <div style={{fontWeight: "bold"}}>{file.name}<a style={{marginLeft: 10}} href="#" onClick={this.toggleOpen}>{open ? "close" : "open"}</a></div>
          {open ? 
            <div style={{position: "relative", left: 20}}>
              {_.map(file.children, (childFile) => 
                <File key={childFile.path} {...this.props} file={childFile} depth={this.props.depth + 1}/>
              )}
            </div> : null
          }
        </div>
      );
    } else {
      return this.props.renderFile(file);
    }
  }
}

File.defaultProps = {
  depth: 0,
  isOpen() {
    return true;
  },
  renderFile(file) {
    return <div>{file.name}</div>;
  }
};

export default File;
