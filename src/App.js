import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: ["home"],
      folders: [],
      files: [],
      isFile: null
    };
  }

  getContents = async function(path) {
    // if path is a dir, returns the files or subdirectories in the dir, and their types, as well as the metadata (name and type) of the current directory
    // if path is a file, returns the metadata (name and type) of the file
    // returns null if invalid path
    let root = {
      type: "dir",
      children: {
        home: {
          type: "dir",
          children: {
            myname: {
              type: "dir",
              children: {
                "filea.txt": {
                  type: "file"
                },
                "fileb.txt": {
                  type: "file"
                },
                projects: {
                  type: "dir",
                  children: {
                    mysupersecretproject: {
                      type: "dir",
                      children: {
                        mysupersecretfile: {
                          type: "file"
                        }
                      }
                    }
                  }
                }
              }
            },
            testfile1: {
              type: "file"
            }
          }
        }
      }
    };

    const isFile = path[path.length - 1] === "/";
    // navigate to path folder or file
    let content = root.children;

    (isFile ? path.slice(0, path.length - 1) : path)
      .split("/")
      .forEach((s, i, a) => {
        if (i == a.length - 1 && isFile) {
          content = content
            ? Object.keys(content).filter(
                c => c == s && content[c].type == "file"
              )
            : null;
        } else {
          content = content && content[s] ? content[s].children : null;
        }
      });

    return content;
  };

  componentDidMount() {
    this.updateFolderContent(this.state.path);
  }

  updateFolderContent(path) {
    this.getContents(path.join("/")).then(content => {
      // update state
      this.setState({
        folders: Object.keys(content).filter(c => content[c].type == "dir"),
        files: Object.keys(content).filter(c => content[c].type == "file"),
        path,
        isFile: null
      });
    });
  }

  handleDirClick(d) {
    const path = [...this.state.path, d];
    this.updateFolderContent(path);
  }

  handleFileClick(f) {
    this.setState({ isFile: f, path: [...this.state.path, f] });
  }

  handlePathClick(i) {
    // make path up to i
    this.updateFolderContent(this.state.path.slice(0, i + 1));
  }

  render() {
    return (
      <div id="main">
        <div>
          <div className="title">Current Path</div>
          {this.state.path.map((s, i, a) => (
            <span
              className="dir-seg"
              key={i}
              onClick={() => {
                !(i == a.length - 1) && this.handlePathClick(i);
              }}
            >
              {s}
              {i != this.state.path.length - 1
                ? "/"
                : this.state.isFile
                ? ""
                : "/"}
            </span>
          ))}
        </div>
        {this.state.isFile ? (
          <div id="file-container">This is file: {this.state.isFile}</div>
        ) : (
          <div id="sub-container">
            <div className="sub">
              <div className="title">Folders</div>
              {this.state.folders.map((f, i) => (
                <div
                  className="folder"
                  key={i}
                  onClick={() => this.handleDirClick(f)}
                >
                  {f}
                </div>
              ))}
            </div>
            <div className="sub">
              <div className="title">Files</div>
              {this.state.files.map((f, i) => (
                <div
                  className="file"
                  key={i}
                  onClick={() => this.handleFileClick(f)}
                >
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
