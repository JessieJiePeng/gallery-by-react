require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

const imgFigureStyle = {
  width: '320px',
  height: '360px',
  margin: '0',
  padding: '40px',
  backgroundColor: '#fff'
};

//获取图片相关的数据
let imageData = require('../data/imageData.json');

//利用函数，将图片名信息转成图片URL路径信息
function genImageURL(imageDataArr) {
  for (let i = 0, j = imageDataArr.length; i < j; i++) {
    let singleImageData = imageDataArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
}

imageData = genImageURL(imageData);

class ImgFigure extends React.Component {
  render() {
    return (
      <figure className="img-figure" style={imgFigureStyle}>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title} 
             />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {
  render() {
    let controllerUnits = [];
    let imgFigures = [];
    imageData.forEach((item, index) => {
      imgFigures.push(<ImgFigure data={item} key={index} />);
    });
    return (
      <section className="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
