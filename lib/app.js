import React from "react";
import {get} from "superagent";
import PlayButton from "./play-button";
import FileTree from "./file-tree";
import File from "./file";

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.updateFilter = this.updateFilter.bind(this);
    this.renderFile = this.renderFile.bind(this);

    this.state = {
      files: window.__DATA.files || [],
      filter: ""
    };
  }

  fetchFileList() {
    get("/api/files").end((err, res) => {
      this.setState({
        files: res.body,
        filter: this.state.filter
      });
    });
  }

  componentDidMount() {
    //this.fetchFileList();
  }

  updateFilter(event) {
    this.setState({
      files: this.state.files,
      filter: event.target.value
    });
  }

  renderFile(file) {
    return (
      <div>
        <PlayButton path={file.path}>
          {file.name}
        </PlayButton>
      </div>
    );
  }

  renderFileList() {
    return (
      <div>
        {this.state.files.map((file) => this.renderFile(file))}
      </div>
    );
  }

  render() {
    let {files, filter} = this.state;
    if(filter && filter.trim().length) {
      files = files.filter(({name}) => name.match(filter));
    }
    const paths = files.map(({path}) => path);
    const fileTree = new FileTree({paths});

    return (
      <div>
        <input type="text" value={filter} onChange={this.updateFilter} placeholder="Filter"/>
        {files && files.length ? 
          <File file={fileTree.root} renderFile={this.renderFile}/> :
          null
        }
      </div>
    );
  }
}

function last(arr) {
  return arr[arr.length - 1];
}

console.log("---- Starting application");
React.render(<Application/>, document.body);
