import _ from "lodash";
import {dirname} from "path";

class File {
  constructor({name, path}) {
    this.name = name;
    this.path = path;
    this.isFile = true;
  }

  contains(filterString) {
    return this.path.match(filterString);
  }
}

class Directory {
  constructor({name, path}) {
    this.name = name;
    this.path = path;
    this.isDir = true;
    this.children = {};
  }

  contains(filterString) {
    return this.children.some((childFile) => {
      return childFile.contains(filterString);
    });
  }

  has(name) {
    return !!this.get(name);
  }

  get(name) {
    return this.children[name];
  }

  add(name, file) {
    if(this.has(name)) {
      console.warn("Adding file that already exists: " + name);
    }
    this.children[name] = file;
    return this;
  }
}

class FileTree {
  constructor({paths}) {
    this.paths = paths;
    this.root = new Directory({name: "/", path: ""});
    paths.forEach((path) => addVirtualFile(this.root, path));
  }
}

function addVirtualFile(root, path) {
  const parts = path.split("/");
  const dirs = parts.slice(0, -1);
  const file = parts[parts.length - 1];

  dirs.reduce((cwd, dirName) => {
    if(!cwd.has(dirName)) {
      cwd.add(dirName, new Directory({name: dirName, path: `${cwd.path}/${dirName}`}));
    }
    return cwd.get(dirName);
  }, root).add(file, new File({name: file, path: path}));
}

export default FileTree;