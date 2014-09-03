/** @jsx React.DOM */

var BootstrapEditor = React.createClass({
//// The following two methods are the only places we need to integrate with Bootstrap or jQuery!
//// When the component is added, turn it into a modal
  componentDidMount: function() { $(this.getDOMNode()).modal({backdrop: "static", keyboard: true, show: false}) },
  componentWillUnmount: function() { $(this.getDOMNode()).off("hidden", this.handleHidden); },
  close: function() { $(this.getDOMNode()).modal('hide'); },
  open: function() { $(this.getDOMNode()).modal('show'); },
  render: function() {
    var confirmButton = null;
    var cancelButton = null;
    var deleteButton = null;
    if (this.props.confirm) 
      confirmButton = ( <BootstrapButton onClick={this.handleConfirm} text={this.props.confirm} color="btn-primary" /> );
    if (this.props.cancel) 
      cancelButton = ( <BootstrapButton onClick={this.handleCancel} text={this.props.cancel} /> ); 
    if (this.props.delete) 
      deleteButton = ( <BootstrapButton onClick={this.handleDelete} text={this.props.delete} /> ); 

    return (
      <div className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.handleCancel} dangerouslySetInnerHTML={{__html: '&times'}} />
              <h3>{this.props.title}</h3>
            </div>
            <div className="modal-body"> {this.props.children} </div>
            <div className="modal-footer"> {confirmButton} {cancelButton} {deleteButton} </div>
          </div>
        </div>
      </div>
    );
  },
  handleDelete: function() {
    if (this.props.onDelete) {
       this.props.onDelete();
    }
  },
  handleCancel: function() {
    if (this.props.onCancel) {
       this.props.onCancel();
    }
  },
  handleConfirm: function() {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  }
});

