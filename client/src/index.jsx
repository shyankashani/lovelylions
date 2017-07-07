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
      currentView: <DrawCanvas
        generateImage={this.generateImage.bind(this)}
        fixHead={this.fixHead.bind(this)}
        fixTorso={this.fixTorso.bind(this)}
        fixLegs={this.fixLegs.bind(this)}
        />,
      pics: [],
      fixedHead: undefined,
      fixedTorso: undefined,
      fixedLegs: undefined,
      headIsFixed: true,
      torsoIsFixed: false,
      legsIsFixed: false
    };
    this.componentSwitch = this.componentSwitch.bind(this);
    this.generateImage = this.generateImage.bind(this);
    this.saveComposite = this.saveComposite.bind(this);
  }

  componentSwitch(e) {
    e.preventDefault();
    var targetVal = e.target.innerText;
    if (targetVal === 'canvas') {
      this.setState({currentView: <DrawCanvas
        generateImage={this.generateImage.bind(this)}
        fixHead={this.fixHead.bind(this)}
        fixTorso={this.fixTorso.bind(this)}
        fixLegs={this.fixLegs.bind(this)}
        />});
    } else if (targetVal === 'gallery') {
      this.fetchGallery();
    }
  }

  fetchGallery(artist = this.state.login) {
    fetch(`/gallery?username=${artist}`).then(res => res.json())
      .then(galleryImages => this.setState({currentView: <Gallery galleryOwner={artist} pics={galleryImages} fetchGallery={this.fetchGallery.bind(this)}/>}));
  }

  generateImage(userImage) {
    if (!Array.isArray(userImage)) {
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
          headIsFixed={this.state.headIsFixed}
          torsoIsFixed={this.state.torsoIsFixed}
          legsIsFixed={this.state.legsIsFixed}
          />,
          userPart: userPart
      }, ()=>{console.log('userPart:', userPart, 'generatedImage:', generatedImage ); this.setFixedPart(userPart, generatedImage[userPart])});
    });
  } else {
    fetch(`/generate?headIsFixed=${this.state.headIsFixed}&torsoIsFixed=${this.state.torsoIsFixed}&legsIsFixed=${this.state.legsIsFixed}`)
    .then(res => res.json())
    .then(generatedImage => {
      if (this.state.headIsFixed) { generatedImage.head = this.state.fixedHead }
      if (this.state.torsoIsFixed) { generatedImage.torso = this.state.fixedTorso }
      if (this.state.legsIsFixed) { generatedImage.legs = this.state.fixedLegs }
      this.setState({currentView: ''});
      this.setState({
        currentView: <Composite
        pic={generatedImage}
        userPart={this.state.userPart}
        generateImage={this.generateImage}
        saveImage={this.saveComposite}
        login={this.state.login}
        fixHead={this.fixHead.bind(this)}
        fixTorso={this.fixTorso.bind(this)}
        fixLegs={this.fixLegs.bind(this)}
        fixedHead={this.state.fixedHead}
        fixedTorso={this.state.fixedTorso}
        fixedLegs={this.state.fixedLegs}
        headIsFixed={this.state.headIsFixed}
        torsoIsFixed={this.state.torsoIsFixed}
        legsIsFixed={this.state.legsIsFixed}
        />
    });
  });
  }
  }

  setFixedPart(part, picPart) {
    if (part === 'head') { this.setState({ fixedHead: picPart }) }
    if (part === 'torso') { this.setState({ fixedTorso: picPart }) }
    if (part === 'legs') { this.setState({ fixedLegs: picPart }) }
  }

  saveComposite(compositeImage, userPart) {
    compositeImage[userPart].artist = this.state.login;
    fetch(`/save?part=${userPart}`, {
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify(compositeImage)
    }).then(() => this.fetchGallery())
  }

  changeButtonClass(id, newClass) {
    document.getElementById(id).className = newClass;
  }

  fixHead(picPart) {
    if (this.state.headIsFixed === false) {
      this.setState({
        fixedHead: picPart,
        headIsFixed: true
      }, ()=>{this.changeButtonClass('head', 'true')})
    } else {
      this.setState({
        fixedHead: undefined,
        headIsFixed: false
      }, ()=>{this.changeButtonClass('head', 'false')})
    }
  }

  fixTorso(picPart) {
    if (this.state.torsoIsFixed === false) {
      this.setState({
        fixedTorso: picPart,
        torsoIsFixed: true
      }, ()=>{this.changeButtonClass('torso', 'true')})
    } else {
      this.setState({
        fixedTorso: undefined,
        torsoIsFixed: false
      }, ()=>{this.changeButtonClass('torso', 'false')})
    }
  }

  fixLegs(picPart) {
    if (this.state.legsIsFixed === false) {
      this.setState({
        fixedLegs: picPart,
        legsIsFixed: true
      }, ()=>{this.changeButtonClass('legs', 'true')})
    } else {
      this.setState({
        fixedLegs: undefined,
        legsIsFixed: false
      }, ()=>{this.changeButtonClass('legs', 'false')})
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
