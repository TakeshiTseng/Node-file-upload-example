'use strict';

var $ = require('jquery');
var urlencode = require('urlencode');


var FileList = React.createClass({
  render: function() {
    var createFileItem = function(item) {
      return <li key={item._id}><a href={'/api/files/' + item._id}>{urlencode.decode(item.filename)}</a></li>;
    };
    return <ul>{this.props.files.map(createFileItem)}</ul>;
  }
});

var FileApp = React.createClass({
  render: function() {
    return (
      <FileList files={this.state.files} />
    );
  },
  getInitialState: function() {
    return {files: []}
  },
  handleSubmit: function(e) {
    e.preventDefault();
  },
  componentDidMount: function() {
    $.get('/api/files', function(res) {
      if(res.err) {
        this.setState({
          files: []
        });
      } else {
        this.setState({
          files: res.result
        });
      }
    }.bind(this));
  }
});

var mountNode = document.getElementById('files');
ReactDOM.render(<FileApp />, mountNode);
