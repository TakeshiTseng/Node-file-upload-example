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
      <div>
        <form onSubmit={this.handleSubmit} encType="multipart/form-data" action="/api/upload" method="POST">
          <input name="file" type="file" onChange={this.handleFileChange} />
          <input name="submit" type="submit" />
        </form>
        <FileList files={this.state.files} />
      </div>
    );
  },
  getInitialState: function() {
    return {
      files: [],
      fileToUpload: null
    }
  },
  updateFileList: function() {
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
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var data = new FormData();
    if(!this.state.fileToUpload) {
      // ignore when file is empty
      return;
    }
    data.append('file', this.state.fileToUpload);

    $.ajax({
        url: '/api/upload',
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(data, msg, jqXHR) {
            if(typeof data.error === 'undefined')
            {
              this.updateFileList();
            } else {
                console.log('Error: ' + data.error);
            }
        }.bind(this),
        error: function(jqXHR, msg, err) {
          console.log("Error: " + msg);
        }.bind(this)
    });
  },
  handleFileChange: function(e) {
    var file = e.target.files[0];
    this.setState({fileToUpload: e.target.files[0]});
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
