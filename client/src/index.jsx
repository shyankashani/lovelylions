import React from 'react';
import ExquisiteWriter from './components/ExquisiteWriter.jsx';
import DrawCanvas from './components/DrawCanvas.jsx';
import Gallery from './components/Gallery.jsx';
import ReactDOM from 'react-dom';
import Composite from './components/composite.jsx';
import MediaQuery from 'react-responsive';


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

  // on mount start polling the canvas
  componentDidMount() {
    window.setInterval(()=>{
      this.updateFave();
    }, 1000)
  }

  // update the favicon
  updateFave() {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.rel = 'shortcut icon';
    link.type = 'image/png';
    var canvas = document.getElementById('canvas');
    var test = canvas.toDataURL('image/png', 1.0);
    link.href = test;
    document.getElementsByTagName('head')[0].appendChild(link);

  componentDidUpdate() {
    ReactDOM.findDOMNode(this).scrollTop = 0;
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
        />}, ()=>{this.unfixAll()});
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
          userPartIsFixed={this.userPartIsFixed.bind(this)}
          />,
          userPart: userPart
      }, ()=>{this.setFixedPart(userPart, generatedImage[userPart])});
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
        userPartIsFixed={this.userPartIsFixed.bind(this)}
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

  userPartIsFixed() {
    if (this.state.userPart === 'head' && this.state.headIsFixed) { return true; }
    if (this.state.userPart === 'torso' && this.state.torsoIsFixed) { return true; }
    if (this.state.userPart === 'legs' && this.state.legsIsFixed) { return true; }
    return false;
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

  unfixAll() {
    this.setState({
      fixedHead: undefined,
      fixedTorso: undefined,
      fixedLegs: undefined,
      headIsFixed: true,
      torsoIsFixed: false,
      legsIsFixed: false
    })
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
        <MediaQuery minDeviceWidth={1224}>
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
                <a href="/auth/facebook" >login</a>
              )}
            </div>
            {this.state.currentView}
          </div>
        </MediaQuery>
         <MediaQuery maxDeviceWidth={1224}>
          <MediaQuery orientation='portrait'>
            <ExquisiteWriter />
            <div className='portrait'></div>
            <div className="foreground">
              <h1>cadavre exquis</h1>
              {this.state.login ? (
                <span className="mobile-login">
                  <a href="#" onClick={this.componentSwitch}>gallery</a>
                  <a className="user-button" href="/logout">
                    <span className="login">{this.state.login.toLowerCase()}</span>
                    <span className="logout"></span>
                  </a>
                </span>
              ) : (
                <a className="mobile-login" href="/auth/facebook" >login</a>
              )}       
          </div>
          </MediaQuery>
          <MediaQuery orientation='landscape'>
            <ExquisiteWriter />
            <div className="foreground">
              {this.state.currentView}     
            </div> 
          </MediaQuery>
        </MediaQuery>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
