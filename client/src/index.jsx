import React from 'react';
import ExquisiteWriter from './components/ExquisiteWriter.jsx';
import DrawCanvas from './components/DrawCanvas.jsx';
import Gallery from './components/Gallery.jsx';
import ReactDOM from 'react-dom';
import Composite from './components/composite.jsx';

var testURL = '/images/?file=legs.png'


class App extends React.Component {
  constructor(props) {
    super(props);
    //setting username
    var param_array = window.location.href.split('username=');
    var name;
    if(param_array[1]) {
      name = param_array[1].replace('#_=_','');
      name = name.replace(/%20/g, " ");
    }
    //
    this.state = {
      login: name ? name : null,
      currentView: <DrawCanvas generateImage={this.generateImage.bind(this)}/>,
      pics: [],
      fixedHead: undefined,
      fixedTorso: undefined,
      fixedLegs: undefined
    };
    this.componentSwitch = this.componentSwitch.bind(this);
    this.generateImage = this.generateImage.bind(this);
    this.saveComposite = this.saveComposite.bind(this);
  }

  componentSwitch(e) {
    e.preventDefault();
    var targetVal = e.target.innerText;
    if (targetVal === 'canvas') {
      this.setState({currentView: <DrawCanvas generateImage={this.generateImage.bind(this)}/>});
    } else if (targetVal === 'gallery') {
      this.fetchGallery();
    }
  }

  fetchGallery(artist = this.state.login) {
    fetch(`/gallery?username=${artist}`).then(res => res.json())
      .then(galleryImages => this.setState({currentView: <Gallery galleryOwner={artist} pics={galleryImages} fetchGallery={this.fetchGallery.bind(this)}/>}));
  }

  generateImage(userImage) {
    var userPart = Object.keys(userImage)[0];
    fetch(`/generate?part=${userPart}`).then(res => res.json())
      .then(generatedImage => {
        generatedImage[userPart] = userImage[userPart];
        this.setState({currentView: ''});
        this.setState({
          currentView: <Composite
              pic={generatedImage}
              userPart={userPart}
              generateImage={this.generateImage}
              saveImage={this.saveComposite}
              login={this.state.login}
              fixHead={this.fixHead.bind(this)}
              fixTorso={this.fixTorso.bind(this)}
              fixLegs={this.fixLegs.bind(this)}
              fixedHead={this.state.fixedHead}
              fixedTorso={this.state.fixedTorso}
              fixedLegs={this.state.fixedLegs}
            />
        });
      });
  }

  saveComposite(compositeImage, userPart) {
    compositeImage[userPart].artist = this.state.login;
    fetch(`/save?part=${userPart}`, {
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify(compositeImage)
    }).then(() => this.fetchGallery())
  }

  deletePartImage(part, id) {
    console.log('part, id', part, id);
    fetch(`/delete?part=${part}&id=${id}`)
    .then(() => { console.log('successfully deleted part image') })
  }

  fixHead(picPart) {
    if (this.state.fixedHead === undefined) {
      this.setState({
        fixedHead: picPart
      })
    } else {
      this.setState({
        fixedHead: undefined
      })
    }
  }

  fixTorso(picPart) {
    if (this.state.fixedTorso === undefined) {
      this.setState({
        fixedTorso: picPart
      })
    } else {
      this.setState({
        fixedTorso: undefined
      })
    }
  }

  fixLegs(picPart) {
    if (this.state.fixedLegs === undefined) {
      this.setState({
        fixedLegs: picPart
      })
    } else {
      this.setState({
        fixedLegs: undefined
      })
    }
  }

  render() {
    return (
      <div>
        <ExquisiteWriter />
        <div className="foreground">
          <div className="nav-bar">
            <h1>cadavre exquis</h1>
            <a href="#" onClick={this.componentSwitch}>canvas</a>
            {this.state.login ? (
              <span>
                <a href="#" onClick={this.componentSwitch}>gallery</a>
                <a className="user-button" href="/logout">
                  <span className="login">{this.state.login.toLowerCase()}</span>
                  <span className="logout"></span>
                </a>
              </span>
            ) : (
              <a href="/auth/facebook">login</a>
            )}
          </div>
          {this.state.currentView}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
