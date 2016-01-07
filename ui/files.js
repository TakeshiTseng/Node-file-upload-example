'use strict';

var $ = require('jquery');
var urlencode = require('urlencode');
var Dropzone = require('react-dropzone');

var FileList = React.createClass({
  render: function() {
    var createFileItem = function(item) {
      return (<li key={item._id}>
                <a href={'/api/files/' + item._id}>{urlencode.decode(item.filename)}</a>
                &nbsp;
                <a href='#' onClick={this.props.deleteFile} id={item._id}>Delete file</a>
              </li>);
    }.bind(this);
    return <ul>{this.props.files.map(createFileItem)}</ul>;
  }
});

var FileApp = React.createClass({
  render: function() {
    return (
      <div>
        <Dropzone ref='dropzone' onDrop={this.onDrop} onDragOver={this.onDragOver} className='drop-zone' activeClassName='drop-zone-active'>
             <div>Drop file here, or click to select file to upload.</div>
        </Dropzone>
        <FileList files={this.state.files} deleteFile={this.deleteFile}/>
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
  componentDidMount: function() {
    this.updateFileList();
    this.refs.dropzone.multiple = false;
  },
  deleteFile: function(item) {
    var itemId = item.target.id;

    $.ajax({
        url: '/api/files/' + itemId,
        type: 'DELETE',
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(data, msg, jqXHR) {
          if(!data.err) {
            setTimeout(function() {
              // need a delay to ensure that file updated at db
              this.updateFileList();

            }.bind(this), 10);
          } else {
              console.log('Error: ' + data.msg);
          }
        }.bind(this),
        error: function(jqXHR, msg, err) {
          console.log("Error: " + msg);
        }.bind(this)
    });
  },
  onDrop: function(files) {
    var file = files[0];
    var data = new FormData();
    data.append('file', file);

    $.ajax({
        url: '/api/upload',
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(data, msg, jqXHR) {
          // data: return data
          if(!data.err) {
            setTimeout(function() {
              // need a delay to ensure that file updated at db
              this.updateFileList();

            }.bind(this), 10);
          } else {
              console.log('Error: ' + data.msg);
          }
        }.bind(this),
        error: function(jqXHR, msg, err) {
          console.log("Error: " + msg);
        }.bind(this)
    });
  },
  onDragOver: function(e) {
    // do nothing
  }
});

var mountNode = document.getElementById('files');
ReactDOM.render(<FileApp />, mountNode);
