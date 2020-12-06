import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: ["root"],
      folders: [],
      files: []
    };
    this.struct = null;
  }

  getContents = async function() {
    // if path is a dir, returns the files or subdirectories in the dir, and their types, as well as the metadata (name and type) of the current directory
    // if path is a file, returns the metadata (name and type) of the file
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
            }
          }
        },
        anotherhome: {
          type: "dir",
          children: {
            file1: {
              type: "file"
            }
          }
        }
      }
    };

    return root;
  };

  componentDidMount() {
    this.getContents().then(d => {
      this.struct = d;
      this.getPathContent(this.state.path);
    });
  }

  getPathContent(path) {
    // navigate to path folder
    let curChildren;

    path.forEach(s => {
      if (s == "root") curChildren = this.struct.children;
      else curChildren = curChildren[s].children;
      console.log({ curChildren });
    });

    // update state
    this.setState({
      folders: Object.keys(curChildren).filter(
        c => curChildren[c].type == "dir"
      ),
      files: Object.keys(curChildren).filter(
        c => curChildren[c].type == "file"
      ),
      path
    });
  }

  handleDirClick(d) {
    const path = [...this.state.path, d];
    this.getPathContent(path);
  }

  handlePathClick(i) {
    // make path up to i
    this.getPathContent(this.state.path.slice(0, i + 1));
  }

  render() {
    return (
      <div id="main">
        <div>
          <div className="title">Current Path</div>
          {this.state.path.map((s, i) => (
            <span
              className="dir-seg"
              key={i}
              onClick={() => this.handlePathClick(i)}
            >
              {s}/
            </span>
          ))}
        </div>
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
              <div className="file" key={i}>
                {f}{" "}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
